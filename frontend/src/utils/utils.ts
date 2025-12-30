import type { IsoString } from '../types/iso-string.ts';
import { ReportStatus } from '../enums/report-status.ts';

export function formatTimeWithOffset(isoString: IsoString): string {
    const date = new Date(isoString);

    const hh = String(date.getUTCHours()).padStart(2, '0');
    const mm = String(date.getUTCMinutes()).padStart(2, '0');

    const offsetMinutes = -date.getTimezoneOffset();
    const offsetSign = offsetMinutes >= 0 ? '+' : '-';
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);

    return `${hh}:${mm} UTC${offsetSign}${offsetHours}`;
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
