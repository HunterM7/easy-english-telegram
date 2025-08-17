import { mockLessons } from './utils/mockLessons';
import { LessonsPageCard } from './lessons-page-card/lessons-page-card';
import './lessons-page.css'

export function LessonsPage() {

  return (
    <div className='lessons-page'>
      <h1 className='lessons-page__title'>Уроки</h1>
      <div className='lessons-page__list'>
        {mockLessons.map(lesson => {
          const { id, name, description } = lesson;
          return <LessonsPageCard id={id} key={id} name={name} description={description}/>
        })}
      </div>
    </div>
  )
}
