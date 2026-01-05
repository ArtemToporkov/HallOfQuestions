import classNames from 'classnames';
import { Link, generatePath } from 'react-router-dom';
import type { ReactElement } from 'react';

import { convertReportStatusToString, formatTimeWithOffset } from '../../utils/utils.ts';
import { ReportStatus } from '../../enums/report-status.ts';
import { AppRoute } from '../../enums/app-route.ts';
import type { ReportData } from '../../types/report-data.ts';
import type { IsoString } from '../../types/iso-string.ts';

import './report-card.css';

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
            <tr>
                <th className="report-info__timing-key">Начало</th>
                <td className="report-info__timing-value">{beginTime}</td>
            </tr>
            <tr>
                <th className="report-info__timing-key">Конец</th>
                <td className="report-info__timing-value">{endTime}</td>
            </tr>
            <tr>
                <th className="report-info__timing-key">Статус</th>
                <td className="report-info__timing-value">
                    {convertReportStatusToString(reportStatus, actualStartDate, actualEndDate)}
                </td>
            </tr>
            </tbody>
        </table>
    );
}

export function ReportCard({ report, questionsCount = 0 }: ConferenceInfoProps): ReactElement {
    const isStarted = report.status === ReportStatus.Started;
    const isEnded = report.status === ReportStatus.Ended;
    const reportLink = generatePath(AppRoute.Report, { id: report.id });

    return (
        <div className={classNames(
            'report-info',
            { 'report-info--ended': isEnded }
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
                { "report-info__questions--hidden": !isStarted }
            )}>
                <Link to={reportLink} className="report-info__button">
                    <span className="report-info__button-title">Вопросы</span>
                    <span className="report-info__button-count">{questionsCount}</span>
                </Link>
            </div>
            <div className={classNames(
                'report-info__goto',
                { "report-info__goto--hidden": isStarted }
            )}>
                <Link to={reportLink} className="report-info__button">
                    <span className="report-info__button-title">Перейти</span>
                </Link>
            </div>
        </div>
    );
}