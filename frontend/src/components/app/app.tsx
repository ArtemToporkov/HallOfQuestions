import { BrowserRouter, Route, Routes } from 'react-router-dom';
import type { ReactElement } from 'react';

import { AppRoute } from '../../enums/app-route.ts';
import { ReportsPage } from '../../pages/reports-page/reports-page.tsx';
import { ReportPage } from '../../pages/report-page/report-page.tsx';
import { REPORTS } from '../../mocks/reports.ts';

export function App(): ReactElement {

  return (
      <BrowserRouter>
        <Routes>
            <Route path={AppRoute.Reports} element={<ReportsPage reports={REPORTS} />} />
            <Route path={AppRoute.Reports} element={<ReportsPage reports={REPORTS} />} />
            <Route path={AppRoute.Report} element={<ReportPage /> } />
        </Routes>
      </BrowserRouter>
  )
}
