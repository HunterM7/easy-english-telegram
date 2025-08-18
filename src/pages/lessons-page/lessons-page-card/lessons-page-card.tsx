import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames';
import './lessons-page-card.scss'

interface Props {
  id: number;
  name: string;
  description: string;
  className?: string | undefined;
}

export function LessonsPageCard(props: Props) {
  const { id, name, description, className } = props;
  return (
    <Link to={`/lessons/${id}`} className={classNames('lessons-page-card', className)}>
      <p className='lessons-page-card__name'>{name}</p>
      <p className='lessons-page-card__description'>{description}</p>
    </Link>
  )
}
