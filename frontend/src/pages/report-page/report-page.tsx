import type { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

import { Layout } from '../../components/layout/layout.tsx';
import { ReportDetails } from '../../components/report-details/report-details.tsx';
import { QuestionCard } from '../../components/question-card/question-card.tsx';
import { REPORTS } from '../../mocks/reports.ts';
import { QUESTIONS } from '../../mocks/questions.ts';

import './report-page.css';

function ReportPageHeader(): ReactElement {
    return (
        <div className="report-page__header">
            <span className="report-page__header-text">
                Вопросы
            </span>
            <button className="report-page__header-ask-button">
                Задать
            </button>
        </div>
    );
}

export function ReportPage(): ReactElement {
    const { id } = useParams<{ id: string }>();

    const report = REPORTS.find((r) => r.id === id);
    const reportQuestions = QUESTIONS.filter((q) => q.conferenceId === id);

    if (!report) {
        return (
            <Layout>
                <div className="report-page__container">
                    <div className="report-page__not-found">Доклад не найден</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="report-page__container">
                <ReportDetails report={report} />
                <ReportPageHeader />
                <div className="report-page__questions-list">
                    {reportQuestions.map((q) => (
                        <QuestionCard key={q.id} question={q} />
                    ))}
                    {reportQuestions.length === 0 && (
                        <div className="report-page__questions-list-empty">
                            <span>Вопросов пока нет</span>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}