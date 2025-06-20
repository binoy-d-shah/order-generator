// order-api.js
import config from './config.js'; // Import the default config object
import { displayMessage } from './utils.js';
import { generateHtmlFromJson } from './ui-renderer.js';

/**
 * Fetches and displays multiple orders based on date and slot.
 * @param {string} formattedDate The date in YYYY-MM-DD format.
 * @param {string} slotFilter The slot filter ('morning', 'evening', 'all').
 * @param {HTMLElement} ordersContainer The HTML element to display orders in.
 * @param {HTMLElement} loadingIndicator The loading indicator HTML element.
 * @param {HTMLElement} fetchOrdersBtn The button to enable/disable.
 * @param {HTMLElement} fetchSingleOrderBtn The other fetch button to enable/disable.
 * @param {HTMLElement} downloadAllImagesBtn The download all images button.
 */
async function fetchOrdersByDateAndSlot(formattedDate, slotFilter, ordersContainer, loadingIndicator, fetchOrdersBtn, fetchSingleOrderBtn, downloadAllImagesBtn) {
    // Clear previous orders and messages
    ordersContainer.innerHTML = '<p class="text-center text-gray-500">Enter details and click \'Fetch Orders\' to see summaries.</p>';
    displayMessage('', 'info').classList.add('hidden'); // Clear message and hide
    loadingIndicator.classList.remove('hidden');
    fetchOrdersBtn.disabled = true;
    fetchSingleOrderBtn.disabled = true; // Disable other button during fetch
    downloadAllImagesBtn.classList.add('hidden'); // Hide until orders are fetched

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
        const refreshResponse = await fetch(`${config.baseUrl}/user-management/api/v1/users/6/refreshToken`, {
            method: 'POST',
            headers: {
                'Idtoken': config.currentIdToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken: config.refreshToken })
        });

        if (!refreshResponse.ok) {
            const errorText = await refreshResponse.text();
            throw new Error(`Token refresh failed: ${refreshResponse.status} - ${errorText}`);
        }

        const refreshJsonData = await refreshResponse.json();
        config.currentIdToken = refreshJsonData.data.idToken.trim(); // Update the token in config
        displayMessage('Token refreshed successfully. Fetching orders...', 'info');

        const ordersResponse = await fetch(`${config.baseUrl}/order-management/api/v1/orders?deliveryDateTimeFrom=${formattedDate}T00:00:00.000Z&deliveryDateTimeTo=${formattedDate}T23:59:59.000Z&pageSize=75`, {
            method: 'GET',
            headers: {
                'Idtoken': config.currentIdToken,
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
            ordersContainer.innerHTML = '<p class="text-center text-gray-500">No orders found for the selected criteria.</p>';
            displayMessage('No orders found for the specified date and slot, or all orders were excluded.', 'info');
            return;
        }

        ordersContainer.innerHTML = ''; // Clear initial message

        for (const order of filteredOrders) {
            displayMessage(`Fetching details for order #${order.orderNumber}...`, 'info');
            const detailResponse = await fetch(`${config.baseUrl}/order-management/api/v1/orders/${order.id}`, {
                method: 'GET',
                headers: {
                    'Idtoken': config.currentIdToken,
                    'Content-Type': 'application/json'
                }
            });

            if (!detailResponse.ok) {
                console.error(`Failed to fetch details for order ${order.id}: ${detailResponse.status}`);
                continue;
            }

            const detailJsonData = await detailResponse.json();
            if (detailJsonData.data && detailJsonData.data.order) {
                const html = generateHtmlFromJson(detailJsonData.data.order, weekday);
                ordersContainer.insertAdjacentHTML('beforeend', html);
            }
        }
        displayMessage(`Successfully loaded ${filteredOrders.length} order summaries.`, 'success');
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
 * @param {string} fetchOrderNumber The order number to fetch.
 * @param {HTMLElement} ordersContainer The HTML element to display orders in.
 * @param {HTMLElement} loadingIndicator The loading indicator HTML element.
 * @param {HTMLElement} fetchOrdersBtn The button to enable/disable.
 * @param {HTMLElement} fetchSingleOrderBtn The other fetch button to enable/disable.
 * @param {HTMLElement} downloadAllImagesBtn The download all images button.
 */
async function fetchSingleOrderDetails(fetchOrderNumber, ordersContainer, loadingIndicator, fetchOrdersBtn, fetchSingleOrderBtn, downloadAllImagesBtn) {
    // Clear previous orders and messages
    ordersContainer.innerHTML = '<p class="text-center text-gray-500">Enter details and click \'Fetch Orders\' to see summaries.</p>';
    displayMessage('', 'info').classList.add('hidden'); // Clear message and hide
    loadingIndicator.classList.remove('hidden');
    fetchOrdersBtn.disabled = true; // Disable other button during fetch
    fetchSingleOrderBtn.disabled = true;
    downloadAllImagesBtn.classList.add('hidden');

    if (!fetchOrderNumber) {
        displayMessage('Please enter an Order Number.', 'error');
        loadingIndicator.classList.add('hidden');
        fetchOrdersBtn.disabled = false;
        fetchSingleOrderBtn.disabled = false;
        return;
    }

    try {
        displayMessage('Refreshing authentication token...', 'info');
        const refreshResponse = await fetch(`${config.baseUrl}/user-management/api/v1/users/6/refreshToken`, {
            method: 'POST',
            headers: {
                'Idtoken': config.currentIdToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken: config.refreshToken })
        });

        if (!refreshResponse.ok) {
            const errorText = await refreshResponse.text();
            throw new Error(`Token refresh failed: ${refreshResponse.status} - ${errorText}`);
        }

        const refreshJsonData = await refreshResponse.json();
        config.currentIdToken = refreshJsonData.data.idToken.trim(); // Update the token in config
        displayMessage(`Token refreshed successfully. Fetching order #${fetchOrderNumber}...`, 'info');

        // First, get the order ID by order number
        const searchOrderResponse = await fetch(`${config.baseUrl}/order-management/api/v1/orders?orderNumber=${fetchOrderNumber}&pageSize=1`, {
            method: 'GET',
            headers: {
                'Idtoken': config.currentIdToken,
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
            ordersContainer.innerHTML = '<p class="text-center text-gray-500">No order found with the provided Order Number.</p>';
            displayMessage(`No order found for Order Number: ${fetchOrderNumber}.`, 'info');
            return;
        }

        const orderIdToFetch = foundOrders[0].id; // Take the first matching order ID

        // Then, fetch the full details of that specific order
        const detailResponse = await fetch(`${config.baseUrl}/order-management/api/v1/orders/${orderIdToFetch}`, {
            method: 'GET',
            headers: {
                'Idtoken': config.currentIdToken,
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
            ordersContainer.innerHTML = '<p class="text-center text-gray-500">Failed to retrieve detailed information for the order.</p>';
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

export {
    fetchOrdersByDateAndSlot,
    fetchSingleOrderDetails
};