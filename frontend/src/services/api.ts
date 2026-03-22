/**
 * @fileoverview HTTP клиент для взаимодействия с бэкендом.
 *
 * Обеспечивает:
 * - Базовую настройку запросов (URL, headers)
 * - Автоматическое добавление Authorization header
 * - При 401 на защищённых эндпоинтах — одна попытка обновить сессию через refreshHandler (см. auth.ts)
 */

/** Базовый URL API из переменных окружения */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/v1/';

/** Структура ошибки API */
interface ApiError {
  message: string;
  statusCode: number;
}

/** Колбэк: обновить сессию; true если accessToken обновлён */
type RefreshHandler = () => Promise<boolean>;

/**
 * HTTP клиент для работы с API.
 * Автоматически добавляет токен авторизации ко всем запросам.
 */
class ApiClient {
  /** Текущий accessToken для авторизации запросов */
  private accessToken: string | null = null;

  /** Устанавливается из auth.ts — обновление по refreshToken */
  private refreshHandler: RefreshHandler | null = null;

  /** Один параллельный refresh на все 401 */
  private refreshInFlight: Promise<boolean> | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  /** Возвращает текущий access token. */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Регистрирует обработчик обновления сессии (вызывается из `auth.ts` при загрузке модуля).
   */
  setRefreshHandler(handler: RefreshHandler | null) {
    this.refreshHandler = handler;
  }

  private shouldAttemptRefresh(endpoint: string): boolean {
    const path = endpoint.replace(/^\//, '');
    return (
      !path.startsWith('auth/login') &&
      !path.startsWith('auth/refresh')
    );
  }

  private async runRefresh(): Promise<boolean> {
    if (!this.refreshHandler) {
      return false;
    }
    if (!this.refreshInFlight) {
      this.refreshInFlight = this.refreshHandler().finally(() => {
        this.refreshInFlight = null;
      });
    }
    return this.refreshInFlight;
  }

  /**
   * Выполняет HTTP запрос к API.
   *
   * @param endpoint - Путь эндпоинта (например, 'auth/login')
   * @param options - Опции fetch (method, body, headers)
   * @param isRetry - внутренний флаг повтора после refresh
   * @returns Распарсенный JSON ответ
   * @throws ApiError при HTTP ошибке
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry = false,
  ): Promise<T> {
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

    if (
      response.status === 401 &&
      !isRetry &&
      this.shouldAttemptRefresh(endpoint)
    ) {
      const renewed = await this.runRefresh();
      if (renewed) {
        return this.request<T>(endpoint, options, true);
      }
    }

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
