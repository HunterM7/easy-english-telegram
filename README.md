# Easy English — приложение для изучения английского в Telegram

Мини-приложение в Telegram для изучения английского: темы, уроки, тренажёр, маскот (попугайчик), геймификация. Документация — в [docs/](docs/README.md); продуктовое описание — в [docs/product/PRD.md](docs/product/PRD.md).

## Структура репозитория

```
easy-english-telegram/
├── frontend/     # Клиент: React + TypeScript + Vite + SCSS, Telegram Mini App
├── backend/      # Сервер: NestJS, PostgreSQL, REST API v1
├── docs/         # Документация: PRD, API, дизайн-флоу, реализация
├── package.json  # Скрипты для запуска фронта и бэка из корня
└── README.md
```

- **frontend** — SPA (React), работает в Telegram WebView и в браузере (посадочная + авторизация через Telegram). Запуск: `npm run dev` из папки `frontend/`.
- **backend** — REST API (авторизация по JWT, защищённые роуты). Контракт API: [docs/server/api/README.md](docs/server/api/README.md). Запуск: `npm run start:dev` из папки `backend/`.
- **docs** — [индекс](docs/README.md): [Product (PRD, флоу)](docs/product/README.md), [Client (экраны)](docs/client/README.md), [Server (API, реализация)](docs/server/README.md).

## Быстрый старт

1. Установить зависимости фронта и бэка:
   ```bash
   npm run install:all
   ```
   или по отдельности: `cd frontend && npm install` и `cd backend && npm install`.

2. Запустить бэкенд (из корня):
   ```bash
   npm run dev:backend
   ```
   По умолчанию: http://localhost:3000

3. Запустить фронт (из корня):
   ```bash
   npm run dev:frontend
   ```
   Откроется по адресу из вывода Vite (обычно http://localhost:5173).

Переменные окружения задаются в `frontend/.env` и `backend/.env` (не коммитить секреты). См. [docs/server/implementation.md](docs/server/implementation.md).
