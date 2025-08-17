import { useLaunchParams } from '@telegram-apps/sdk-react';
import './app.css';

export function App() {
  const { tgWebAppData } = useLaunchParams();
  const firstName = tgWebAppData?.user?.first_name;
  const photoUrl = tgWebAppData?.user?.photo_url;

  return (
    <div className='app'>
      <span>Добро пожаловать{firstName ? `, ${firstName}` : ''}!</span>
      <img className='photo' src={photoUrl} alt={firstName} />
    </div>
  )
}
