import type { ReactElement } from 'react';
import classNames from 'classnames';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { likeQuestion } from '../../api/api.ts';
import type { QuestionData } from '../../types/question-data.ts';

import './question-card.css';

type QuestionCardProps = {
    question: QuestionData;
}

export function QuestionCard({ question }: QuestionCardProps): ReactElement {
    const queryClient = useQueryClient();

    const likeMutation = useMutation({
        mutationFn: () => likeQuestion(question.reportId, question.id),
        onSuccess: () => queryClient.invalidateQueries({queryKey: [`report/${question.reportId}`]})
    });

    return (
        <div className="question-card">
            <div className="question-card__question">
                <span className="question-card__question-theme">{question.theme}</span>
                <span className="question-card__question-text">{question.text}</span>
            </div>
            <div className="question-card__likes">
                <button
                    className={classNames(
                        'question-card__like-button',
                        { 'question-card__like-button-liked': false }
                    )}
                    type="button"
                    aria-label="like"
                    onClick={() => likeMutation.mutate()}
                    disabled={likeMutation.isPending}
                />
                <span className="question-card__likes-count">{question.likesCount}</span>
            </div>
        </div>
    );
}