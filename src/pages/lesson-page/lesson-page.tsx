import { useParams } from 'react-router-dom';
import './lesson-page.css';

export function LessonPage() {
  const { id } = useParams();
  return (
    <div className='lesson-page'>
      Страница урока №{id}
    </div>
  )
}
