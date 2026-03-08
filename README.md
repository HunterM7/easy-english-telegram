# Easy English — приложение для изучения английского в Telegram

Мини-приложение в Telegram для изучения английского: темы, уроки, тренажёр, маскот (попугайчик), геймификация. Продуктовое описание — в [docs/PRD.md](docs/PRD.md).

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
- **backend** — REST API (авторизация по JWT, защищённые роуты). Контракт API: [docs/API.md](docs/API.md). Запуск: `npm run start:dev` из папки `backend/`.
- **docs** — [PRD](docs/PRD.md), [контракт API](docs/API.md), [карта экранов и флоу](docs/design-flows.md), [реализация и чек-лист](docs/implementation.md).

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

Переменные окружения задаются в `frontend/.env` и `backend/.env` (не коммитить секреты). См. [docs/implementation.md](docs/implementation.md).
