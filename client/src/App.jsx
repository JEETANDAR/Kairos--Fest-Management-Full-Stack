import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Loading from './pages/Loading/Loading';
import Scoreboard from './pages/Scoreboard';
import Success from './pages/Success';
import PrivateAccount from './pages/PrivacyPolicy/PrivateAccount';

const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const FailurePage = lazy(() => import('./pages/FailurePage'));
const CoordinatorDashboard = lazy(() => import('./pages/CoordinatorsPages/CoordinatorDashboard'));
const ParticipantDashboard = lazy(() => import('./pages/ParticipantsPages/ParticipantDashboard'));
const FacultyDashboard = lazy(() => import('./pages/FacultyPages/FacultyDashboard'));

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/dashboard' element={<ParticipantDashboard />} />
        <Route path='/coordinator' element={<CoordinatorDashboard />} />
        <Route path='/faculty' element={<FacultyDashboard />} />
        <Route path='/scoreboard' element={<Scoreboard />} />
        <Route path='/success' element={<Success />} />
        <Route path='/PrivacyPolicy' element={<PrivateAccount />} />

        <Route path='/failure' element={<FailurePage />} />
      </Routes>
    </Suspense>
  );
};

export default App;