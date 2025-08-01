// utils.js

/**
 * Displays a message in the message box.
 * @param {string} message The message to display.
 * @param {string} type The type of message (success, error, info).
 * @returns {HTMLElement} The messageBox element for chaining operations.
 */
function displayMessage(message, type) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.className = 'mt-6 p-4 rounded-md'; // Reset classes
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

    return messageBox; // Add this line to return the element
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

export {
    displayMessage,
    capitalize,
    downloadDataUrlAsFile
};