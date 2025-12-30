import type { ReactElement } from 'react';

import { formatTimeWithOffset } from '../../utils/utils.ts';
import type { ReportData } from '../../types/report-data.ts';
import type { IsoString } from '../../types/iso-string.ts';
import type { ReportStatus } from '../../enums/report-status.ts';

import './report-info.css';

type ConferenceInfoProps = {
    report: ReportData;
    questionsCount?: number;
}

function TimingInfo({ scheduledStartDate, scheduledEndDate, reportStatus }: {
    scheduledStartDate: IsoString;
    scheduledEndDate: IsoString;
    reportStatus: ReportStatus;
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
                <td className="report-info__timing-value">{reportStatus}</td>
            </tr>
            </tbody>
        </table>
    );
}

export function ReportInfo({ report, questionsCount = 0 }: ConferenceInfoProps): ReactElement {
    return (
        <div className="report-info">
            <div className="report-info__header">
                <span className="report-info__title">{report.title}</span>
                <span className="report-info__speaker">
                    {`${report.speakerInfo.name} ${report.speakerInfo.surname}`}
                </span>
            </div>

            <div className="report-info__timing">
                <TimingInfo
                    scheduledStartDate={report.scheduledStartDate}
                    scheduledEndDate={report.scheduledEndDate}
                    reportStatus={report.status}
                />
            </div>

            <a className="report-info__questions">
                <span className="report-info__questions-title">Вопросы</span>
                <span className="report-info__questions-count">{questionsCount}</span>
            </a>
        </div>
    );
}