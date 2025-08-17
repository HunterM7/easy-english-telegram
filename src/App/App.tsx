import { useLaunchParams } from '@telegram-apps/sdk-react';
import './app.css';

export function App() {
  const { tgWebAppData } = useLaunchParams();
  const firstName = tgWebAppData?.user?.first_name;

  return (
    <div className='app'>
      Добро пожаловать{firstName ? <span>, {firstName}</span> : ''}!
    </div>
  )
}
