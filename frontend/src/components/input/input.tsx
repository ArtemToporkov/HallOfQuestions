import classNames from 'classnames';
import type { InputHTMLAttributes, ReactElement } from 'react';

import './input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export function Input({ className, ...props }: InputProps): ReactElement {
    return (
        <input className={classNames('input', className)} {...props} />
    );
}