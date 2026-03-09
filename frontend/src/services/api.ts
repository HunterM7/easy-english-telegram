/**
 * @fileoverview HTTP клиент для взаимодействия с бэкендом.
 *
 * Обеспечивает:
 * - Базовую настройку запросов (URL, headers)
 * - Автоматическое добавление Authorization header
 * - Обработку ошибок API
 */

/** Базовый URL API из переменных окружения */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/v1/';

/** Структура ошибки API */
interface ApiError {
  message: string;
  statusCode: number;
}

/**
 * HTTP клиент для работы с API.
 * Автоматически добавляет токен авторизации ко всем запросам.
 */
class ApiClient {
  /** Текущий access token для авторизации запросов */
  private accessToken: string | null = null;

  /**
   * Устанавливает access token для последующих запросов.
   * @param token - JWT токен или null для сброса
   */
  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  /**
   * Возвращает текущий access token.
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Выполняет HTTP запрос к API.
   *
   * @param endpoint - Путь эндпоинта (например, '/auth/login')
   * @param options - Опции fetch (method, body, headers)
   * @returns Распарсенный JSON ответ
   * @throws ApiError при HTTP ошибке
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      (headers as Record<string, string>)['Authorization'] =
        `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: 'Network error',
        statusCode: response.status,
      }));
      throw error;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  /**
   * GET запрос.
   * @param endpoint - Путь эндпоинта
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST запрос.
   * @param endpoint - Путь эндпоинта
   * @param body - Тело запроса (будет сериализовано в JSON)
   */
  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

/** Синглтон API клиента */
export const apiClient = new ApiClient();
