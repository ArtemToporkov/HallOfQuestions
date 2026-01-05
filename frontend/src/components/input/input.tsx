import type { InputHTMLAttributes, ReactElement } from 'react';
import classNames from 'classnames';
import './input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export function Input({ className, ...props }: InputProps): ReactElement {
    return (
        <input className={classNames('input', className)} {...props} />
    );
}