# Product Management System

A full-stack product management system built with FastAPI, Next.js, TypeScript, React Query, and Redux.

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

- **Projects Management**: View, create, and delete projects with infinite scrolling
- **Real-time Updates**: Live data updates using React Query and Redux
- **Modern UI**: Built with shadcn/ui components
- **Type Safety**: Full TypeScript support
- **API Integration**: RESTful API with FastAPI
- **State Management**: Redux Toolkit for global state
- **Data Fetching**: React Query for server state management
- **Toast Notifications**: User feedback with sonner
- **Caching**: Intelligent caching with React Query

## Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **React Query (TanStack Query)**: Server state management
- **Redux Toolkit**: Client state management
- **Tailwind CSS**: Styling
- **shadcn/ui**: Component library
- **Sonner**: Toast notifications

### Backend
- **FastAPI**: Python web framework
- **SQLModel**: SQL database toolkit
- **SQLite**: Database (development)
- **Pydantic**: Data validation

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

- `POST /api/projects` - Create a new project
  - Body: `{ "name": "string", "description": "string?" }`

- `GET /api/projects/{project_id}` - Get project by ID

- `DELETE /api/projects/{project_id}` - Delete project by ID

## State Management Architecture

### React Query (Server State)
- **Infinite Queries**: For paginated project lists
- **Mutations**: For create, update, delete operations
- **Caching**: Automatic cache invalidation and updates
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Built-in error states and retry logic

### Redux (Client State)
- **Global State**: User preferences, UI state, filters
- **Project Selection**: Currently selected project
- **Search & Filters**: Project filtering and search state
- **Performance**: Memoized selectors for optimal rendering

### Integration Benefits
- **Automatic Sync**: React Query mutations update Redux state
- **Optimistic UI**: Immediate feedback with rollback on error
- **Type Safety**: Full TypeScript support across the stack
- **Developer Experience**: React Query DevTools and Redux DevTools

## Features Implemented

### 1. React Query Integration
- Infinite queries for project pagination
- Mutations for CRUD operations
- Automatic cache management
- Optimistic updates
- Error handling and retry logic

### 2. Redux State Management
- Centralized project state
- Memoized selectors for performance
- Filter and search state management
- Project selection state
- Type-safe actions and reducers

### 3. Projects Sidebar
- Dynamic project loading with infinite scroll
- Real-time updates after mutations
- Loading states and error handling
- Project navigation with active states
- Dropdown menus for project actions

### 4. Project Management
- **Add Projects**: Modal form with validation
- **Delete Projects**: Confirmation dialog with safety checks
- **Real-time Updates**: Automatic cache invalidation
- **Toast Notifications**: User feedback for all actions
- **Optimistic Updates**: Immediate UI feedback

### 5. API Integration
- FastAPI backend with SQLModel
- Pagination support
- Sample data seeding
- CORS configuration
- Proxy setup for development

### 6. Performance Optimizations
- React Query caching and background updates
- Redux memoized selectors
- Infinite scroll with virtualization
- Optimistic updates for better UX
- Automatic garbage collection

## Development

### Adding New Features

1. **Backend**: Add new models, services, and routers in `apps/api/`
2. **Frontend**: Add new components and pages in `apps/web/`
3. **State Management**: 
   - Add Redux slice for client state
   - Add React Query hooks for server state
   - Create selectors for derived state
4. **UI Components**: Add shared components in `packages/ui/`

### State Management Patterns

```typescript
// React Query for server state
const { data, isLoading, error } = useInfiniteProjects();
const createMutation = useCreateProject();

// Redux for client state
const { projects, filters } = useFilteredProjects();
const { setSearch, setStatusFilter } = useProjectsSearch();
```

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
5. Follow React Query and Redux best practices

## License

MIT
