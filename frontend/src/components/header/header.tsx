import type { ReactElement } from 'react';

import './header.css';

export function Header(): ReactElement {
    return (
        <header className="header">
            <span className="header__text">
                Hall of Questions
            </span>
        </header>
    )
}