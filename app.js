// app.js
import { displayMessage, downloadDataUrlAsFile } from './utils.js';
import { fetchOrdersByDateAndSlot, fetchSingleOrderDetails } from './order-api.js';

// Get references to HTML elements
const orderDateInput = document.getElementById('orderDate');
const orderSlotSelect = document.getElementById('orderSlot');
const fetchOrdersBtn = document.getElementById('fetchOrdersBtn');
const orderIdInput = document.getElementById('orderIdInput');
const fetchSingleOrderBtn = document.getElementById('fetchSingleOrderBtn');
const downloadAllImagesBtn = document.getElementById('downloadAllImagesBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const imageGeneratingIndicator = document.getElementById('imageGeneratingIndicator');
const ordersContainer = document.getElementById('ordersContainer');

// Set default date to today's date
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
orderDateInput.value = `${year}-${month}-${day}`;

// Set default order slot to 'morning'
orderSlotSelect.value = 'morning';

// Event Listener for Fetch Orders button
fetchOrdersBtn.addEventListener('click', () => {
    const formattedDate = orderDateInput.value;
    const slotFilter = orderSlotSelect.value;
    fetchOrdersByDateAndSlot(formattedDate, slotFilter, ordersContainer, loadingIndicator, fetchOrdersBtn, fetchSingleOrderBtn, downloadAllImagesBtn);
});

// Event Listener for Fetch Single Order button
fetchSingleOrderBtn.addEventListener('click', () => {
    const fetchOrderNumber = orderIdInput.value.trim();
    fetchSingleOrderDetails(fetchOrderNumber, ordersContainer, loadingIndicator, fetchOrdersBtn, fetchSingleOrderBtn, downloadAllImagesBtn);
});

// Event Listener for individual "Download Image" buttons on dynamically added order cards
ordersContainer.addEventListener('click', async (event) => {
    if (event.target.classList.contains('download-image-btn')) {
        const button = event.target;
        const orderNumber = button.dataset.orderNumber; // This already gets the correct order number for single downloads
        const targetId = button.dataset.targetId;
        const cardToDownload = document.getElementById(targetId);

        if (cardToDownload) {
            displayMessage(`Generating image for order #${orderNumber}...`, 'info');

            button.style.display = 'none'; // Hide the button before capturing
            try {
                const canvas = await html2canvas(cardToDownload, {
                    scale: 3, // Increased scale for higher resolution (suitable for A4 print)
                    useCORS: true,
                    logging: false
                });
                const dataUrl = canvas.toDataURL('image/png');
                downloadDataUrlAsFile(`order-summary-${orderNumber}.png`, dataUrl);
                displayMessage(`Successfully generated and downloaded image for order #${orderNumber}.`, 'success');
            } catch (error) {
                console.error(`Error generating image for order #${orderNumber}:`, error);
                displayMessage(`Failed to generate image for order #${orderNumber}. Error: ${error.message}`, 'error');
            } finally {
                button.style.display = ''; // Show the button again after capture
            }
        } else {
            displayMessage(`Could not find order card with ID: ${targetId}`, 'error');
        }
    }
});

// Event Listener for "Download All Summaries as Images" button
downloadAllImagesBtn.addEventListener('click', async () => {
    const orderCards = ordersContainer.querySelectorAll('.order-card');
    if (orderCards.length === 0) {
        displayMessage('No order summaries to download.', 'info');
        return;
    }

    imageGeneratingIndicator.classList.remove('hidden');
    displayMessage('Starting image generation for all orders...', 'info');

    const downloadButtons = []; // Store references to buttons to re-show them later
    orderCards.forEach(card => {
        const button = card.querySelector('.download-image-btn');
        if (button) {
            button.style.display = 'none'; // Hide all download buttons
            downloadButtons.push(button);
        }
    });

    try {
        for (let i = 0; i < orderCards.length; i++) {
            const card = orderCards[i];

            // --- START OF CHANGES ---
            // Extract order number directly from the card's ID for robustness
            const cardId = card.id; // e.g., "order-card-12345"
            const orderNumberMatch = cardId.match(/order-card-(\d+)/);
            const orderNumber = orderNumberMatch ? orderNumberMatch[1] : `unknown`; // Use "unknown" as a fallback

            displayMessage(`Generating image ${i + 1}/${orderCards.length} for order #${orderNumber}...`, 'info');

            const canvas = await html2canvas(card, {
                scale: 3, // Increased scale for higher resolution (suitable for A4 print)
                useCORS: true,
                logging: false
            });
            const dataUrl = canvas.toDataURL('image/png');
            // New filename format: order-summary-{orderNumber}-{sequentialNumber}.png
            downloadDataUrlAsFile(`order-summary-${orderNumber}-${i + 1}.png`, dataUrl);
            // --- END OF CHANGES ---
        }
        displayMessage(`Successfully generated and downloaded all ${orderCards.length} order summaries as images.`, 'success');
    } catch (error) {
        console.error('Error generating all images:', error);
        displayMessage(`Failed to generate all images. Some might have failed. Error: ${error.message}`, 'error');
    } finally {
        imageGeneratingIndicator.classList.add('hidden');
        // Show all buttons again
        downloadButtons.forEach(button => {
            button.style.display = '';
        });
    }
});