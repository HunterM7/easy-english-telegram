import { useLaunchParams } from '@telegram-apps/sdk-react';
import { Link } from 'react-router-dom';
import './home-page.scss';

export function HomePage() {
  const data = useLaunchParams();
  const firstName = data.tgWebAppData?.user?.first_name;
  const photoUrl = data.tgWebAppData?.user?.photo_url;

  return (
    <div className='home-page'>
      <span>Добро пожаловать{firstName ? `, ${firstName}` : ''}!</span>
      <img className='home-page__photo' src={photoUrl} alt={firstName} />
      <Link to='lessons'>Уроки</Link>
      <div>{JSON.stringify(data)}</div>
    </div>
  )
}
