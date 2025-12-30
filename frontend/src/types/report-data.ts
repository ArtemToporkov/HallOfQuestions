import type { SpeakerData } from './speaker-data.ts';
import type { ReportStatus } from '../enums/report-status.ts';
import type { IsoString } from './iso-string.ts';

export type ReportData = {
    id: string;
    title: string;
    speakerInfo: SpeakerData;
    scheduledStartDate: IsoString;
    scheduledEndDate: IsoString;
    status: ReportStatus;
    actualStartDate?: IsoString;
    actualEndDate?: IsoString;
}