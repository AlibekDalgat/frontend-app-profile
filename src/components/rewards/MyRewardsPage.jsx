import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Spinner, Alert } from '@openedx/paragon';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import RewardsTab from './RewardsTab';
import ReferralRewardsTab from './ReferralRewardsTab';

const MyRewardsPage = () => {
  const [activeTab, setActiveTab] = useState('learning');

  return (
    <Container size="lg" className="py-5">
      <h2 className="mb-5">Мои награды</h2>

      <Tabs
        id="my-rewards-tabs"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        variant="tabs"
        style={{ marginBottom: 10 }}
      >
        <Tab eventKey="learning" title="Награды за обучение">
          <RewardsTab />
        </Tab>

        <Tab eventKey="referral" title="Реферальные награды">
          <ReferralRewardsTab />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default MyRewardsPage;