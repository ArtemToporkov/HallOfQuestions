import classNames from 'classnames';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState, type FormEvent, type ReactElement } from 'react';

import { Layout } from '../../components/layout/layout.tsx';
import { ReportInfo } from '../../components/report-info/report-info.tsx';
import { QuestionCard } from '../../components/question-card/question-card.tsx';
import { ReportStatus } from '../../enums/report-status.ts';
import { Spinner } from '../../components/spinner/spinner.tsx';
import { Modal } from '../../components/modal/modal.tsx';
import { Input } from '../../components/input/input.tsx';
import { TextArea } from '../../components/textarea/textarea.tsx';
import {
    addQuestion,
    endReport,
    getQuestions,
    getReports,
    startReport,
    type AddQuestionRequest
} from '../../api/api.ts';
import type { ReportData } from '../../types/report-data.ts';
import type { QuestionData } from '../../types/question-data.ts';

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

function ReportNotFoundPanel(): ReactElement {
    return (
        <Layout>
            <div className="report-page__container">
                <div className="report-page__not-found">Доклад не найден</div>
            </div>
        </Layout>
    );
}

function ReportLoadingContainer(): ReactElement {
    return (
        <Layout>
            <div className="report-page__container">
                <div className="report-page__page-loader">
                    <Spinner width="20px" height="20px" />
                </div>
            </div>
        </Layout>
    );
}

export function ReportPage(): ReactElement {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [, setIsModalOpen] = useState(false);

    const { data: reports = [], isLoading: isReportsLoading } = useQuery({
        queryKey: ['reports'],
        queryFn: getReports
    });

    const { data: reportQuestions = [], isLoading: isQuestionsLoading } = useQuery({
        queryKey: [`report/${id}`],
        queryFn: () => getQuestions(id as string)
    });

    const report = reports.find((r) => r.id === id);

    const startMutation = useMutation({
        mutationFn: () => startReport(id as string),
        onSuccess: (updatedReport) => {
            queryClient.setQueryData(['reports'], (oldReports: ReportData[] | undefined) => {
                if (!oldReports) return [];
                return oldReports.map(r => r.id === updatedReport.id ? updatedReport : r);
            });
        }
    });

    const endMutation = useMutation({
        mutationFn: () => endReport(id as string),
        onSuccess: (updatedReport) => {
            queryClient.setQueryData(['reports'], (oldReports: ReportData[] | undefined) => {
                if (!oldReports) return [];
                return oldReports.map(r => r.id === updatedReport.id ? updatedReport : r);
            });
        }
    });

    const addQuestionMutation = useMutation({
        mutationFn: (req: AddQuestionRequest) => addQuestion(id as string, req),
        onSuccess: (newQuestion) => {
            queryClient.setQueryData([`report/${id}`], (oldQuestions: QuestionData[] | undefined) => {
                return oldQuestions ? [...oldQuestions, newQuestion] : [newQuestion];
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

    const handleQuestionSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        addQuestionMutation.mutate({
            questionTheme: formData.get('questionTheme') as string,
            questionText: formData.get('questionText') as string
        });
    }

    if (isReportsLoading) {
        return <ReportLoadingContainer />;
    }

    if (!report) {
        return <ReportNotFoundPanel />
    }

    const isListEmpty = !isQuestionsLoading && reportQuestions.length === 0;

    return (
        <Layout>
            <div className="report-page__container">
                <ReportInfo
                    report={report}
                    handleStartClick={() => startMutation.mutate()}
                    handleEndClick={() => endMutation.mutate()}
                    isStartButtonLoading={startMutation.isPending}
                    isEndButtonLoading={endMutation.isPending}
                />
                <ReportPageHeader
                    onAskClick={openModal}
                    status={report.status}
                />
                <div className={classNames(
                    'report-page__questions-list',
                    {
                        'report-page__questions-list--loading': isQuestionsLoading,
                        'report-page__questions-list--empty': isListEmpty
                    }
                )}>
                    {isQuestionsLoading && (
                        <Spinner width="20px" height="20px" />
                    )}

                    {!isQuestionsLoading && reportQuestions.length > 0 && (
                        reportQuestions.map((q) => (
                            <QuestionCard key={q.id} question={q} />
                        ))
                    )}

                    {isListEmpty && (
                        <span>{getEmptyQuestionsMessage(report.status)}</span>
                    )}
                </div>
            </div>

            <Modal
                ref={dialogRef}
                title="Задать вопрос"
                onClose={closeModal}
                onSubmit={handleQuestionSubmit}
                submitButtonText="Отправить"
                isSubmitLoading={addQuestionMutation.isPending}
            >
                <Input name="questionTheme" placeholder="Тема" required minLength={3} maxLength={50} />
                <TextArea name="questionText" placeholder="Текст" required minLength={10} maxLength={200} rows={4} />
            </Modal>
        </Layout>
    );
}