import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Spinner, Alert } from '@openedx/paragon';
import { injectIntl } from 'react-intl';

import RewardsTab from './RewardsTab';
import ReferralRewardsTab from './ReferralRewardsTab';
import messages from './RewardsHistory.messages';

const MyRewardsPage = ({ intl }) => {
  const [activeTab, setActiveTab] = useState('learning');

  return (
    <Container size="lg" className="py-5">
      <h2 className="mb-5">{intl.formatMessage(messages.pageTitle)}</h2>

      <Tabs
        id="my-rewards-tabs"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        variant="tabs"
        style={{ marginBottom: 10 }}
      >
        <Tab eventKey="learning" title={intl.formatMessage(messages.learningTabTitle)}>
          <RewardsTab />
        </Tab>

        <Tab eventKey="referral" title={intl.formatMessage(messages.referralTabTitle)}>
          <ReferralRewardsTab />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default injectIntl(MyRewardsPage);