import classNames from 'classnames';
import { Link, generatePath } from 'react-router-dom';
import type { ReactElement } from 'react';

import { convertReportStatusToString, formatTimeWithOffset } from '../../utils/utils.ts';
import { ReportStatus } from '../../enums/report-status.ts';
import { AppRoute } from '../../enums/app-route.ts';
import type { ReportData } from '../../types/report-data.ts';
import type { IsoString } from '../../types/iso-string.ts';

import './report-card.css';

type ReportCardProps = {
    report: ReportData;
    questionsCount?: number;
}

function TimingInfo({ scheduledStartDateUtc, scheduledEndDateUtc, reportStatus, actualStartDateUtc, actualEndDateUtc }: {
    scheduledStartDateUtc: IsoString;
    scheduledEndDateUtc: IsoString;
    reportStatus: ReportStatus;
    actualStartDateUtc?: IsoString;
    actualEndDateUtc?: IsoString;
}): ReactElement {
    let startDisplay: string;
    let endDisplay: string;

    if (reportStatus === ReportStatus.Started) {
        startDisplay = formatTimeWithOffset(actualStartDateUtc ?? scheduledStartDateUtc);
        endDisplay = '-';
    } else if (reportStatus === ReportStatus.Ended) {
        startDisplay = formatTimeWithOffset(actualStartDateUtc ?? scheduledStartDateUtc);
        endDisplay = formatTimeWithOffset(actualEndDateUtc ?? scheduledEndDateUtc);
    } else {
        startDisplay = formatTimeWithOffset(scheduledStartDateUtc);
        endDisplay = formatTimeWithOffset(scheduledEndDateUtc);
    }

    return (
        <table>
            <tbody>
            <tr>
                <th className="report-card__timing-key">Начало</th>
                <td className="report-card__timing-value">{startDisplay}</td>
            </tr>
            <tr>
                <th className="report-card__timing-key">Конец</th>
                <td className="report-card__timing-value">{endDisplay}</td>
            </tr>
            <tr>
                <th className="report-card__timing-key">Статус</th>
                <td className="report-card__timing-value">
                    {convertReportStatusToString(reportStatus, actualStartDateUtc, actualEndDateUtc)}
                </td>
            </tr>
            </tbody>
        </table>
    );
}

export function ReportCard({ report, questionsCount = 0 }: ReportCardProps): ReactElement {
    const isStarted = report.status === ReportStatus.Started;
    const isEnded = report.status === ReportStatus.Ended;
    const reportLink = generatePath(AppRoute.Report, { id: report.id });

    return (
        <div className={classNames(
            'report-card',
            { 'report-card--ended': isEnded }
        )}>
            <div className="report-card__header">
                <span className="report-card__title">{report.title}</span>
                <span className="report-card__speaker">
                    {`${report.speaker.name} ${report.speaker.surname}`}
                </span>
            </div>

            <div className="report-card__timing">
                <TimingInfo
                    scheduledStartDateUtc={report.scheduledStartDateUtc}
                    scheduledEndDateUtc={report.scheduledEndDateUtc}
                    actualStartDateUtc={report.actualStartDateUtc}
                    actualEndDateUtc={report.actualEndDateUtc}
                    reportStatus={report.status}
                />
            </div>

            <div className={classNames(
                'report-card__questions',
                { "report-card__questions--hidden": !isStarted }
            )}>
                <Link to={reportLink} className="report-card__button">
                    <span className="report-card__button-title">Вопросы</span>
                    <span className="report-card__button-count">{questionsCount}</span>
                </Link>
            </div>
            <div className={classNames(
                'report-card__goto',
                { "report-card__goto--hidden": isStarted }
            )}>
                <Link to={reportLink} className="report-card__button">
                    <span className="report-card__button-title">Перейти</span>
                </Link>
            </div>
        </div>
    );
}