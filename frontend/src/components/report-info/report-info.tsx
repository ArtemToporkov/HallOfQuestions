import type { ReactElement } from 'react';

import { convertReportStatusToString, formatTimeWithOffset } from '../../utils/utils.ts';
import { Button } from '../button/button.tsx';
import { ReportStatus } from '../../enums/report-status.ts';
import type { ReportData } from '../../types/report-data.ts';

import './report-info.css';

type ReportDetailsProps = {
    report: ReportData;
    handleStartClick: () => void;
    handleEndClick: () => void;
    isStartButtonLoading: boolean;
    isEndButtonLoading: boolean;
}

export function ReportInfo({
    report,
    handleStartClick,
    handleEndClick,
    isStartButtonLoading,
    isEndButtonLoading
}: ReportDetailsProps): ReactElement {
    let startTime: string;
    let endTime: string;

    if (report.status === ReportStatus.Started) {
        startTime = formatTimeWithOffset(report.actualStartDateUtc ?? report.scheduledStartDateUtc);
        endTime = '-';
    } else if (report.status === ReportStatus.Ended) {
        startTime = formatTimeWithOffset(report.actualStartDateUtc ?? report.scheduledStartDateUtc);
        endTime = formatTimeWithOffset(report.actualEndDateUtc ?? report.scheduledEndDateUtc);
    } else {
        startTime = formatTimeWithOffset(report.scheduledStartDateUtc);
        endTime = formatTimeWithOffset(report.scheduledEndDateUtc);
    }

    const statusString = convertReportStatusToString(
        report.status,
        report.actualStartDateUtc,
        report.actualEndDateUtc
    );

    return (
        <div className="report-details">
            <div className="report-details__header">
                <span className="report-details__title">{report.title}</span>
                <div className="report-details__speaker">
                    {report.speaker.name} {report.speaker.surname}
                </div>
            </div>

            <div className="report-details__info-row">
                <div className="report-details__info-item">
                    <span className="report-details__key">Начало:</span>
                    <span className="report-details__value">{startTime}</span>
                </div>
                <div className="report-details__info-item">
                    <span className="report-details__key">Конец:</span>
                    <span className="report-details__value">{endTime}</span>
                </div>
                <div className="report-details__info-item">
                    <span className="report-details__key">Статус:</span>
                    <span className="report-details__value">{statusString}</span>
                </div>
            </div>

            <div className="report-details__info-row">
                {report.status === ReportStatus.NotStarted && (
                    <Button
                        className="report-details__action-button"
                        spinnerWidth="10px"
                        spinnerHeight="10px"
                        onClick={handleStartClick}
                        isLoading={isStartButtonLoading}
                    >
                        Начать доклад
                    </Button>
                )}
                {report.status === ReportStatus.Started && (
                    <Button
                        className="report-details__action-button"
                        spinnerWidth="10px"
                        spinnerHeight="10px"
                        onClick={handleEndClick}
                        isLoading={isEndButtonLoading}
                    >
                        Завершить доклад
                    </Button>
                )}
            </div>
        </div>
    );
}