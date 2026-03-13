import type { NextApiRequest, NextApiResponse } from 'next';
import { getProductById } from '../../data/products';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { productId } = req.body as { productId?: string };

    if (!productId) {
        return res.status(400).json({ error: 'productId is required' });
    }

    // Look up the product server-side (mam is never sent to the browser)
    const product = getProductById(productId);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    // Server-to-server call – credentials stay on the server
    const inaResponse = await fetch(process.env.INA_PLATFORM_INIT_URL!, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            api_key: process.env.TENANT_API_KEY!,          // <-- Added to body
            context_id: String(productId),                  // Ensuring it's a string
            mam: Number(product.mam),                       // Ensuring it's a number
            asking_price: Number(product.displayed_price),  // Ensuring it's a number
        }),
    });

    if (!inaResponse.ok) {
        const text = await inaResponse.text();
        return res
            .status(inaResponse.status)
            .json({ error: 'INA platform error', detail: text });
    }

    const data = await inaResponse.json();

    return res.status(200).json({ session_id: data.session_id });
}
