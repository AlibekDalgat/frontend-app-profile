import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR,
  APP_READY,
  initialize,
  mergeConfig,
  subscribe,
  getConfig,
} from '@edx/frontend-platform';
import {
  AppProvider,
  ErrorPage,
} from '@edx/frontend-platform/react';

import React, { StrictMode } from 'react';
// eslint-disable-next-line import/no-unresolved
import { createRoot } from 'react-dom/client';

import { ProfileHeader } from './components/ProfileHeader';
import CustomFooter from './components/CustomFooter';

import messages from './i18n';
import configureStore from './data/configureStore';

import './index.scss';
import Head from './head/Head';

import AppRoutes from './routes/AppRoutes';

const applyWidgetTheme = () => {
  const config = getConfig();
  const root = document.documentElement;

  root.style.setProperty('--primary', '#2F2F60');
  root.style.setProperty('--primary-light', '#EDE8F5');

  if (!config.WIDGET_MODE) {
    return;
  }

  root.style.setProperty('--primary', config.WIDGET_BRAND_PRIMARY);
  root.style.setProperty('--primary-light', config.WIDGET_BRAND_PRIMARY_LIGHT);

  if (config.WIDGET_MODE && config.WIDGET_LOGO_URL) {
    document.body.setAttribute('data-widget-mode', 'true');
    document.documentElement.style.setProperty('--widget-logo-url', `url(${config.WIDGET_LOGO_URL})`);
  } else {
    document.body.removeAttribute('data-widget-mode');
  }
};

const rootNode = createRoot(document.getElementById('root'));
subscribe(APP_READY, () => {
  applyWidgetTheme();
  rootNode.render(
    <StrictMode>
      <AppProvider store={configureStore()}>
        <div className="app-header-fixed">
          <ProfileHeader />
        </div>
        <main id="main">
          <AppRoutes />
        </main>
        <div className="app-footer">
          <CustomFooter />
        </div>
      </AppProvider>
    </StrictMode>,
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  rootNode.render(<ErrorPage message={error.message} />);
});

initialize({
  messages,
  hydrateAuthenticatedUser: true,
  handlers: {
    config: () => {
      mergeConfig({
        COLLECT_YEAR_OF_BIRTH: process.env.COLLECT_YEAR_OF_BIRTH,
        ENABLE_SKILLS_BUILDER_PROFILE: process.env.ENABLE_SKILLS_BUILDER_PROFILE,
      }, 'App loadConfig override handler');
    },
  },
});
