# Environment Configuration

## Setup Instructions

Create a `.env.local` file in the root directory and add the following environment variables:

```bash
# ⚙️ INA PLATFORM CONFIGURATION - REPLACE WITH YOUR ACTUAL VALUES

# INA Platform Backend URL (for session initialization)
INA_BACKEND_URL=https://your-ina-platform-backend.com

# INA Orchestrator URL (for chat messaging)
INA_ORCHESTRATOR_URL=https://your-ina-orchestrator.com

# Tenant API Key (for authentication)
TENANT_API_KEY=your-tenant-api-key-here

# Site Configuration
NEXT_PUBLIC_SITE_NAME=TechStore Pro
```

## Variables to Replace

1. **INA_BACKEND_URL**: Replace with your actual INA platform backend URL
2. **INA_ORCHESTRATOR_URL**: Replace with your actual INA orchestrator messaging endpoint
3. **TENANT_API_KEY**: Replace with your actual tenant API key for authentication

## Important Notes

- Never commit `.env.local` to version control (it's already in `.gitignore`)
- These values are required for the negotiation feature to work
- The app will run without these values, but negotiation will fail
