import { ReportStatus } from '../enums/report-status.ts';
import type { ReportData } from '../types/report-data.ts';

export const REPORTS: ReportData[] = [
    {
        id: '1',
        title: 'Как (не) потерять данные в PostgreSQL',
        speaker: {
            name: 'Кирилл',
            surname: 'Решке'
        },
        scheduledStartDate: '2025-12-30T13:00:00+05:00',
        scheduledEndDate: '2025-12-30T15:00:00+05:00',
        status: ReportStatus.NotStarted
    },
    {
        id: '2',
        title: 'Как мы писали свой lock-free dictionary',
        speaker: {
            name: 'Антон',
            surname: 'Нечуговских'
        },
        scheduledStartDate: '2025-12-30T13:00:00+05:00',
        scheduledEndDate: '2025-12-30T15:00:00+05:00',
        status: ReportStatus.NotStarted
    },
    {
        id: '3',
        title: 'Шардируем Postgres не своими руками',
        speaker: {
            name: 'Кирилл',
            surname: 'Решке'
        },
        scheduledStartDate: '2025-12-30T13:00:00+05:00',
        scheduledEndDate: '2025-12-30T15:00:00+05:00',
        status: ReportStatus.Started,
        actualStartDate: '2025-12-30T13:07:00+05:00'
    },
    {
        id: '4',
        title: 'Шардируем Postgres не своими руками',
        speaker: {
            name: 'Кирилл',
            surname: 'Решке'
        },
        scheduledStartDate: '2025-12-30T13:00:00+05:00',
        scheduledEndDate: '2025-12-30T15:00:00+05:00',
        status: ReportStatus.Ended,
        actualStartDate: '2025-12-30T13:07:00+05:00'
    }
]