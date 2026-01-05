import classNames from 'classnames';
import type { TextareaHTMLAttributes, ReactElement } from 'react';

import './textarea.css';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
}

export function TextArea({ className, ...props }: TextAreaProps): ReactElement {
    return (
        <textarea className={classNames('textarea', className)} {...props} />
    );
}