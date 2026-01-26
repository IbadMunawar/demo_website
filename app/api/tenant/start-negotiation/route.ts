import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/data/products';

/**
 * Start Negotiation Endpoint
 * 
 * This endpoint is called when a user clicks "Negotiate a Better Price"
 * It performs the following steps:
 * 1. Looks up the product and its secret MAM (Minimum Acceptable Margin)
 * 2. Makes a server-to-server call to INA Platform Backend
 * 3. Returns the session_id to the frontend
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        // Step A: Lookup the product and get the secret MAM
        const product = getProductById(productId);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Step B & C: Make authenticated server-to-server call to INA Platform
        const inaBackendUrl = process.env.INA_BACKEND_URL;
        const tenantApiKey = process.env.TENANT_API_KEY;

        if (!inaBackendUrl || !tenantApiKey) {
            console.error('Missing INA configuration. Please update .env.local file.');
            return NextResponse.json(
                {
                    error: 'Server configuration incomplete',
                    message: 'Please configure INA_BACKEND_URL and TENANT_API_KEY in .env.local'
                },
                { status: 500 }
            );
        }

        // Prepare negotiation context for INA
        const negotiationPayload = {
            product_id: product.id,
            product_name: product.title,
            displayed_price: product.displayed_price,
            minimum_acceptable_price: product.mam, // Secret value
            product_description: product.description,
        };

        // Make the server-to-server call
        const response = await fetch(`${inaBackendUrl}/session/init`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tenantApiKey}`,
            },
            body: JSON.stringify(negotiationPayload),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('INA Platform error:', errorData);
            return NextResponse.json(
                {
                    error: 'Failed to initialize negotiation session',
                    details: errorData
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Step D: Return the session_id to frontend
        return NextResponse.json({
            session_id: data.session_id,
            product_id: product.id,
            product_name: product.title,
            starting_price: product.displayed_price,
        });

    } catch (error) {
        console.error('Error starting negotiation:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
