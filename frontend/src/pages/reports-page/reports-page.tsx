import type { ReactElement } from 'react';

import { Layout } from '../../components/layout/layout.tsx';
import type { ReportData } from '../../types/report-data.ts';
import { ReportInfo } from '../../components/report-info/report-info.tsx';

type ConferencesPageProps = {
    reports: ReportData[];
}

export function ReportsPage({ reports }: ConferencesPageProps): ReactElement {
    return (
        <Layout>
            {reports.map((r) => <ReportInfo report={r}/>)}
        </Layout>
    );
}
