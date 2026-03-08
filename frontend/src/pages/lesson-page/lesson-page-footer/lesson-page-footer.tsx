import settingsIcon from '#src/icons/settings.svg'
import helpOutlinedIcon from '#src/icons/helpOutlined.svg'
import './lesson-page-footer.scss';

interface Props {
  progress: number
}

export function LessonPageFooter(props: Props) {
  const { progress } = props;

  return (
    <div className='lesson-page-footer'>
        <div className="lesson-page-footer__button">
            <img src={helpOutlinedIcon} alt='Подсказка' />
        </div>
        <div className="lesson-page-footer__progress">
            <div className="lesson-page-footer__progress-bar">
                <div className="lesson-page-footer__progress-bar-completed" style={{ width: `${progress}%` }}/>
            </div>
            <div className="lesson-page-footer__progress-text">{progress}% завершено</div>
        </div>
        <div className="lesson-page-footer__button">
            <img src={settingsIcon} alt='Настройки' />
        </div>
    </div>
  )
}
