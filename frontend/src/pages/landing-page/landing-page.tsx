import './landing-page.scss';

export function LandingPage() {
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
      </section>
    </div>
  );
}
