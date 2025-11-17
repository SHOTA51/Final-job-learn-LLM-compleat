# Job & Education Guide - Project Structure

## Overview
This is a Next.js 15 application with AI-powered career and education guidance using Google Gemini AI.

## Core Files & Directories

### Application Files (REQUIRED)
\`\`\`
app/
├── page.tsx                    # Home page (redirects to /chat or /login)
├── layout.tsx                  # Root layout with theme provider
├── globals.css                 # Global styles with Tailwind CSS v4
├── chat/
│   └── page.tsx               # Main chat interface page
├── login/
│   └── page.tsx               # Login page
├── register/
│   └── page.tsx               # Registration page
└── api/
    ├── chat/
    │   └── route.ts           # AI chat API endpoint (uses Gemini 2.0)
    └── auth/
        ├── login/route.ts     # Login API
        ├── logout/route.ts    # Logout API
        ├── register/route.ts  # Registration API
        └── me/route.ts        # Get current user API
\`\`\`

### Components (REQUIRED)
\`\`\`
components/
├── chat-interface.tsx          # Main chat UI component
├── theme-provider.tsx          # Dark/light theme provider
└── ui/                        # shadcn/ui components (all required)
\`\`\`

### Configuration Files (REQUIRED)
\`\`\`
.env.local                      # Environment variables (API keys)
.gitignore                      # Git ignore rules
package.json                    # Dependencies and scripts
tsconfig.json                   # TypeScript configuration
next.config.mjs                 # Next.js configuration
postcss.config.mjs              # PostCSS configuration
components.json                 # shadcn/ui configuration
\`\`\`

### Utilities (REQUIRED)
\`\`\`
lib/
└── utils.ts                    # Utility functions (cn, etc.)

hooks/
├── use-mobile.ts              # Mobile detection hook
└── use-toast.ts               # Toast notification hook
\`\`\`

### Public Assets (REQUIRED)
\`\`\`
public/
├── placeholder-logo.png
├── placeholder-logo.svg
├── placeholder-user.jpg
├── placeholder.jpg
└── placeholder.svg
\`\`\`

## Environment Variables

Required in `.env.local`:
\`\`\`
GEMINI_API_KEY=your_google_ai_studio_api_key
\`\`\`

## Key Features

1. **Authentication System**
   - Cookie-based authentication
   - Login/Register pages
   - Protected chat route

2. **AI Chat Interface**
   - Powered by Google Gemini 2.0 Flash
   - Streaming responses
   - Career and education guidance

3. **Theme Support**
   - Dark/light mode toggle
   - Persistent theme preference

## Development Commands

\`\`\`bash
# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev
# or
pnpm dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## Notes for VS Code Development

1. All Python files have been removed (they were from a different project)
2. The project uses Next.js 15 with App Router
3. Styling uses Tailwind CSS v4
4. UI components are from shadcn/ui
5. Make sure to keep the `.env.local` file with your API key
6. The `user_read_only_context/` directory contains examples (read-only, don't edit)

## Files Removed (Unnecessary)

- All Python files (crud.py, database.py, main.py, models.py, schemas.py, __init__.py)
- Python virtual environment files
- Backup ZIP files (app_db_backup.zip, web_app.zip)
- Duplicate styles/globals.css
- requirements.txt (Python dependencies)
- HTML templates (not used in Next.js)
