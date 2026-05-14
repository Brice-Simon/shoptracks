const QRCode = require('qrcode');
const itemRepository = require('../repositories/ItemRepository');

/**
 * GET /api/qr/:id
 * Generates a QR code PNG for a given item SKU.
 * Returns the QR as a base64 data URL.
 */
const generateQR = async (req, res, next) => {
    try {
        const item = await itemRepository.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }

        const qrDataUrl = await QRCode.toDataURL(item.id, {
            width: 300,
            margin: 2,
            color: { dark: '#000000', light: '#ffffff' },
        });

        res.status(200).json({
            success: true,
            data: {
                item_id: item.id,
                item_name: item.name,
                qr_code: qrDataUrl,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { generateQR };