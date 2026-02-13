import React from 'react';
import {
  AuthenticatedPageRoute,
  PageWrap,
} from '@edx/frontend-platform/react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ProfilePage, NotFoundPage } from '../profile';
import MyRewardsPage from '../components/rewards/MyRewardsPage';
import RatingsPage from '../components/RatingsPage';

const AppRoutes = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/u/:username" element={<AuthenticatedPageRoute><ProfilePage navigate={navigate} /></AuthenticatedPageRoute>} />
      <Route
        path="/rewards"
        element={
          <AuthenticatedPageRoute>
            <PageWrap>
              <MyRewardsPage />
            </PageWrap>
          </AuthenticatedPageRoute>
        }
      />
      <Route
        path="/ratings"
        element={
          <AuthenticatedPageRoute>
            <PageWrap>
              <RatingsPage />
            </PageWrap>
          </AuthenticatedPageRoute>
        }
      />
      <Route path="/notfound" element={<PageWrap><NotFoundPage /></PageWrap>} />
      <Route path="*" element={<PageWrap><NotFoundPage /></PageWrap>} />
    </Routes>
  );
};

export default AppRoutes;
