import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert, Tabs, Tab } from '@openedx/paragon';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import ratingStyles from './RatingsPage.css';
import messages from './messages';

const RatingsPage = () => {
  const [activeTab, setActiveTab] = useState('learning');
  const [learningRatings, setLearningRatings] = useState([]);
  const [referralRatings, setReferralRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRatings = async (url, setter) => {
    try {
      const res = await getAuthenticatedHttpClient().get(url);
      setter(res.data.ratings || []);
    } catch (err) {
      console.error(err);
      setError(messages.errorLoading.defaultMessage);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchRatings(`${getConfig().LMS_BASE_URL}/api/rewards/v0/ratings/`, setLearningRatings),
      fetchRatings(`${getConfig().LMS_BASE_URL}/api/rewards/v0/referral-ratings/`, setReferralRatings),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container size="lg" className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const hasLearning = learningRatings.length > 0;
  const hasReferral = referralRatings.length > 0;

  if (!hasLearning && !hasReferral) {
    return (
      <Container size="lg" className="py-5">
        <Alert variant="info">{messages.noRatings.defaultMessage}</Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" className="py-5">
      <h2 className="mb-5">{messages.pageTitle.defaultMessage}</h2>

      <Tabs
        id="ratings-tabs"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
        style={{ marginBottom: 10 }}
        variant="tabs"
      >
        <Tab eventKey="learning" title="Рейтинги по обучению" disabled={!hasLearning}>
          {hasLearning ? (
            learningRatings.map((org) => (
              <RatingAccordion key={org.organization_id} org={org} type="learning" />
            ))
          ) : (
            <Alert variant="info" className="mt-4">
              Нет рейтингов по обучению
            </Alert>
          )}
        </Tab>

        <Tab eventKey="referral" title="Реферальные рейтинги" disabled={!hasReferral}>
          {hasReferral ? (
            referralRatings.map((org) => (
              <RatingAccordion key={org.organization_id} org={org} type="referral" />
            ))
          ) : (
            <Alert variant="info" className="mt-4">
              Нет реферальных рейтингов
            </Alert>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

const RatingAccordion = ({ org, type }) => {
  const [isOpen, setIsOpen] = useState(false);

  const userRank = org.user_position || 0;
  const userInTop = userRank > 0 && userRank <= org.top_limit;

  return (
    <div className="mb-5 border rounded shadow-sm overflow-hidden">
      <div
        className="p-4 bg-light d-flex justify-content-between align-items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsOpen(!isOpen)}
      >
        <div>
          <h3 className="mb-1 fw-bold">{org.currency || 'Валюта'}</h3>
          <div className="text-muted">{org.organization_name || 'Организация'}</div>
          <div className="small text-muted">
            {messages.topParticipants.defaultMessage.replace('{topLimit}', org.top_limit)}
          </div>
        </div>
        <div className="fs-4 fw-bold">{isOpen ? '▲' : '▼'}</div>
      </div>

      {isOpen && (
        <div className="border-top">
          <div className="table-responsive">
            <table className="table table-sm table-hover mb-0 rating-table">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '80px' }} className="text-center">Место</th>
                  <th>Участник</th>
                  <th className="text-end">{messages.experienceColumn.defaultMessage}</th>
                </tr>
              </thead>
              <tbody>
                {org.top && org.top.length > 0 ? (
                  org.top.map((entry) => (
                    <tr
                      key={entry.rank}
                      className={userRank === entry.rank ? 'table-primary' : ''}
                    >
                      <td className="text-center fw-bold">{entry.rank}</td>
                      <td>
                        {entry.username}
                        {entry.tied_total > 1 && (
                          <small className="text-muted mx-1">
                            и ещё {entry.tied_total - 1}
                          </small>
                        )}
                      </td>
                      <td className="text-end">{entry.experience}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-4">
                      {messages.topEmpty.defaultMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {org.user_participates ? (
            userInTop ? (
              null
            ) : (
              <div className="p-4 bg-light border-top text-center">
                <div className="mb-2 text-muted fw-medium">
                  {messages.participatesButNotInTop.defaultMessage.replace('{topLimit}', org.top_limit)}
                </div>
                <div className="small text-muted">
                  {messages.needMoreExperience.defaultMessage}
                </div>
              </div>
            )
          ) : (
            <div className="p-4 bg-light border-top text-center text-muted">
              {messages.notParticipates.defaultMessage}
              <br />
              <small>{messages.enableInHistory.defaultMessage}</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RatingsPage;