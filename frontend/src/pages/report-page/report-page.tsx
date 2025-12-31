import { type FormEvent, type ReactElement, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Layout } from '../../components/layout/layout.tsx';
import { ReportDetails } from '../../components/report-details/report-details.tsx';
import { QuestionCard } from '../../components/question-card/question-card.tsx';
import {
    addQuestion,
    type AddQuestionRequest,
    endReport,
    getQuestions,
    getReports,
    startReport
} from '../../api/api.ts';
import { ReportStatus } from '../../enums/report-status.ts';

import './report-page.css';

function getEmptyQuestionsMessage(reportStatus: ReportStatus): string {
    switch (reportStatus) {
        case ReportStatus.Ended:
            return 'Вопросов спикеру не было';
        case ReportStatus.Started:
            return 'Вопросов пока нет';
        case ReportStatus.NotStarted:
            return 'Доклад ещё не начался';
    }
}

function ReportPageHeader({ onAskClick, status }: {
    onAskClick: () => void,
    status: ReportStatus
}): ReactElement {
    return (
        <div className="report-page__header">
            <span className="report-page__header-text">
                Вопросы
            </span>
            {
                status === ReportStatus.Started &&
                    <div className="report-page__header-actions">
                        <button className="report-page__header-ask-button" onClick={onAskClick}>
                            Задать
                        </button>
                    </div>
            }
        </div>
    );
}

export function ReportPage(): ReactElement {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [, setIsModalOpen] = useState(false);

    const { data: reports = [] } = useQuery({
        queryKey: ['reports'],
        queryFn: getReports
    });

    const { data: reportQuestions = [] } = useQuery({
        queryKey: [`report/${id}`],
        queryFn: () => getQuestions(id as string)
    });

    const report = reports.find((r) => r.id === id);

    const startMutation = useMutation({
        mutationFn: () => startReport(id as string),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] })
    });

    const endMutation = useMutation({
        mutationFn: () => endReport(id as string),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] })
    });

    const addQuestionMutation = useMutation({
        mutationFn: (req: AddQuestionRequest) => addQuestion(id as string, req),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`report/${id}`] });
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

    const handleQuestionSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        addQuestionMutation.mutate({
            questionTheme: formData.get('questionTheme') as string,
            questionText: formData.get('questionText') as string
        });
    }

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
                <ReportDetails
                    report={report}
                    handleStartClick={() => startMutation.mutate()}
                    handleEndClick={() => endMutation.mutate()}
                />
                <ReportPageHeader
                    onAskClick={openModal}
                    status={report.status}
                />
                <div className="report-page__questions-list">
                    {reportQuestions.map((q) => (
                        <QuestionCard key={q.id} question={q} />
                    ))}
                    {reportQuestions.length === 0 && (
                        <div className="report-page__questions-list-empty">
                            <span>{getEmptyQuestionsMessage(report.status)}</span>
                        </div>
                    )}
                </div>
            </div>

            <dialog ref={dialogRef} className="report-page__ask-modal">
                <span className="report-page__ask-header">Задать вопрос</span>

                <form onSubmit={handleQuestionSubmit} className="report-page__ask-form" id="askForm">
                    <input className="report-page__ask-section-input" name="questionTheme" placeholder="Тема" required minLength={3} maxLength={50} />
                    <textarea className="report-page__ask-section-input" name="questionText" placeholder="Текст" required minLength={10} maxLength={200} rows={4} />
                </form>

                <div className="report-page__ask-actions">
                    <button className="report-page__ask-close" type="button" onClick={closeModal}>Отмена</button>
                    <button className="report-page__ask-send" type="submit" disabled={addQuestionMutation.isPending} form="askForm">Отправить</button>
                </div>
            </dialog>
        </Layout>
    );
}