import { type ReactElement, useState, useRef, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Layout } from '../../components/layout/layout.tsx';
import { ReportInfo } from '../../components/report-info/report-info.tsx';
import { ReportStatus } from '../../enums/report-status.ts';
import { addReport, getReports, type AddReportRequest } from '../../api/api.ts';
import { Button } from '../../components/button/button.tsx';
import { Spinner } from '../../components/spinner/spinner.tsx';
import type { ReportData } from '../../types/report-data.ts';

import './reports-page.css';

function ReportsPageHeader({ handleCreateClick }: { handleCreateClick: () => void }): ReactElement {
    return (
        <div className="reports-page__header">
            <span className="reports-page__header-text">
                Доклады
            </span>
            <button className="reports-page__header-create-button" onClick={handleCreateClick}>
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

function ReportsList({ reports, isLoading }: { reports: ReportData[], isLoading: boolean }) {
    if (reports.length === 0) {
        if (isLoading) {
            return (
                <div className="reports-page__reports-list-loading">
                    <Spinner width="20px" height="20px" />
                </div>
            )
        } else {
            return <span className="reports-page__reports-list-empty">Докладов не найдено</span>;
        }
    }

    return (
        <div className="reports-page__reports-list">
            {reports.map((r) => <ReportInfo key={r.id} report={r} />)}
        </div>
    );
}

export function ReportsPage(): ReactElement {
    const [chosenStatus, setChosenStatus] = useState<ReportStatus>(ReportStatus.Started);
    const [, setIsModalOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const queryClient = useQueryClient();

    const { data: reports = [], isLoading } = useQuery({
        queryKey: ['reports'],
        queryFn: getReports
    });

    const createReportMutation = useMutation({
        mutationFn: addReport,
        onSuccess: (newReport) => {
            queryClient.setQueryData(['reports'], (oldReports: ReportData[] | undefined) => {
                return oldReports ? [...oldReports, newReport] : [newReport];
            });
            closeModal();
        }
    });

    const openModal = () => {
        setIsModalOpen(true);
        dialogRef.current?.showModal();
    }

    const closeModal = () => {
        setIsModalOpen(false);
        dialogRef.current?.close();
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const request: AddReportRequest = {
            reportTitle: formData.get('reportTitle') as string,
            reportStartDate: new Date(formData.get('reportStartDate') as string).toISOString(),
            reportEndDate: new Date(formData.get('reportEndDate') as string).toISOString(),
            speaker: {
                name: formData.get('speakerName') as string,
                surname: formData.get('speakerSurname') as string
            }
        };

        createReportMutation.mutate(request);
    }

    const reportsByStatus = reports.filter((r) => r.status === chosenStatus);

    return (
        <Layout>
            <div className="reports-page__container">
                <ReportsPageHeader handleCreateClick={openModal} />

                <StatusChoice
                    checkedConditionCallback={(status) => status === chosenStatus}
                    handleChange={(status) => setChosenStatus(status)}
                />

                <ReportsList reports={reportsByStatus} isLoading={isLoading} />
            </div>

            <dialog ref={dialogRef} className="reports-page__create-modal">
                <span className="reports-page__create-header">Создать доклад</span>

                <form onSubmit={handleSubmit} className="reports-page__create-form" id="createForm">
                    <div className="reports-page__create-section">
                        <span className="reports-page__create-section-header">Название</span>
                        <input className="reports-page__create-section-input" name="reportTitle" placeholder="Название" required minLength={10} maxLength={50} />
                    </div>

                    <div className="reports-page__create-section">
                        <span className="reports-page__create-section-header">Спикер</span>
                        <input className="reports-page__create-section-input" name="speakerName" placeholder="Имя" required />
                        <input className="reports-page__create-section-input" name="speakerSurname" placeholder="Фамилия" required />
                    </div>

                    <div className="reports-page__create-section">
                        <label htmlFor="reportStartDate">Начало</label>
                        <input className="reports-page__create-section-input" name="reportStartDate" type="datetime-local" required />
                    </div>

                    <div className="reports-page__create-section">
                        <label htmlFor="reportTitle">Конец</label>
                        <input className="reports-page__create-section-input" name="reportEndDate" type="datetime-local" required />
                    </div>
                </form>

                <div className="reports-page__create-actions">
                    <button className="reports-page__create-close" type="button" onClick={closeModal}>Отмена</button>
                    <Button
                        className="reports-page__create-send"
                        type="submit"
                        form="createForm"
                        isLoading={createReportMutation.isPending}
                    >
                        Создать
                    </Button>
                </div>
            </dialog>
        </Layout>
    );
}