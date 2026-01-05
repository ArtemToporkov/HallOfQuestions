import classNames from 'classnames';
import type { ButtonHTMLAttributes, ReactElement } from 'react';

import { Spinner } from '../spinner/spinner.tsx';

import './button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    spinnerWidth?: string | number;
    spinnerHeight?: string | number;
}

export function Button({
    isLoading,
    spinnerWidth,
    spinnerHeight,
    className,
    children,
    ...props
}: ButtonProps): ReactElement {
    return (
        <button className={classNames('button', className, { 'button--loading': isLoading })} {...props}>
            {isLoading && (
                <span className="button__spinner-container">
                    <Spinner width={spinnerWidth} height={spinnerHeight} />
                </span>
            )}

            <span className={classNames('button__content', { 'button__content--hidden': isLoading })}>
                {children}
            </span>
        </button>
    );
}