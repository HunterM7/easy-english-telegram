import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTMA } from '@telegram-apps/sdk-react';
import { useAuth } from '#src/hooks/useAuth';
import { TelegramLoginWidget } from '#src/components/TelegramLoginWidget';
import type { TelegramWidgetData } from '#src/services/auth';
import './landing-page.scss';

const BOT_NAME = import.meta.env.VITE_TELEGRAM_BOT_NAME || '';
const IS_DEV = import.meta.env.DEV;
const USE_MOCK_AUTH = IS_DEV && import.meta.env.VITE_USE_REAL_AUTH !== 'true';

export function LandingPage() {
  const { login, loginWithWidget } = useAuth();
  const navigate = useNavigate();
  const isTelegramApp = isTMA();

  const handleTelegramLogin = async () => {
    try {
      await login();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleWidgetAuth = useCallback(
    async (data: TelegramWidgetData) => {
      try {
        await loginWithWidget(data);
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Widget login error:', error);
      }
    },
    [loginWithWidget, navigate],
  );

  const handleDevLogin = async () => {
    const mockData: TelegramWidgetData = {
      id: 123456789,
      first_name: 'Dev',
      last_name: 'User',
      username: 'devuser',
      auth_date: Math.floor(Date.now() / 1000),
      hash: 'dev_mock_hash',
    };
    try {
      await loginWithWidget(mockData);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Dev login error:', error);
    }
  };

  const renderLoginButton = () => {
    if (USE_MOCK_AUTH) {
      return (
        <button className="landing-header__login" onClick={handleDevLogin}>
          Dev: Войти
        </button>
      );
    }
    // В Telegram Mini App используем initData
    if (isTelegramApp) {
      return (
        <button className="landing-header__login" onClick={handleTelegramLogin}>
          Войти через Telegram
        </button>
      );
    }
    // В браузере на проде используем виджет
    if (BOT_NAME) {
      return <TelegramLoginWidget botName={BOT_NAME} onAuth={handleWidgetAuth} buttonSize="medium" />;
    }
    return null;
  };

  const renderHeroButton = () => {
    if (USE_MOCK_AUTH) {
      return (
        <button className="landing-hero__cta" onClick={handleDevLogin}>
          Dev: Начать обучение
        </button>
      );
    }
    if (isTelegramApp) {
      return (
        <button className="landing-hero__cta" onClick={handleTelegramLogin}>
          Начать обучение
        </button>
      );
    }
    if (BOT_NAME) {
      return (
        <div className="landing-hero__widget">
          <TelegramLoginWidget botName={BOT_NAME} onAuth={handleWidgetAuth} buttonSize="large" />
        </div>
      );
    }
    return null;
  };

  const renderCtaButton = () => {
    if (USE_MOCK_AUTH) {
      return (
        <button className="landing-cta__button" onClick={handleDevLogin}>
          Dev: Войти через Telegram
        </button>
      );
    }
    if (isTelegramApp) {
      return (
        <button className="landing-cta__button" onClick={handleTelegramLogin}>
          Войти через Telegram
        </button>
      );
    }
    if (BOT_NAME) {
      return <TelegramLoginWidget botName={BOT_NAME} onAuth={handleWidgetAuth} buttonSize="large" />;
    }
    return null;
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-header__logo">
          <span className="landing-header__icon">🦜</span>
          <span className="landing-header__title">Easy English</span>
        </div>
        <nav className="landing-header__nav">
          <a href="#how-it-works">Как это работает</a>
          <a href="#features">Преимущества</a>
        </nav>
        {renderLoginButton()}
      </header>

      <section className="landing-hero">
        <div className="landing-hero__mascot">
          <div className="landing-hero__parrot">🦜</div>
        </div>
        <div className="landing-hero__content">
          <h1>Учи английский с попугаем!</h1>
          <p>
            Твой персональный помощник в изучении английского языка.
            Проходи упражнения, зарабатывай зёрнышки и развивай своего попугая!
          </p>
          {renderHeroButton()}
        </div>
      </section>

      <section id="how-it-works" className="landing-section">
        <h2>Как это работает</h2>
        <div className="landing-steps">
          <div className="landing-step">
            <div className="landing-step__number">1</div>
            <h3>Выбери тему</h3>
            <p>Начни с любой интересной темы из каталога</p>
          </div>
          <div className="landing-step">
            <div className="landing-step__number">2</div>
            <h3>Изучай теорию</h3>
            <p>Прочитай материалы и разберись в правилах</p>
          </div>
          <div className="landing-step">
            <div className="landing-step__number">3</div>
            <h3>Проходи упражнения</h3>
            <p>Закрепляй знания на практике в тренажёре</p>
          </div>
        </div>
      </section>

      <section id="features" className="landing-section landing-section--alt">
        <h2>Преимущества</h2>
        <div className="landing-features">
          <div className="landing-feature">
            <span className="landing-feature__icon">🎮</span>
            <h3>Геймификация</h3>
            <p>Зарабатывай зёрнышки и опыт, открывай достижения</p>
          </div>
          <div className="landing-feature">
            <span className="landing-feature__icon">🦜</span>
            <h3>Маскот-попугай</h3>
            <p>Развивай своего питомца вместе с прогрессом</p>
          </div>
          <div className="landing-feature">
            <span className="landing-feature__icon">📱</span>
            <h3>Telegram Mini App</h3>
            <p>Учись прямо в Telegram, без установки приложений</p>
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <h2>Готов начать?</h2>
        <p>Присоединяйся к тысячам изучающих английский</p>
        {renderCtaButton()}
      </section>
    </div>
  );
}
