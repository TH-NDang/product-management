# Product Management System

A full-stack product management system built with FastAPI, Next.js, and TypeScript.

## Project Structure

```
product-management/
├── apps/
│   ├── api/          # FastAPI backend
│   ├── server/       # Additional server components
│   └── web/          # Next.js frontend
└── packages/
    ├── eslint-config/
    ├── typescript-config/
    └── ui/           # Shared UI components
```

## Features

- **Projects Management**: View and manage projects with infinite scrolling
- **Real-time Updates**: Live data updates using custom hooks
- **Modern UI**: Built with shadcn/ui components
- **Type Safety**: Full TypeScript support
- **API Integration**: RESTful API with FastAPI

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- pnpm (for package management)

### Backend Setup (FastAPI)

1. Navigate to the API directory:
```bash
cd apps/api
```

2. Install dependencies:
```bash
uv sync
```

3. Run the FastAPI server:
```bash
uv run python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup (Next.js)

1. Navigate to the web directory:
```bash
cd apps/web
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Projects

- `GET /api/projects` - List projects with pagination
  - Query parameters:
    - `offset` (int): Number of items to skip (default: 0)
    - `limit` (int): Number of items to return (default: 20, max: 100)

- `GET /api/projects/{project_id}` - Get project by ID

## Features Implemented

### 1. Infinite Query Hook
- Custom `useInfiniteQueryAPI` hook for REST API integration
- Automatic pagination handling
- Loading states and error handling
- Deduplication of data

### 2. Projects Sidebar
- Dynamic project loading from API
- Infinite scrolling with ScrollArea component
- Loading indicators and error states
- Project navigation with active states
- Dropdown menus for project actions

### 3. API Integration
- FastAPI backend with SQLModel
- Pagination support
- Sample data seeding
- CORS configuration
- Proxy setup for development

## Development

### Adding New Features

1. **Backend**: Add new models, services, and routers in `apps/api/`
2. **Frontend**: Add new components and pages in `apps/web/`
3. **UI Components**: Add shared components in `packages/ui/`

### Database

The system uses SQLite for development. Database tables are automatically created on startup, and sample data is seeded for testing.

### Styling

The project uses:
- Tailwind CSS for styling
- shadcn/ui for component library
- Custom CSS modules where needed

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Add proper error handling
4. Test your changes thoroughly

## License

MIT
