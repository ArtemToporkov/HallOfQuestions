import classNames from 'classnames';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, type ReactElement } from 'react';

import { likeQuestion, unlikeQuestion } from '../../api/api.ts';
import { isQuestionLiked, toggleQuestionLikeInStorage } from '../../utils/utils.ts';
import { Spinner } from '../spinner/spinner.tsx';
import type { QuestionData } from '../../types/question-data.ts';

import './question-card.css';

type QuestionCardProps = {
    question: QuestionData;
}

export function QuestionCard({ question }: QuestionCardProps): ReactElement {
    const queryClient = useQueryClient();
    const [isLiked, setIsLiked] = useState(() => isQuestionLiked(question.id));

    const toggleLikeMutation = useMutation({
        mutationFn: async () => {
            if (isLiked) {
                return await unlikeQuestion(question.reportId, question.id);
            } else {
                return await likeQuestion(question.reportId, question.id);
            }
        },
        onSuccess: (updatedQuestion) => {
            const newLikedState = toggleQuestionLikeInStorage(question.id);
            setIsLiked(newLikedState);

            queryClient.setQueryData(
                [`report/${question.reportId}`],
                (oldQuestions: QuestionData[] | undefined) => {
                    if (!oldQuestions) return [];
                    return oldQuestions.map((q) =>
                        q.id === updatedQuestion.id ? updatedQuestion : q
                    );
                }
            );
        }
    });

    return (
        <div className="question-card">
            <div className="question-card__question">
                <span className="question-card__theme">{question.theme}</span>
                <span className="question-card__text">{question.text}</span>
            </div>
            <div className="question-card__likes">
                <div className={classNames(
                    'question-card__likes-content',
                    { 'question-card__likes-content--loading': toggleLikeMutation.isPending }
                )}>
                    <button
                        className={classNames(
                            'question-card__like-button',
                            { 'question-card__like-button--active': isLiked }
                        )}
                        type="button"
                        aria-label={isLiked ? "unlike" : "like"}
                        onClick={() => toggleLikeMutation.mutate()}
                        disabled={toggleLikeMutation.isPending}
                    >
                    </button>
                    <span className="question-card__likes-count">{question.likesCount}</span>
                </div>
                <div className={classNames(
                    'question-card__likes-spinner',
                    { 'question-card__likes-spinner--loading': toggleLikeMutation.isPending }
                )}>
                    <Spinner width="20px" height="20px" />
                </div>
            </div>
        </div>
    );
}