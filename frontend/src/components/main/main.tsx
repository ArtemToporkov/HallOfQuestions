import type { PropsWithChildren, ReactElement } from 'react';

import './main.css';

type MainProps = PropsWithChildren<object>;

export function Main({ children }: MainProps): ReactElement {
    return (
        <main className="main">
            {children}
        </main>
    );
}