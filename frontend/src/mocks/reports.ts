import type { ReportData } from '../types/report-data.ts';
import { ReportStatus } from '../enums/report-status.ts';

export const REPORT: ReportData = {
    id: '1',
    title: 'Как (не) потерять данные в PostgreSQL',
    speakerInfo: {
        name: 'Кирилл',
        surname: 'Решке'
    },
    scheduledStartDate: '2025-12-30T13:00:00+05:00',
    scheduledEndDate: '2025-12-30T15:00:00+05:00',
    status: ReportStatus.NotStarted
}