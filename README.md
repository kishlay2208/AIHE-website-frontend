# AIHE Frontend

React + TypeScript frontend for Avantika Institute for Higher Education.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL:
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

4. Run development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build

```bash
npm run build
```

## Project Structure

- `src/components/` - React components
- `src/services/` - API service layer
- `src/types/` - TypeScript type definitions
- `src/contexts/` - React contexts (Auth, etc.)
- `src/pages/` - Page components
- `src/lib/` - Utility functions
