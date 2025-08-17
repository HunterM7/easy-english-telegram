import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames';
import './lessons-page-card.css'

interface Props {
  id: number;
  name: string;
  description: string;
  className?: string | undefined;
}

export function LessonsPageCard(props: Props) {
  const { id, name, description, className } = props;
  return (
    <Link to={id.toString()} className={classNames('lessons-page-card', className)}>
      <p className='lessons-page-card__name'>{name}</p>
      <p className='lessons-page-card__description'>{description}</p>
    </Link>
  )
}
