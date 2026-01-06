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
        <div className="report-info">
            <div className="report-info__header">
                <span className="report-info__title">{report.title}</span>
                <div className="report-info__speaker">
                    {report.speaker.name} {report.speaker.surname}
                </div>
            </div>

            <table className="report-info__table">
                <tbody>
                <tr>
                    <th className="report-info__key">Начало:</th>
                    <td className="report-info__value">{startTime}</td>
                </tr>
                <tr>
                    <th className="report-info__key">Конец:</th>
                    <td className="report-info__value">{endTime}</td>
                </tr>
                <tr>
                    <th className="report-info__key">Статус:</th>
                    <td className="report-info__value">{statusString}</td>
                </tr>
                </tbody>
            </table>

            <div className="report-info__actions">
                {report.status === ReportStatus.NotStarted && (
                    <Button
                        className="report-info__action-button"
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
                        className="report-info__action-button"
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