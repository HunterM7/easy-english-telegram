# Easy English — приложение для изучения английского в Telegram

Мини-приложение в Telegram для изучения английского: темы, уроки, тренажёр, маскот (попугайчик), геймификация. Документация — в [docs/](docs/README.md); продуктовое описание — в [docs/product/PRD.md](docs/product/PRD.md).

## Содержание

- [Требования](#требования)
- [Структура репозитория](#структура-репозитория)
- [Быстрый старт (Docker)](#быстрый-старт-docker)
- [Локальная разработка](#локальная-разработка)
- [Переменные окружения](#переменные-окружения)
- [Авторизация](#авторизация)
- [Полезные команды](#полезные-команды)

## Требования

- **Node.js** 22+ (для локальной разработки)
- **Docker** и **Docker Compose** (для запуска с базой данных)
- **Telegram Bot Token** (от [@BotFather](https://t.me/BotFather))

## Структура репозитория

```
easy-english-telegram/
├── frontend/           # React + TypeScript + Vite + SCSS
├── backend/            # NestJS + Prisma + PostgreSQL
├── docs/               # Документация проекта
├── docker-compose.yml  # Docker конфигурация (PostgreSQL + Backend)
├── package.json        # Скрипты для запуска из корня
└── .env.example        # Шаблон переменных окружения для Docker
```

## Быстрый старт (Docker)

Самый простой способ запустить проект — через Docker. Запускается PostgreSQL и Backend в контейнерах.

### 1. Клонирование и установка зависимостей

```bash
git clone <repo-url>
cd easy-english-telegram

# Установка зависимостей фронтенда (бэкенд собирается в Docker)
npm run install:frontend
```

### 2. Настройка переменных окружения

```bash
# Корневой .env для Docker Compose
cp .env.example .env

# Заполни TELEGRAM_BOT_TOKEN (получить у @BotFather)
# JWT_SECRET можно оставить дефолтным для разработки
```

```bash
# Frontend .env
cp frontend/.env.example frontend/.env

# Заполни VITE_TELEGRAM_BOT_NAME (имя бота без @)
```

### 3. Запуск Docker контейнеров

```bash
# Запустить PostgreSQL и Backend
docker compose up -d

# Проверить статус
docker compose ps

# Посмотреть логи
docker compose logs -f backend
```

После запуска:
- **PostgreSQL**: `localhost:5433` (внутри Docker сети: `db:5432`)
- **Backend API**: `http://localhost:3000/v1`

### 4. Применение миграций базы данных

При первом запуске нужно создать таблицы:

```bash
docker exec easy-english-backend npx prisma migrate deploy
```

### 5. Запуск фронтенда

```bash
npm run dev:frontend
```

Фронтенд доступен по адресу: `http://localhost:5173`

### 6. Проверка работы

1. Открой `http://localhost:5173/landing`
2. Нажми "Dev: Войти" (в dev-режиме используется мок-авторизация)
3. После авторизации откроется главная страница

## Локальная разработка

Для разработки без Docker (с локальным PostgreSQL).

### 1. Установка зависимостей

```bash
npm run install:all
```

### 2. Настройка PostgreSQL

Установи PostgreSQL локально или используй Docker только для БД:

```bash
# Только PostgreSQL в Docker
docker compose up -d db
```

### 3. Настройка backend/.env

```bash
cp backend/.env.example backend/.env
```

Отредактируй `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/easy_english
JWT_SECRET=your-secret-key
TELEGRAM_BOT_TOKEN=<токен от @BotFather>
FRONTEND_URL=http://localhost:5173
PORT=3000
```

> **Важно**: Порт PostgreSQL в Docker — `5433` (не `5432`), чтобы не конфликтовать с локальной установкой.

### 4. Генерация Prisma клиента и миграции

```bash
cd backend

# Генерация Prisma клиента
npm run prisma:generate

# Применение миграций
npm run prisma:migrate

# (Опционально) Открыть Prisma Studio
npm run prisma:studio
```

### 5. Запуск бэкенда и фронтенда

```bash
# Из корня проекта
npm run dev:backend   # http://localhost:3000
npm run dev:frontend  # http://localhost:5173
```

## Переменные окружения

### Корневой `.env` (для Docker Compose)

| Переменная | Описание | Обязательно |
|------------|----------|-------------|
| `JWT_SECRET` | Секрет для подписи JWT токенов | Да (менять в production) |
| `TELEGRAM_BOT_TOKEN` | Токен бота от @BotFather | Да |
| `FRONTEND_URL` | URL фронтенда для CORS | Нет (default: `http://localhost:5173`) |

### `backend/.env`

| Переменная | Описание | Обязательно |
|------------|----------|-------------|
| `DATABASE_URL` | Строка подключения PostgreSQL | Да |
| `JWT_SECRET` | Секрет для JWT | Да |
| `TELEGRAM_BOT_TOKEN` | Токен бота | Да |
| `FRONTEND_URL` | URL для CORS | Нет |
| `PORT` | Порт сервера | Нет (default: `3000`) |

### `frontend/.env`

| Переменная | Описание | Обязательно |
|------------|----------|-------------|
| `VITE_API_URL` | URL бэкенда | Нет (default: `http://localhost:3000/v1/`) |
| `VITE_TELEGRAM_BOT_NAME` | Имя бота (без @) | Для Telegram Login Widget |
| `VITE_USE_REAL_AUTH` | `true` для реальной авторизации через виджет | Нет (default: `false`) |

## Авторизация

Приложение поддерживает два способа авторизации через Telegram:

### 1. Telegram Mini App (внутри Telegram)

Автоматическая авторизация через `initData` от Telegram. Данные пользователя передаются при открытии Mini App.

### 2. Браузер (Telegram Login Widget)

Для авторизации в браузере используется [Telegram Login Widget](https://core.telegram.org/widgets/login).

**Требования для работы виджета:**
1. Настроить домен в @BotFather: `/setdomain`
2. Виджет не работает на `localhost` — нужен реальный домен или туннель (ngrok)

**Dev-режим (localhost):**

По умолчанию на localhost используется мок-авторизация (кнопка "Dev: Войти").

Для реальной авторизации через виджет:

1. Установи ngrok: `brew install ngrok`
2. Запусти туннель: `ngrok http 5173`
3. Укажи домен в @BotFather: `/setdomain` → `abc123.ngrok-free.app`
4. Установи в `frontend/.env`:
   ```env
   VITE_USE_REAL_AUTH=true
   ```
5. Открой приложение по ngrok URL

## Полезные команды

### Из корня проекта

```bash
# Установка зависимостей
npm run install:all        # Frontend + Backend
npm run install:frontend   # Только Frontend
npm run install:backend    # Только Backend

# Разработка
npm run dev:frontend       # Запуск Frontend (Vite)
npm run dev:backend        # Запуск Backend (NestJS watch)

# Сборка
npm run build:frontend     # Сборка Frontend
npm run build:backend      # Сборка Backend

# Линтинг
npm run lint:frontend      # ESLint Frontend
npm run lint:backend       # ESLint Backend
```

### Docker

```bash
docker compose up -d       # Запустить контейнеры
docker compose down        # Остановить контейнеры
docker compose logs -f     # Логи всех контейнеров
docker compose ps          # Статус контейнеров

# Выполнить команду в контейнере
docker exec easy-english-backend npx prisma studio
docker exec easy-english-backend npx prisma migrate deploy
```

### Prisma (из папки backend/)

```bash
npm run prisma:generate    # Генерация Prisma клиента
npm run prisma:migrate     # Создание и применение миграции
npm run prisma:push        # Push схемы без миграции
npm run prisma:studio      # Веб-интерфейс для БД
```

## Ссылки

- [Документация проекта](docs/README.md)
- [PRD (Product Requirements)](docs/product/PRD.md)
- [API спецификация](docs/server/api/README.md)
- [Описание реализации](docs/server/implementation.md)
