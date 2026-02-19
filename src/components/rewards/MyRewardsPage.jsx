import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert, Nav } from '@openedx/paragon';
import { injectIntl } from 'react-intl';

import RewardsTab from './RewardsTab';
import ReferralRewardsTab from './ReferralRewardsTab';
import messages from './RewardsHistory.messages';

const MyRewardsPage = ({ intl }) => {
  const [activeTab, setActiveTab] = useState('learning');

  return (
    <Container size="lg" className="py-5">
      <h2 className="mb-5">{intl.formatMessage(messages.pageTitle)}</h2>

      <Nav
        variant="pills"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Nav.Item>
          <Nav.Link eventKey="learning">
            {intl.formatMessage(messages.learningTabTitle)}
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link eventKey="referral">
            {intl.formatMessage(messages.referralTabTitle)}
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <div>
        {activeTab === 'learning' && <RewardsTab />}
        {activeTab === 'referral' && <ReferralRewardsTab />}
      </div>
    </Container>
  );
};

export default injectIntl(MyRewardsPage);