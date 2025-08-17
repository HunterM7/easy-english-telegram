import { useLaunchParams } from '@telegram-apps/sdk-react';
import './home-page.css';
import { Link } from 'react-router-dom';

export function HomePage() {
  const { tgWebAppData } = useLaunchParams();
  const firstName = tgWebAppData?.user?.first_name;
  const photoUrl = tgWebAppData?.user?.photo_url;

  return (
    <div className='home-page'>
      <span>Добро пожаловать{firstName ? `, ${firstName}` : ''}!</span>
      <img className='home-page__photo' src={photoUrl} alt={firstName} />
      <Link to='lessons'>Уроки</Link>
    </div>
  )
}
