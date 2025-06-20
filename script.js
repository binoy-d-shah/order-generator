// Get references to HTML elements
const orderDateInput = document.getElementById('orderDate');
const orderSlotSelect = document.getElementById('orderSlot');
const fetchOrdersBtn = document.getElementById('fetchOrdersBtn');
const orderIdInput = document.getElementById('orderIdInput'); // New input for single order ID
const fetchSingleOrderBtn = document.getElementById('fetchSingleOrderBtn'); // New button for single order
const downloadAllImagesBtn = document.getElementById('downloadAllImagesBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const imageGeneratingIndicator = document.getElementById('imageGeneratingIndicator');
const messageBox = document.getElementById('messageBox');
const ordersContainer = document.getElementById('ordersContainer');

const baseUrl = 'https://xmbmcqrij4.execute-api.eu-central-1.amazonaws.com/prod/';

// Hardcoded values for ID Token and Refresh Token
// IMPORTANT: Replace these with your actual tokens for the application to function.
let currentIdToken = 'eyJraWQiOiJUZjF2OUV3MGlVNFJZbkMzSDQ3cVJxejNOUVpVaWFHeDJWRnZ4Z3dHUUVjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmM2Y0NDgwMi05MDgxLTcwZjYtMDMxNS03ZTQ1MzJkOWEwODciLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfZVpWeXJRSGd4IiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjp0cnVlLCJjb2duaXRvOnVzZXJuYW1lIjoiZjNmNDQ4MDItOTA4MS03MGY2LTAzMTUtN2U0NTMyZDlhMDg3Iiwib3JpZ2luX2p0aSI6Ijg3OTRjYmI2LTRkMWUtNDVkOS05MGI4LWRhODIyN2Q0ZjAzYSIsImN1c3RvbTp1c2VyVHlwZSI6ImFkbWluIiwiYXVkIjoiNHRkMjlhY2ptYWhjMWdyZGlsdjllbmh0OTciLCJldmVudF9pZCI6ImUxZDVjNmJmLWM3MTEtNGExZS04YjI2LWYyMGUzN2MzZDFkOSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQ4NzA4MTI1LCJuYW1lIjoiQWRtaW4gVXNlciIsInBob25lX251bWJlciI6Iis0NDc5OTkyOTcwNDgiLCJleHAiOjE3NTA0ODU0ODMsImlhdCI6MTc1MDM5OTA4MywianRpIjoiNDY5YTE0YzItYTAzYy00MGNjLWEyYTctOGMxZDc1YzY2YjdmIiwiZW1haWwiOiJhZG1pbkBnZXJtYW55LXdlZGVsaXZlci5kZSJ9.Vfhz5E84SEmpmFrAlanRxPu52teDgFMaVHywj00MilOS_PP6CloFdraPKWhSM_MVxpYd5M5CFZxFWzFWITw-jng4JldU8H5iO5Zqy8wqPUf7n9yyQaQm8IxMXD-JuYh6WWdwPx7N7m8BjZLc7nCBNqJtjp8Tk5903D6P-iOaIPX80TvUB0iNG3cEpo-jJEL_r0bW-MEjJIhVYTd4_4W6FbpRDMHVVGwLQAhnwnoWJIxinkGe7wnq4HdIZu2gPEGvFtMFygYuOoZ530UPDv6AAAflLk-pV07X-G8AiuaxbtJLXVADFJR9VTTJFJLeN7PcVOKbIHeEgvu15No0JV-QMg';
const refreshToken = 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.Nm1w3R3xCOMTJlYO-toNck9o24ddgyugrZFGl-tLxSRJa1WZCUJWTv8rO_3TfOgNVpvc5m6ewJ0IiEBwW145RkKOtr927TVRyrgbTPMl8W1El5At4Y4jTbSsGMOaAq4Ox89UYHCTa6QFwNEmF92UqE0A0Jyqb_i_2KBgj5r26ibtj4VrR3XHM-Ezt2KpyqQGhKcZijorn2BU_-6XzITlKvX0vAGryCBIj2qJu4z0-FB9ShUr2Xe3q-Dg5x1FLIM_Y9QxpaCNkx4T0gdcw72ZS5ZNKb6DMtSWFa5MpEQ9fEVsMygIWTdnlVKm_VHBGSjJTnMlIDcH--2JNuINoKkRPg.q64pEkhmFhwRyMrI.hJmZwHEJ_KEFJMcd7vjavpnBbiFrLvXJBG1qwX-5CO6Kwp8xWlGkNhxY67_mOZvOnfyZqpBIYt_Od6B9zjF-EHarlZwEKS83T5yI_nb4fHF1tfsRbY-I1eODcy_1PNyKsnKvT6eIJfMkxrObTCGyYNrWHn4PyaC76IYAygUHwrkDXiBsUos-WJVVcCG6LBYX9zILdYQqVFqkyTB912zJnhe92llp9f9GE32yVN6vJKu6bGd5nu_twGpMYMWhc-Rzqmmr-aq0XBUFPo1BAsWnlBrKwlLVW_Z-Cd3WSuOvFisHeXZFPhQ17tCe3azjy4_fC4In9nLFoO0_NH0c0h9aJkEZmRjEBqSiAMv3WGKghSba2ZT1N9ixg7DSfdVmKKk_EsprLjY7uNj4ei4ZpKNY1qAgFM9Kp-Iu_LSbCKzlvJcj4pvPHyGBMzZ5H3SayV9PRfSW8KobIxLfx8KGYqtzHBSR9JBb5TwaJjNYJWejlQYpTt9-3EBchFwvxnHOpijuzLNmNirBeOUvKO7AOaH18VbdAdecris7xWJ2nrhx4TKPyne_l9Sm1rcjzzWzNCcP7CYE7N4AVyrEM0hHsrKvPwacWsRqWpm08KGS_K6cD4kD36YRT1egdXuf4UymXjypxKhGpzDGzwDOnKUPOFitX_u332C9aiPUjql9XpQUymAXKk0aPSVT2hwJaV6axnhQr53OjiWi7TYKpmSYSL8CHyKyoBIPPgEQIbcgPPOmKRT6COgpyBwdHjHsD2NGVUKRcGxuIU2YpispOh6tqsrGevZowq2Mj9BxhJmNKAGQNbSIruCjpM9fC0TWgd-_W1-uZd1ogTFYmrmwp8-YcAiSjf-1txi04nIFved9_ORoFL5PIwBLQUEIPsDL0kcHBMkiJDUZEBBxOtMohu4ZbDrex0Bpr_BC1jb_SqKo9B67SGMv288xAyqpRqHiBdhHp-kWpSZZPsPn1rlZyOM7nkssp3bktxyGYgzLtLfNO0BK0zP9oU3sQRQ-0QTFlBDY5JSAY385OPjZvYtZfhmHf464NUgaoRrj2o1xVfRj_mIuatUCCR7B9YOuTDKKZLyhD9whBRruTTGkdet_6s5Gb3IDFoEgXDDyTw9qwEF65xiRqPNF2dVY6vvtSRB2A73j9FdkllT3e4bzjchU-Fnz_5aqds7MxtHxetf1GYBcX0CoW6wNCN7EkS7xHKxJMjWwOpsuf5vKvenMOd67Z1NFYLsmbqxya-AZBYMw0ws79gHHYKKQp47ZOgre4qgR9ZAgsWT_QK_-tksALGmmoAybCfSIuYmPPehsemethS2vzdmiNpDe0YYjnQWh4au9tzXLZIk0nzzR.GIdCgCwlDr6aYZ0fj0tXAw';


/**
 * Displays a message in the message box.
 * @param {string} message The message to display.
 * @param {string} type The type of message (success, error, info).
 */
function displayMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = 'mt-6 p-4 rounded-md text-sm'; // Reset classes and keep text-sm
    messageBox.classList.remove('hidden');

    switch (type) {
        case 'success':
            messageBox.classList.add('bg-green-100', 'text-green-800', 'border', 'border-green-400');
            break;
        case 'error':
            messageBox.classList.add('bg-red-100', 'text-red-800', 'border', 'border-red-400');
            break;
        case 'info':
        default:
            messageBox.classList.add('bg-blue-100', 'text-blue-800', 'border', 'border-blue-400');
            break;
    }
}

/**
 * Capitalizes the first letter of a string and converts the rest to lowercase.
 * @param {string} name The input string.
 * @returns {string} The capitalized string.
 */
function capitalize(name) {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/**
 * Generates HTML for an order summary from JSON data, including a download button.
 * Each order card will have a unique ID for html2canvas targeting.
 * @param {object} order The order data.
 * @param {string} weekday The weekday name for the delivery date.
 * @returns {string} The HTML string for the order summary.
 */
function generateHtmlFromJson(order, weekday) {
    const customer = order.ordersToUsersCustomer;
    const subOrder = order.subOrders && order.subOrders.length > 0 ? order.subOrders[0] : null;
    const formattedName = `${capitalize(customer.firstName)} ${capitalize(customer.lastName)}`;

    const itemsRows = subOrder && subOrder.orderItems ? subOrder.orderItems
        .map(
            (item) =>
                `<tr>
                    <td>${item.brandName || 'N/A'}</td>
                    <td>${item.productName || 'N/A'}</td>
                    <td>${item.weight || 'N/A'}</td>
                    <td>${item.quantity || 'N/A'}</td>
                    <td>€${item.amount ? item.amount.toFixed(2) : '0.00'}</td>
                </tr>`
        )
        .join('') : '<tr><td colspan="5" class="text-center text-gray-500">No items found for this sub-order.</td></tr>';

    const deliveryInstruction = order.deliveryInstruction || 'None';

    // Each order card needs a unique ID to be targeted by html2canvas
    const cardId = `order-card-${order.orderNumber}`;

    return `
        <div class="order-card" id="${cardId}" data-order-number="${order.orderNumber}"> <div class="download-btn-container js-download-btn-container">
                <button class="download-image-btn bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded-lg text-xs sm:text-sm"
                        data-order-number="${order.orderNumber}"
                        data-target-id="${cardId}"> Download Image
                </button>
            </div>
            <h2 class="text-lg sm:text-xl font-bold text-gray-700 mb-2 sm:mb-4">Order Summary - #${order.orderNumber}</h2> <div class="order-details-content"> <p class="text-xs sm:text-sm text-gray-600 mb-1"><strong>Customer:</strong> ${formattedName}</p>
                <p class="text-xs sm:text-sm text-gray-600 mb-1"><strong>Delivery Date:</strong> ${order.deliverySlotDate} (${weekday})</p>
                <p class="text-xs sm:text-sm text-gray-600 mb-1"><strong>Total Amount:</strong> €${order.amount ? order.amount.toFixed(2) : '0.00'}</p>
                <p class="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4"><strong>Special Instructions:</strong> ${deliveryInstruction}</p>
            </div>

            <h3 class="text-base sm:text-lg font-semibold text-gray-700 mb-2">Items</h3> <table>
                <thead>
                    <tr><th>Brand</th><th>Product</th><th>Weight</th><th>Quantity</th><th>Amount</th></tr>
                </thead>
                <tbody>
                    ${itemsRows}
                </tbody>
            </table>
        </div>`;
}

/**
 * Triggers the download of a file.
 * @param {string} filename The name of the file to download.
 * @param {string} dataUrl The data URL (e.g., base64 image data) of the file.
 */
function downloadDataUrlAsFile(filename, dataUrl) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

/**
 * Fetches and displays multiple orders based on date and slot.
 */
async function fetchOrdersByDateAndSlot() {
    // Clear previous orders and messages
    ordersContainer.innerHTML = '<p class="text-center text-gray-500 text-sm">Enter details and click \'Fetch Orders\' to see summaries.</p>';
    messageBox.classList.add('hidden');
    loadingIndicator.classList.remove('hidden');
    fetchOrdersBtn.disabled = true;
    fetchSingleOrderBtn.disabled = true; // Disable other button during fetch
    downloadAllImagesBtn.classList.add('hidden'); // Hide until orders are fetched

    const formattedDate = orderDateInput.value.trim();
    const slotFilter = orderSlotSelect.value.trim().toLowerCase();

    if (!formattedDate) {
        displayMessage('Please provide an Order Date.', 'error');
        loadingIndicator.classList.add('hidden');
        fetchOrdersBtn.disabled = false;
        fetchSingleOrderBtn.disabled = false;
        return;
    }

    const date = new Date(formattedDate);
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });

    try {
        displayMessage('Refreshing authentication token...', 'info');
        const refreshResponse = await fetch(`${baseUrl}/user-management/api/v1/users/6/refreshToken`, {
            method: 'POST',
            headers: {
                'Idtoken': currentIdToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken: refreshToken })
        });

        if (!refreshResponse.ok) {
            const errorText = await refreshResponse.text();
            throw new Error(`Token refresh failed: ${refreshResponse.status} - ${errorText}`);
        }

        const refreshJsonData = await refreshResponse.json();
        currentIdToken = refreshJsonData.data.idToken.trim();
        displayMessage('Token refreshed successfully. Fetching orders...', 'info');

        const ordersResponse = await fetch(`${baseUrl}/order-management/api/v1/orders?deliveryDateTimeFrom=${formattedDate}T00:00:00.000Z&deliveryDateTimeTo=${formattedDate}T23:59:59.000Z&pageSize=75`, {
            method: 'GET',
            headers: {
                'Idtoken': currentIdToken,
                'Content-Type': 'application/json'
            }
        });

        if (!ordersResponse.ok) {
            const errorText = await ordersResponse.text();
            throw new Error(`Failed to fetch orders: ${ordersResponse.status} - ${errorText}`);
        }

        const ordersJson = await ordersResponse.json();
        const orders = ordersJson.data?.orders ?? [];

        const filteredOrders = orders.filter(order => {
            const slot = order.ordersToSlots;
            const status = order.orderStatus?.toString().trim().toLowerCase();
            const excludedStatuses = new Set(['cancelled', 'paymentfailed']);

            const slotMatches =
                slotFilter === 'morning'
                    ? slot?.startTime === '10:00:00' && slot?.endTime === '13:00:00'
                        ? true : false
                    : slotFilter === 'evening'
                        ? slot?.startTime === '18:00:00' && slot?.endTime === '21:00:00'
                            ? true : false
                        : slotFilter === 'all';

            const isAccepted = status && !excludedStatuses.has(status);

            return slotMatches && isAccepted;
        });

        if (filteredOrders.length === 0) {
            ordersContainer.innerHTML = '<p class="text-center text-gray-500 text-sm">No orders found for the selected criteria.</p>';
            displayMessage('No orders found for the specified date and slot, or all orders were excluded.', 'info');
            return;
        }

        ordersContainer.innerHTML = ''; // Clear initial message

        // Use Promise.all to fetch details in parallel for better performance
        const fetchDetailPromises = filteredOrders.map(async (order) => {
            displayMessage(`Fetching details for order #${order.orderNumber}...`, 'info');
            const detailResponse = await fetch(`${baseUrl}/order-management/api/v1/orders/${order.id}`, {
                method: 'GET',
                headers: {
                    'Idtoken': currentIdToken,
                    'Content-Type': 'application/json'
                }
            });

            if (!detailResponse.ok) {
                console.error(`Failed to fetch details for order ${order.id}: ${detailResponse.status}`);
                return null; // Return null for failed fetches
            }

            const detailJsonData = await detailResponse.json();
            return detailJsonData.data && detailJsonData.data.order ? detailJsonData.data.order : null;
        });

        const detailedOrders = (await Promise.all(fetchDetailPromises)).filter(Boolean); // Filter out nulls

        if (detailedOrders.length === 0) {
            ordersContainer.innerHTML = '<p class="text-center text-gray-500 text-sm">No detailed orders could be retrieved.</p>';
            displayMessage('No detailed orders could be retrieved after fetching.', 'error');
            return;
        }

        detailedOrders.forEach(order => {
            const html = generateHtmlFromJson(order, weekday);
            ordersContainer.insertAdjacentHTML('beforeend', html);
        });

        displayMessage(`Successfully loaded ${detailedOrders.length} order summaries.`, 'success');
        downloadAllImagesBtn.classList.remove('hidden'); // Show download all button

    } catch (error) {
        console.error('Error during order processing:', error);
        displayMessage(`Error: ${error.message}. Please ensure the tokens are valid and try again.`, 'error');
    } finally {
        loadingIndicator.classList.add('hidden');
        fetchOrdersBtn.disabled = false;
        fetchSingleOrderBtn.disabled = false;
    }
}

/**
 * Fetches and displays a single order by its order number.
 */
async function fetchSingleOrderDetails() {
    // Clear previous orders and messages
    ordersContainer.innerHTML = '<p class="text-center text-gray-500 text-sm">Enter details and click \'Fetch Orders\' to see summaries.</p>';
    messageBox.classList.add('hidden');
    loadingIndicator.classList.remove('hidden');
    fetchOrdersBtn.disabled = true; // Disable other button during fetch
    fetchSingleOrderBtn.disabled = true;
    downloadAllImagesBtn.classList.add('hidden');

    const fetchOrderNumber = orderIdInput.value.trim();

    if (!fetchOrderNumber) {
        displayMessage('Please enter an Order Number.', 'error');
        loadingIndicator.classList.add('hidden');
        fetchOrdersBtn.disabled = false;
        fetchSingleOrderBtn.disabled = false;
        return;
    }

    try {
        displayMessage('Refreshing authentication token...', 'info');
        const refreshResponse = await fetch(`${baseUrl}/user-management/api/v1/users/6/refreshToken`, {
            method: 'POST',
            headers: {
                'Idtoken': currentIdToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken: refreshToken })
        });

        if (!refreshResponse.ok) {
            const errorText = await refreshResponse.text();
            throw new Error(`Token refresh failed: ${refreshResponse.status} - ${errorText}`);
        }

        const refreshJsonData = await refreshResponse.json();
        currentIdToken = refreshJsonData.data.idToken.trim();
        displayMessage(`Token refreshed successfully. Fetching order #${fetchOrderNumber}...`, 'info');

        // First, get the order ID by order number
        const searchOrderResponse = await fetch(`${baseUrl}/order-management/api/v1/orders?orderNumber=${fetchOrderNumber}&pageSize=1`, {
            method: 'GET',
            headers: {
                'Idtoken': currentIdToken,
                'Content-Type': 'application/json'
            }
        });

        if (!searchOrderResponse.ok) {
            const errorText = await searchOrderResponse.text();
            throw new Error(`Failed to search for order by number: ${searchOrderResponse.status} - ${errorText}`);
        }

        const searchJson = await searchOrderResponse.json();
        const foundOrders = searchJson.data?.orders ?? [];

        if (foundOrders.length === 0) {
            ordersContainer.innerHTML = '<p class="text-center text-gray-500 text-sm">No order found with the provided Order Number.</p>';
            displayMessage(`No order found for Order Number: ${fetchOrderNumber}.`, 'info');
            return;
        }

        const orderIdToFetch = foundOrders[0].id; // Take the first matching order ID

        // Then, fetch the full details of that specific order
        const detailResponse = await fetch(`${baseUrl}/order-management/api/v1/orders/${orderIdToFetch}`, {
            method: 'GET',
            headers: {
                'Idtoken': currentIdToken,
                'Content-Type': 'application/json'
            }
        });

        if (!detailResponse.ok) {
            const errorText = await detailResponse.text();
            throw new Error(`Failed to fetch details for order ID ${orderIdToFetch}: ${detailResponse.status} - ${errorText}`);
        }

        const detailJsonData = await detailResponse.json();
        if (detailJsonData.data && detailJsonData.data.order) {
            const order = detailJsonData.data.order;
            const weekday = new Date(order.deliverySlotDate).toLocaleDateString('en-US', { weekday: 'long' });
            const html = generateHtmlFromJson(order, weekday);
            ordersContainer.innerHTML = html; // Display only this single order
            displayMessage(`Successfully loaded details for order #${order.orderNumber}.`, 'success');
            downloadAllImagesBtn.classList.add('hidden'); // Hide "Download All" for single order view
        } else {
            ordersContainer.innerHTML = '<p class="text-center text-gray-500 text-sm">Failed to retrieve detailed information for the order.</p>';
            displayMessage('Failed to retrieve detailed information for the order.', 'error');
        }

    } catch (error) {
        console.error('Error fetching single order:', error);
        displayMessage(`Error: ${error.message}. Please check the Order Number or your tokens.`, 'error');
    } finally {
        loadingIndicator.classList.add('hidden');
        fetchOrdersBtn.disabled = false;
        fetchSingleOrderBtn.disabled = false;
    }
}


// Event listener for the "Fetch Orders by Date" button
fetchOrdersBtn.addEventListener('click', fetchOrdersByDateAndSlot);

// Event listener for the "Fetch Single Order" button
fetchSingleOrderBtn.addEventListener('click', fetchSingleOrderDetails);


// Event listener for individual download image buttons (delegated)
ordersContainer.addEventListener('click', async (event) => {
    if (event.target.classList.contains('download-image-btn')) {
        const button = event.target;
        const orderNumber = button.dataset.orderNumber;
        const targetId = button.dataset.targetId;
        const targetElement = document.getElementById(targetId);
        const downloadBtnContainer = button.closest('.js-download-btn-container'); // Find the container

        if (targetElement) {
            displayMessage(`Generating image for order #${orderNumber}...`, 'info');
            imageGeneratingIndicator.classList.remove('hidden');

            try {
                // Temporarily hide the download button container
                if (downloadBtnContainer) {
                    downloadBtnContainer.classList.add('hidden');
                }

                // Store original width and set new width for portrait mode
                const originalWidth = targetElement.style.width;
                targetElement.style.width = '794px'; // Approximate A4 portrait width in pixels at 96 DPI

                // Add a small delay for mobile browsers to ensure rendering is complete
                await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay

                const canvas = await html2canvas(targetElement, {
                    scale: 2, // Increase scale for better resolution
                    useCORS: true, // Important if your content includes images from other domains
                    logging: false // Disable logging for cleaner console
                });
                const dataUrl = canvas.toToDataURL('image/png'); // Convert canvas to PNG data URL
                downloadDataUrlAsFile(`order-summary-${orderNumber}.png`, dataUrl);
                displayMessage(`Image for order #${orderNumber} downloaded successfully!`, 'success');
            } catch (error) {
                console.error('Error generating image for individual order:', error);
                displayMessage(`Failed to generate image for order #${orderNumber}. Error: ${error.message}`, 'error');
            } finally {
                // Revert width
                targetElement.style.width = originalWidth;
                imageGeneratingIndicator.classList.add('hidden');
                // Always show the button again, even if there was an error
                if (downloadBtnContainer) {
                    downloadBtnContainer.classList.remove('hidden');
                }
            }
        } else {
            // This is the error message you're seeing. Log more info for debugging.
            console.error(`Error: Could not find element with ID "${targetId}" for order #${orderNumber}.`);
            displayMessage('Error: Could not find the order card to generate an image. It might not be fully loaded.', 'error');
        }
    }
});

// Event listener for "Download All Summaries as Images" button
downloadAllImagesBtn.addEventListener('click', async () => {
    const orderCards = document.querySelectorAll('.order-card');
    if (orderCards.length === 0) {
        displayMessage('No orders to download as images.', 'info');
        return;
    }

    displayMessage(`Generating ${orderCards.length} images... This may take a moment.`, 'info');
    imageGeneratingIndicator.classList.remove('hidden');

    // Collect all download button containers
    const allDownloadBtnContainers = document.querySelectorAll('.js-download-btn-container');
    // Temporarily hide all of them
    allDownloadBtnContainers.forEach(container => container.classList.add('hidden'));

    try {
        for (let i = 0; i < orderCards.length; i++) {
            const card = orderCards[i];
            // Get order number from data attribute for robust naming
            const orderNumber = card.dataset.orderNumber; // Directly get from data attribute

            displayMessage(`Generating image ${i + 1}/${orderCards.length} for order #${orderNumber}...`, 'info');

            // Store original width and set new width for portrait mode
            const originalWidth = card.style.width;
            card.style.width = '794px'; // Approximate A4 portrait width in pixels at 96 DPI

            // Add a small delay for each image generation too
            await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay per card

            const canvas = await html2canvas(card, {
                scale: 2,
                useCORS: true,
                logging: false
            });
            const dataUrl = canvas.toDataURL('image/png');
            downloadDataUrlAsFile(`order-summary-${orderNumber}.png`, dataUrl);

            // Revert width after capturing
            card.style.width = originalWidth;
        }
        displayMessage(`Successfully generated and downloaded all ${orderCards.length} order summaries as images.`, 'success');
    } catch (error) {
        console.error('Error generating all images:', error);
        displayMessage(`Failed to generate all images. Some might have failed. Error: ${error.message}`, 'error');
    } finally {
        imageGeneratingIndicator.classList.add('hidden');
        // Always show all buttons again, even if there was an error
        allDownloadBtnContainers.forEach(container => container.classList.remove('hidden'));
    }
});

// Set default date to today's date
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
const dd = String(today.getDate()).padStart(2, '0');
orderDateInput.value = `${yyyy}-${mm}-${dd}`;