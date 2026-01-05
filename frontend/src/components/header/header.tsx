import { Link } from 'react-router-dom';
import type { ReactElement } from 'react';

import { AppRoute } from '../../enums/app-route.ts';

import './header.css';

export function Header(): ReactElement {
    return (
        <header className="header">
            <Link className="header__text" to={AppRoute.Main}>
                Hall of Questions
            </Link>
        </header>
    )
}