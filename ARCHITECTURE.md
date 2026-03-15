# Project Architecture & Directory Structure

This document outlines the scalable directory structure adopted for this project.

## Backend (NestJS)

We follow a **Modular & Domain-Driven** approach. Each feature is self-contained in a module.

```bash
backend/src/
├── common/             # Shared resources used across modules
│   ├── decorators/     # Custom decorators (@CurrentUser, etc.)
│   ├── filters/        # Exception filters
│   ├── guards/         # Auth & Role guards
│   ├── interceptors/   # Response interceptors
│   ├── pipes/          # Validation pipes
│   └── utils/          # Shared utility functions
├── config/             # Configuration service (Env vars validation)
├── database/           # Database connection & seeds
│   └── prisma/         # Prisma service
├── modules/            # Feature modules (The Core Logic)
│   ├── auth/           # Authentication logic
│   ├── users/          # Users management
│   └── [Feature]/
│       ├── dto/          # Data Transfer Objects (Validation)
│       ├── entities/     # Domain entities/interfaces
│       ├── controllers/  # Controllers
│       ├── services/     # Services
│       └── [name].module.ts
├── modules/storage/    # MinIO Storage Module (S3-compatible)
├── app.module.ts       # Main module importing all feature modules
└── main.ts             # Entry point
```

## Frontend (Next.js)

We use a **Feature-Based** architecture combined with Next.js App Router. Logic is co-located with features, while shared UI lives in `components`.

```bash
frontend/src/
├── app/                # Next.js App Router (Routing layer only)
│   ├── (auth)/         # Route groups (e.g. login, register)
│   ├── dashboard/      # Dashboard routes
│   └── layout.tsx      # Root layout
├── components/         # Shared UI Components (Atomic Design)
│   ├── atoms/          # Basic building blocks (Buttons, Inputs, Icons)
│   ├── molecules/      # Groups of atoms (Search box, Form field)
│   ├── organisms/      # Groups of molecules (Header, Footer, Product Card)
│   ├── templates/      # Page layouts (Dashboard layout, Auth layout)
│   └── pages/          # (Optional) Specific page compositions if not using App Router pages directly
├── config/             # Global configuration (Env vars)
├── features/           # Feature-specific logic & UI
│   ├── auth/           # Auth feature
│   │   ├── components/ # Components only used in Auth
│   │   ├── hooks/      # Hooks specific to Auth
│   │   └── services/   # API calls for Auth
│   └── [Feature]/
├── hooks/              # Global custom hooks (useDebounce, etc.)
├── lib/                # Library configurations (Axios, cn, etc.)
├── services/           # Global API services (Base API client)
├── store/              # Global State Management (Zustand/Context)
├── types/              # Global TypeScript definitions
└── utils/              # One-off helper functions
```

## Mobile (React Native Expo)

Similar to Frontend, using file-based routing (Expo Router).

```bash
mobile/
├── app/                # Expo Router screens
├── src/
│   ├── components/     # Shared UI
│   ├── features/       # Feature modules
│   ├── hooks/          # Global hooks
│   ├── services/       # API services
│   └── utils/          # Helpers
```
