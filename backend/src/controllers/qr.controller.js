/**
 * QR CODE CONTROLLER (qr.controller.js)
 * Handles the generation of QR codes for inventory items.
 */

const QRCode = require('qrcode'); // Library used to convert text/IDs into QR code images
const itemRepository = require('../repositories/ItemRepository'); // Database access for items

/**
 * GET /api/qr/:id
 * Generates a visual QR code for a specific item SKU/ID.
 * This QR code, when scanned, typically provides the ID back to the scanner.
 */
const generateQR = async (req, res, next) => {
    try {
        // 1. Fetch the item from the database to ensure it exists before making a code
        const item = await itemRepository.findById(req.params.id);
        
        // If the item doesn't exist, we can't generate a QR for it
        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }

        // 2. Generate the QR Code image
        // .toDataURL() creates a base64 string (e.g., "data:image/png;base64,iVBOR...")
        // This string can be put directly into an <img> tag's 'src' attribute on the frontend.
        const qrDataUrl = await QRCode.toDataURL(item.id, {
            width: 300,        // Sets the size to 300x300 pixels
            margin: 2,         // The white border thickness around the QR
            color: { 
                dark: '#000000',  // The color of the black squares
                light: '#ffffff'  // The color of the background
            },
        });

        // 3. Return the QR data and item details to the requester
        res.status(200).json({
            success: true,
            data: {
                item_id: item.id,     // The ID embedded in the QR
                item_name: item.name, // The name of the item for display purposes
                qr_code: qrDataUrl,   // The actual image data
            },
        });
    } catch (error) {
        // Pass any system errors (like library failures) to the error middleware
        next(error);
    }
};

// Export the function to be used in the routes
module.exports = { generateQR };