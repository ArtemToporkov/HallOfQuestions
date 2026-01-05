import classNames from 'classnames';
import { type ReactElement, useState, useRef, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Layout } from '../../components/layout/layout.tsx';
import { ReportCard } from '../../components/report-card/report-card.tsx';
import { ReportStatus } from '../../enums/report-status.ts';
import { addReport, getReports, type AddReportRequest } from '../../api/api.ts';
import { Spinner } from '../../components/spinner/spinner.tsx';
import { Modal } from '../../components/modal/modal.tsx';
import { Input } from '../../components/input/input.tsx';
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
    const isListEmpty = !isLoading && reports.length === 0;

    return (
        <div className={classNames(
            'reports-page__reports-list',
            {
                'reports-page__reports-list--loading': isLoading,
                'reports-page__reports-list--empty': isListEmpty
            }
        )}>
            {isLoading && (
                <Spinner width="20px" height="20px" />
            )}

            {!isLoading && !isListEmpty && reports.map((r) => (
                <ReportCard key={r.id} report={r} />
            ))}

            {isListEmpty && (
                <span>Докладов не найдено</span>
            )}
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

            <Modal
                ref={dialogRef}
                title="Создать доклад"
                onClose={closeModal}
                onSubmit={handleSubmit}
                submitButtonText="Создать"
                isSubmitLoading={createReportMutation.isPending}
            >
                <div className="reports-page__create-section">
                    <span className="reports-page__create-section-header">Название</span>
                    <Input name="reportTitle" placeholder="Название" required minLength={10} maxLength={50} />
                </div>

                <div className="reports-page__create-section">
                    <span className="reports-page__create-section-header">Спикер</span>
                    <Input name="speakerName" placeholder="Имя" required />
                    <Input name="speakerSurname" placeholder="Фамилия" required />
                </div>

                <div className="reports-page__create-section">
                    <label htmlFor="reportStartDate">Начало</label>
                    <Input name="reportStartDate" type="datetime-local" required />
                </div>

                <div className="reports-page__create-section">
                    <label htmlFor="reportTitle">Конец</label>
                    <Input name="reportEndDate" type="datetime-local" required />
                </div>
            </Modal>
        </Layout>
    );
}