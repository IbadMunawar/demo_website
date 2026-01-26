import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/data/products';

/**
 * Verify Deal Endpoint
 * 
 * This endpoint provides server-side validation of negotiated deals.
 * Even if the frontend says "Deal Done," the backend should verify
 * the price meets minimum requirements before processing payment.
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productId, negotiatedPrice, sessionId } = body;

        if (!productId || !negotiatedPrice) {
            return NextResponse.json(
                { error: 'Product ID and negotiated price are required' },
                { status: 400 }
            );
        }

        // Lookup the product to get the secret MAM
        const product = getProductById(productId);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Verify the negotiated price meets minimum requirements
        const isValid = negotiatedPrice >= product.mam;

        if (!isValid) {
            return NextResponse.json(
                {
                    valid: false,
                    error: 'Negotiated price below minimum acceptable margin',
                    minimum_required: product.mam,
                },
                { status: 400 }
            );
        }

        // Calculate savings and margin
        const savings = product.displayed_price - negotiatedPrice;
        const savingsPercentage = Math.round((savings / product.displayed_price) * 100);
        const margin = negotiatedPrice - product.mam;

        return NextResponse.json({
            valid: true,
            product_id: product.id,
            product_name: product.title,
            original_price: product.displayed_price,
            negotiated_price: negotiatedPrice,
            savings: savings,
            savings_percentage: savingsPercentage,
            margin: margin,
            session_id: sessionId,
            message: 'Deal verified successfully',
        });

    } catch (error) {
        console.error('Error verifying deal:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
