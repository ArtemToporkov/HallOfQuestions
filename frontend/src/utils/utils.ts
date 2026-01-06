import type { IsoString } from '../types/iso-string.ts';
import { ReportStatus } from '../enums/report-status.ts';

export function formatTimeWithOffset(isoString: IsoString): string {
    const date = new Date(isoString);
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    let datePart = '';
    if (diffDays === 0) {
        datePart = 'сегодня';
    } else if (diffDays === 1) {
        datePart = 'завтра';
    } else {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        datePart = `${dd}.${mm}.${yyyy}`;
    }

    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');

    const offsetMinutes = -date.getTimezoneOffset();
    const offsetSign = offsetMinutes >= 0 ? '+' : '-';
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);

    return `${datePart} ${hh}:${mm} UTC${offsetSign}${offsetHours}`;
}

export function convertReportStatusToString(
    status: ReportStatus,
    actualStartDate?: IsoString,
    actualEndDate?: IsoString,
): string {
    const formatDuration = (from: Date, to: Date): string => {
        const diffMs = Math.max(0, to.getTime() - from.getTime());

        const totalMinutes = Math.floor(diffMs / 1000 / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        const parts: string[] = [];

        if (hours > 0) {
            parts.push(`${hours} ч.`);
        }

        if (minutes > 0 || parts.length === 0) {
            parts.push(`${minutes} мин.`);
        }

        return parts.join(' ');
    };

    switch (status) {
        case ReportStatus.Started: {
            if (!actualStartDate) {
                return 'идёт';
            }

            const start = new Date(actualStartDate);
            const now = new Date();

            return `идёт ${formatDuration(start, now)}`;
        }

        case ReportStatus.Ended: {
            if (!actualStartDate || !actualEndDate) {
                return 'завершён';
            }

            const start = new Date(actualStartDate);
            const end = new Date(actualEndDate);

            return `завершён (${formatDuration(start, end)})`;
        }

        case ReportStatus.NotStarted:
            return 'запланирован';

        default:
            return '';
    }
}

const LIKED_QUESTIONS_KEY = 'liked_questions_ids';

const getLikedIds = (): string[] => {
    const stored = localStorage.getItem(LIKED_QUESTIONS_KEY);
    try {
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

export const isQuestionLiked = (questionId: string): boolean => {
    const ids = getLikedIds();
    return ids.includes(questionId);
};

export const toggleQuestionLikeInStorage = (questionId: string): boolean => {
    const ids = getLikedIds();
    const index = ids.indexOf(questionId);
    let isLikedNow: boolean;

    if (index !== -1) {
        ids.splice(index, 1);
        isLikedNow = false;
    } else {
        ids.push(questionId);
        isLikedNow = true;
    }

    localStorage.setItem(LIKED_QUESTIONS_KEY, JSON.stringify(ids));
    return isLikedNow;
};