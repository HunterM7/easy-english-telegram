import { Link } from 'react-router-dom';
import arrowLeft from '#src/icons/arrowLeft.svg'
import './header.scss';

interface Props {
  title: string
  backTo: string;
}

export function Header(props: Props) {
  const { title, backTo } = props;

  return (
    <div className='header'>
      <Link to={backTo} className='header__back-button'>
        <img src={arrowLeft} alt='Назад' />
      </Link>
      <span className='header__title'>{title}</span>
    </div>
  )
}
