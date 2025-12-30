import classNames from 'classnames';
import type { ReactElement } from 'react';

import { convertReportStatusToString, formatTimeWithOffset } from '../../utils/utils.ts';
import { ReportStatus } from '../../enums/report-status.ts';
import type { ReportData } from '../../types/report-data.ts';
import type { IsoString } from '../../types/iso-string.ts';

import './report-info.css';

type ConferenceInfoProps = {
    report: ReportData;
    questionsCount?: number;
}

function TimingInfo({ scheduledStartDate, scheduledEndDate, reportStatus, actualStartDate, actualEndDate }: {
    scheduledStartDate: IsoString;
    scheduledEndDate: IsoString;
    reportStatus: ReportStatus;
    actualStartDate?: IsoString;
    actualEndDate?: IsoString;
}): ReactElement {
    const beginTime = formatTimeWithOffset(scheduledStartDate);
    const endTime = formatTimeWithOffset(scheduledEndDate);
    return (
        <table>
            <tbody>
            <tr className="report-info__timing-section">
                <th className="report-info__timing-key">Начало</th>
                <td className="report-info__timing-value">{beginTime}</td>
            </tr>
            <tr className="report-info__timing-section">
                <th className="report-info__timing-key">Конец</th>
                <td className="report-info__timing-value">{endTime}</td>
            </tr>
            <tr className="report-info__timing-section">
                <th className="report-info__timing-key">Статус</th>
                <td className="report-info__timing-value">
                    {convertReportStatusToString(reportStatus, actualStartDate, actualEndDate)}
                </td>
            </tr>
            </tbody>
        </table>
    );
}

export function ReportInfo({ report, questionsCount = 0 }: ConferenceInfoProps): ReactElement {
    const isStarted = report.status === ReportStatus.Started;
    const isEnded = report.status === ReportStatus.Ended;
    return (
        <div className={classNames(
            'report-info',
            { 'report-info-ended': isEnded }
        )}>
            <div className="report-info__header">
                <span className="report-info__title">{report.title}</span>
                <span className="report-info__speaker">
                    {`${report.speakerInfo.name} ${report.speakerInfo.surname}`}
                </span>
            </div>

            <div className={classNames(
                'report-info__timing',
                { 'report-info__timing-not-started': !isStarted }
            )}>
                <TimingInfo
                    scheduledStartDate={report.scheduledStartDate}
                    scheduledEndDate={report.scheduledEndDate}
                    actualStartDate={report.actualStartDate}
                    actualEndDate={report.actualEndDate}
                    reportStatus={report.status}
                />
            </div>

            <div className={classNames(
                'report-info__questions',
                { "report-info__questions-not-started": !isStarted }
            )}>
                <a className="report-info__questions-button">
                    <span className="report-info__questions-button-title">Вопросы</span>
                    <span className="report-info__questions-button-count">{questionsCount}</span>
                </a>
            </div>
        </div>
    );
}