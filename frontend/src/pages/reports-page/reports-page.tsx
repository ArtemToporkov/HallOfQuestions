import { type ReactElement, useState } from 'react';

import { Layout } from '../../components/layout/layout.tsx';
import type { ReportData } from '../../types/report-data.ts';
import { ReportInfo } from '../../components/report-info/report-info.tsx';
import { ReportStatus } from '../../enums/report-status.ts';

import './reports-page.css';

type ConferencesPageProps = {
    reports: ReportData[];
}

function ReportsPageHeader(): ReactElement {
    return (
        <div className="reports-page__header">
            <span className="reports-page__header-text">
                Доклады
            </span>
            <button className="reports-page__header-create-button">
                Создать
            </button>
        </div>
    );
}

function StatusChoice({ checkedConditionCallback, handleChange }: {
    checkedConditionCallback: (status: ReportStatus) => boolean;
    handleChange: (status: ReportStatus) => void;
}): ReactElement {
    return (
        <div className="reports-page__status-choice">
            <label className="reports-page__status-choice-option">
                <input
                    className="reports-page__status-choice-radio"
                    type="radio"
                    name="status"
                    value={ReportStatus.Started}
                    checked={checkedConditionCallback(ReportStatus.Started)}
                    onChange={() => handleChange(ReportStatus.Started)}
                />
                <span className="reports-page__status-choice-label">
                    Текущие
                </span>
            </label>
            <label className="reports-page__status-choice-option">
                <input
                    className="reports-page__status-choice-radio"
                    type="radio"
                    name="status"
                    value={ReportStatus.NotStarted}
                    checked={checkedConditionCallback(ReportStatus.NotStarted)}
                    onChange={() => handleChange(ReportStatus.NotStarted)}
                />
                <span className="reports-page__status-choice-label">
                    Запланированные
                </span>
            </label>
            <label className="reports-page__status-choice-option">
                <input
                    className="reports-page__status-choice-radio"
                    type="radio"
                    name="status"
                    value={ReportStatus.Ended}
                    checked={checkedConditionCallback(ReportStatus.Ended)}
                    onChange={() => handleChange(ReportStatus.Ended)}
                />
                <span className="reports-page__status-choice-label">
                    Завершенные
                </span>
            </label>
        </div>
    )
}

function ReportsList({ reports }: { reports: ReportData[] }) {
    return (
        <div className="reports-page__reports-list">
            {reports.map((r) => <ReportInfo key={r.id} report={r} />)}
        </div>
    );
}

export function ReportsPage({ reports }: ConferencesPageProps): ReactElement {
    const [chosenStatus, setChosenStatus] = useState<ReportStatus>(ReportStatus.Started);
    const reportsByStatus = reports.filter((r) => r.status === chosenStatus);
    return (
        <Layout>
            <div className="reports-page__container">
                <ReportsPageHeader />

                <StatusChoice
                    checkedConditionCallback={(status) => status === chosenStatus}
                    handleChange={(status) => setChosenStatus(status)}
                />

                {
                    reportsByStatus.length !== 0
                        ? <ReportsList reports={reportsByStatus}/>
                        : <span className="reports-page__reports-list-empty">Докладов не найдено</span>
                }
            </div>
        </Layout>
    );
}
