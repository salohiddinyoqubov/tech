# ABS Platform

A professional multi-language tech community and publishing platform.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENTS                                    │
├──────────────┬──────────────┬──────────────┬───────────────────────┤
│   abs.com    │ studio.abs   │  ops.abs     │   Mobile Apps         │
│  (Next.js)   │  (Next.js)   │  (React)     │  (Swift/Kotlin)       │
└──────┬───────┴──────┬───────┴──────┬───────┴───────────┬───────────┘
       │              │              │                   │
       └──────────────┴──────────────┴───────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   api.abs.com     │
                    │   (Go + Echo)     │
                    └─────────┬─────────┘
                              │
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
┌──────▼──────┐      ┌────────▼────────┐    ┌───────▼───────┐
│ PostgreSQL  │      │  Elasticsearch  │    │     Redis     │
│  (Primary)  │      │    (Search)     │    │ (Cache/Queue) │
└─────────────┘      └─────────────────┘    └───────────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Backend | Go (Echo) | Core API |
| Database | PostgreSQL | Primary data store |
| Search | Elasticsearch | Full-text search |
| Cache | Redis | Sessions, caching, queues |
| Web Frontend | Next.js 15 | Main website |
| UI Components | Shadcn/UI + Tailwind | Design system |
| Editor | Tiptap | Rich text editing |
| Mobile | Swift (iOS) / Kotlin (Android) | Native apps |

## Project Structure

```
/
├── apps/
│   ├── api/          # Go backend (Echo framework)
│   ├── web/          # Next.js main frontend (abs.com)
│   ├── studio/       # Next.js creator studio (studio.abs.com)
│   └── ops/          # React admin panel (ops.abs.com)
├── packages/
│   ├── shared/       # Shared TypeScript types
│   ├── ui/           # Shared UI components
│   └── config/       # Shared configurations
├── database/
│   ├── migrations/   # SQL migrations
│   ├── schema/       # Database schema
│   └── queries/      # sqlc query definitions
├── docker/           # Docker configurations
└── docs/             # Documentation
```

## Quick Start

### Prerequisites
- Go 1.22+
- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- pnpm 8+

### Development

```bash
# Install dependencies
pnpm install

# Start database
docker-compose up -d postgres redis

# Run backend
cd apps/api && go run cmd/server/main.go

# Run frontend
cd apps/web && pnpm dev
```

## Domain Strategy

| Domain | Purpose | Access |
|--------|---------|--------|
| abs.com | Main public site | Public |
| abs.com/uz | Uzbek version | Public |
| abs.com/ru | Russian version | Public |
| studio.abs.com | Creator dashboard | Authenticated |
| ops.abs.com | Internal operations | VPN + Auth |
| api.abs.com | Backend API | Public |
| id.abs.com | Auth service | Public |

## Languages Supported

- English (en) - Default
- O'zbek (uz) - Uzbek
- Русский (ru) - Russian
- Türkçe (tr) - Turkish
- Тоҷикӣ (tj) - Tajik
- Қазақша (kk) - Kazakh
- Кыргызча (ky) - Kyrgyz

## License

Proprietary - All rights reserved
