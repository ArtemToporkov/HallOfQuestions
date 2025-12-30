import { Link } from 'react-router-dom';
import type { ReactElement } from 'react';
import { AppRoute } from '../../enums/app-route.ts';
import { Layout } from '../../components/layout/layout.tsx';

import './main-page.css';

export function MainPage(): ReactElement {
    return (
        <Layout>
            <div className="main-page__container">
                <div className="main-page__title">
                    О чём проект?
                </div>
                <div className="main-page__description">
                    Проект о том, что можно задавать вопросы по мере доклада на какой-нибудь конференции
                    докладчику и ставить лайки другим вопросам. В конце доклада докладчик может посмотреть на
                    самые популярные вопросы и ответить на них.
                </div>
                <Link className="main-page__reports-link" to={AppRoute.Reports}>
                    К докладам
                </Link>
            </div>
        </Layout>
    )
}