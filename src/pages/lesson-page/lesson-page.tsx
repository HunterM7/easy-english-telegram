import { Link, useParams } from 'react-router-dom';
import './lesson-page.scss';

export function LessonPage() {
  const { id } = useParams();
  return (
    <div className='lesson-page'>
      <Link to='/lessons'>Назад</Link>
      <br />
      Страница урока №{id}
    </div>
  )
}
