import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import type { ReactElement } from 'react';

import { AppRoute } from '../../enums/app-route.ts';
import { ReportsPage } from '../../pages/reports-page/reports-page.tsx';
import { ReportPage } from '../../pages/report-page/report-page.tsx';
import { MainPage } from '../../pages/main-page/main-page.tsx';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        },
    },
});

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
          <ToastContainer />
      </QueryClientProvider>
  )
}
