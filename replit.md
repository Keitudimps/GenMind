# Overview

GenMind is an AI-powered UI code generator that transforms natural language descriptions into production-ready frontend code. The application allows users to describe a user interface in plain English and receive both a detailed design specification and working code using Google's Gemini AI. Built with a modern full-stack architecture, it features a React frontend with shadcn/ui components and an Express.js backend, designed with a light theme and glassmorphism styling.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Library**: shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design tokens for glassmorphism effects and pastel colors
- **State Management**: TanStack Query for server state management and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Typography**: Inter font for UI elements, JetBrains Mono for code display

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API with a single `/api/generate` endpoint for UI generation
- **Request Validation**: Zod schemas for runtime type checking and validation
- **Error Handling**: Centralized error handling middleware with structured error responses
- **Development**: Hot reloading with Vite integration for seamless development experience

## Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless PostgreSQL for cloud hosting
- **Schema**: Users and generations tables with proper relationships and indexing
- **Migrations**: Drizzle Kit for database schema migrations and management
- **Fallback**: In-memory storage implementation for development and testing scenarios

## Authentication & Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **User System**: Basic username/password authentication with hashed passwords
- **Security**: CORS configuration and input sanitization for API endpoints

## External Dependencies
- **AI Service**: Google Gemini Pro API for generating design specifications and code
- **Database**: Neon Database (PostgreSQL) for persistent data storage
- **CDN**: Google Fonts for typography (Inter and JetBrains Mono)
- **Development**: Replit integration for cloud-based development environment
- **Styling**: Tailwind CSS CDN integration for live preview functionality
- **Code Highlighting**: Prism.js for syntax highlighting in code blocks

The architecture follows a clear separation of concerns with shared TypeScript types between frontend and backend, enabling type safety across the full stack. The application prioritizes user experience with responsive design, live code preview capabilities, and smooth animations throughout the interface.