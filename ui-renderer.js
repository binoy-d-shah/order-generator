// ui-renderer.js
import { capitalize } from './utils.js'; // Import capitalize from utils.js

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
        <div class="order-card" id="${cardId}">
            <div class="download-btn-container">
                <button class="download-image-btn bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg text-sm"
                        data-order-number="${order.orderNumber}"
                        data-target-id="${cardId}">
                    Download Image
                </button>
            </div>
            <h2 class="text-xl font-bold text-gray-700 mb-4">Order Summary - #${order.orderNumber}</h2>
            <p class="text-sm text-gray-600 mb-1"><strong>Customer:</strong> ${formattedName}</p>
            <p class="text-sm text-gray-600 mb-1"><strong>Delivery Date:</strong> ${order.deliverySlotDate} (${weekday})</p>
            <p class="text-sm text-gray-600 mb-1"><strong>Total Amount:</strong> €${order.amount ? order.amount.toFixed(2) : '0.00'}</p>
            <p class="text-sm text-gray-600 mb-4"><strong>Special Instructions:</strong> ${deliveryInstruction}</p>

            <h3 class="text-lg font-semibold text-gray-700 mb-2">Items</h3>
            <table>
                <thead>
                    <tr><th>Brand</th><th>Product</th><th>Weight</th><th>Quantity</th><th>Amount</th></tr>
                </thead>
                <tbody>
                    ${itemsRows}
                </tbody>
            </table>
        </div>`;
}

export {
    generateHtmlFromJson
};