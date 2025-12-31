import classNames from 'classnames';
import type { ReactElement } from 'react';
import { Link, generatePath } from 'react-router-dom';

import { convertReportStatusToString, formatTimeWithOffset } from '../../utils/utils.ts';
import { ReportStatus } from '../../enums/report-status.ts';
import type { ReportData } from '../../types/report-data.ts';
import type { IsoString } from '../../types/iso-string.ts';
import { AppRoute } from '../../enums/app-route.ts';

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
    const reportLink = generatePath(AppRoute.Report, { id: report.id });

    return (
        <div className={classNames(
            'report-info',
            { 'report-info-ended': isEnded }
        )}>
            <div className="report-info__header">
                <span className="report-info__title">{report.title}</span>
                <span className="report-info__speaker">
                    {`${report.speaker.name} ${report.speaker.surname}`}
                </span>
            </div>

            <div className="report-info__timing">
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
                <Link to={reportLink} className="report-info__questions-button">
                    <span className="report-info__questions-button-title">Вопросы</span>
                    <span className="report-info__questions-button-count">{questionsCount}</span>
                </Link>
            </div>
            <div className={classNames(
                'report-info__goto',
                { "report-info__goto-started": isStarted }
            )}>
                <Link to={reportLink} className="report-info__goto-button">
                    <span className="report-info__goto-button-title">Перейти</span>
                </Link>
            </div>
        </div>
    );
}