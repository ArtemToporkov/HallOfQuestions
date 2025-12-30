import { type ReactElement, useState } from 'react';
import classNames from 'classnames';
import type { QuestionData } from '../../types/question-data.ts';

import './question-card.css';

type QuestionCardProps = {
    question: QuestionData;
}

export function QuestionCard({ question }: QuestionCardProps): ReactElement {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(question.likesCount);
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
                        { 'question-card__like-button-liked': isLiked }
                    )}
                    type="button"
                    aria-label="like"
                    onClick={() => {
                        if (isLiked) {
                            setLikesCount(likesCount - 1);
                        } else {
                            setLikesCount(likesCount + 1);
                        }
                        setIsLiked(!isLiked);
                    }}
                />
                <span className="question-card__likes-count">{likesCount}</span>
            </div>
        </div>
    );
}