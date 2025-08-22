import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { lesson } from '#requests/lesson';
import { Button, ButtonType } from '#src/ui/button/button';
import './lesson-page.scss';

export function LessonPage() {
  const { id } = useParams();

  if (id == undefined) {
    return;
  }

  const [ result, setResult ] = useState<string[]>([]);

  const onResultItemClick = (item: string) => {
    setResult(result.filter(resultItem => resultItem != item));
  }

  const onDeleteLastWordButtonClick = () => {
    setResult(prev => prev.slice(0, -1));
  }

  const onOptionClick = (option: string) => {
    setResult([...result, option]);
  }

  const { name, tasks } = lesson(+id!);
  const task = tasks[0];

  return (
    <div className='lesson-page'>
      <h1 className='lesson-page__title'>
        <Link to='/lessons' className='lesson-page__back-button'>Назад</Link>
        <span className='lesson-page__subject-name'>{name}</span>
      </h1>
      <div className="lesson-page__task-name">{task.name}</div>
      <div className="lesson-page__task-result">
        {result.map(item => (
          <Button
            key={item} type={ButtonType.Purple} className="lesson-page__task-result-item"
            onClick={() => onResultItemClick(item)}
          >
            {item}
          </Button>
        ))}
      </div>
      <Button
        type={ButtonType.Red} disabled={result.length == 0} className="lesson-page__delete-button"
        onClick={onDeleteLastWordButtonClick}
      >
        удалить последнее слово
      </Button>
      <div className="lesson-page__options">
        {task.options.map(option => (
          <Button
            key={option} type={ButtonType.Purple} disabled={result.includes(option)}
            onClick={() => onOptionClick(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  )
}
