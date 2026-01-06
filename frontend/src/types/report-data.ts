import type { SpeakerData } from './speaker-data.ts';
import type { ReportStatus } from '../enums/report-status.ts';
import type { IsoString } from './iso-string.ts';

export type ReportData = {
    id: string;
    title: string;
    speaker: SpeakerData;
    scheduledStartDateUtc: IsoString;
    scheduledEndDateUtc: IsoString;
    status: ReportStatus;
    actualStartDateUtc?: IsoString;
    actualEndDateUtc?: IsoString;
}