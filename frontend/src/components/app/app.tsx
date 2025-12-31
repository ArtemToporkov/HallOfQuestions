import { BrowserRouter, Route, Routes } from 'react-router-dom';
import type { ReactElement } from 'react';

import { AppRoute } from '../../enums/app-route.ts';
import { ReportsPage } from '../../pages/reports-page/reports-page.tsx';
import { ReportPage } from '../../pages/report-page/report-page.tsx';
import { MainPage } from '../../pages/main-page/main-page.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function App(): ReactElement {
  return (
      <QueryClientProvider client={queryClient}>
          <BrowserRouter>
              <Routes>
                  <Route path={AppRoute.Main} element={<MainPage />} />
                  <Route path={AppRoute.Reports} element={<ReportsPage />} />
                  <Route path={AppRoute.Report} element={<ReportPage /> } />
              </Routes>
          </BrowserRouter>
      </QueryClientProvider>
  )
}
