# Web Application

This is the Next.js frontend for the Product Management System.

## Environment Configuration

Create a `.env.local` file in the `apps/web` directory with the following variables:

```env
# Backend API URL
# Default: http://localhost:8000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Other environment variables can be added here
# NEXT_PUBLIC_API_TIMEOUT=5000
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## API Configuration

The application uses the following API configuration:

- **Backend URL**: Configured via `NEXT_PUBLIC_BACKEND_URL` environment variable
- **API Base Path**: `/api` (automatically added to all API calls)
- **Proxy**: API calls are proxied through Next.js to the backend server

## Development

The frontend automatically proxies API calls to the backend server running on port 8000. Make sure your FastAPI backend is running before starting the frontend. 