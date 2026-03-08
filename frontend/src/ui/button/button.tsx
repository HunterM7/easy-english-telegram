import type { PropsWithChildren } from 'react';
import { classNames } from '#src/utils/classNames';
import { ButtonType } from './utils/interface';
import './button.scss';

export { ButtonType };

interface Props {
  /** Тип кнопки. */
  type: ButtonType;
  /** Признак того, что кнопка выключена.. */
  disabled?: boolean | undefined;
  /** Дополнительный класс для управления компонентом. */
  className?: string | undefined;
  /** Обработчик клика. */
  onClick?: () => void;
}

/** Кнопка. */
export function Button(props: PropsWithChildren<Props>) {
  const { type, className, children, disabled, onClick } = props;
  return (
    <button
      className={classNames('ui-button', `ui-button--${type}`, className)}
      disabled={disabled} onClick={onClick}
    >
      {children}
    </button>
  )
}