import { BrowserRouter, Route, Routes } from 'react-router-dom';
import type { ReactElement } from 'react';

import { AppRoute } from '../../enums/app-route.ts';
import { Conferences } from '../../pages/conferences/conferences.tsx';
import { Conference } from '../../pages/questions/conference.tsx';

export function App(): ReactElement {

  return (
      <BrowserRouter>
        <Routes>
            <Route path={AppRoute.Conferences} element={<Conferences />} />
            <Route path={AppRoute.Conference} element={<Conference /> } />
        </Routes>
      </BrowserRouter>
  )
}
