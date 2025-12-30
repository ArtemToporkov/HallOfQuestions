import type { SpeakerInfo } from './speaker-info.ts';
import type { ConferenceStatus } from '../enums/conference-status.ts';

export type ConferenceInfo = {
    id: string;
    name: string;
    speakerInfo: SpeakerInfo;
    scheduledStartDate: Date;
    scheduledEndDate: Date;
    status: ConferenceStatus;
    actualStartDate?: Date;
    actualEndDate?: Date;
}