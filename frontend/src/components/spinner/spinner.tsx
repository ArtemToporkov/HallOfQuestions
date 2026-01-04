import classNames from 'classnames';

import type { CSSProperties, ReactElement } from 'react';

import './spinner.css';

type SpinnerProps = {
    width?: string | number;
    height?: string | number;
    className?: string;
};

export function Spinner({ width = '15px', height = '15px', className }: SpinnerProps): ReactElement {
    const style: CSSProperties = {
        width,
        height,
    };
    return <span className={classNames('spinner', className)} style={style} aria-label="loading" />;
}