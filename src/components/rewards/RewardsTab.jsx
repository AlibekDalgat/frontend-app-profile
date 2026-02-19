import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert, Badge, Form, OverlayTrigger, Tooltip } from '@openedx/paragon';
import { injectIntl } from 'react-intl';
import { InfoOutline } from '@openedx/paragon/icons';

import messages from './RewardsHistory.messages';
import mobileStyles from './RewardsHistory.mobile.module.css';
import { fetchRewardsHistory, toggleParticipateInRating } from './data/api';

const getBlockTypeDisplayName = (blockType, intl) => {
  const message = messages[`blockType.${blockType}`];
  return message ? intl.formatMessage(message) : blockType;
};

const RewardsTab = ({ intl }) => {
  const [data, setData] = useState({ organizations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      const response = await fetchRewardsHistory();
      setData(response.data || { organizations: [] });
    } catch (err) {
      console.error(err);
      setError(intl.formatMessage(messages.errorLoadHistory));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleParticipateToggle = async (orgId, newValue) => {
    try {
      await toggleParticipateInRating(orgId, newValue);
      await fetchHistory();
    } catch (err) {
      console.error(intl.formatMessage(messages.errorToggleParticipate), err);
      alert(intl.formatMessage(messages.errorSaveSetting));
    }
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!data.organizations?.length) {
    return <Alert variant="info">{intl.formatMessage(messages.noHistoryRecords)}</Alert>;
  }

  return (
    <>
      {data.organizations.map((org) => (
        <OrganizationAccordion
          key={org.id}
          organization={org}
          onParticipateToggle={handleParticipateToggle}
          intl={intl}
        />
      ))}
    </>
  );
};

const OrganizationAccordion = ({ organization, onParticipateToggle, intl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toggling, setToggling] = useState(false);

  const {
    id,
    name,
    currency_full_name,
    total_earned,
    total_balance,
    total_spent,
    courses,
    participate_in_rating = false,
    rating_enabled = false,
  } = organization;

  const handleSwitchChange = async (e) => {
    const newValue = e.target.checked;
    setToggling(true);
    await onParticipateToggle(id, newValue);
    setToggling(false);
  };

  const headerClickHandler = (e) => {
    if (e.target.closest('label') || e.target.type === 'checkbox') {
      e.stopPropagation();
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-5 border rounded shadow-sm overflow-hidden">
      <div
        className={`p-4 bg-light d-flex justify-content-between align-items-start cursor-pointer ${mobileStyles.orgHeader}`}
        onClick={headerClickHandler}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            headerClickHandler(e);
          }
        }}
      >
        <div className="d-flex flex-column">
          <h3 className="mb-1 fw-bold">{currency_full_name || intl.formatMessage(messages.fallbackCurrency)}</h3>
          <div className="text-muted mb-2">{name || intl.formatMessage(messages.fallbackOrganization)}</div>

          {rating_enabled && (
            <div className="d-flex align-items-center">
              <Form.Switch
                id={`participate-${id}`}
                checked={participate_in_rating}
                onChange={handleSwitchChange}
                disabled={toggling}
                label=""
                className="me-2 mb-0"
              />
              <div className="small">
                <span>{intl.formatMessage(messages.participateInRating)}</span>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-${id}`}>
                      {intl.formatMessage(messages.participateInRatingTooltip)}
                    </Tooltip>
                  }
                >
                  <InfoOutline className="ms-1 text-muted" />
                </OverlayTrigger>
              </div>
            </div>
          )}
        </div>

        <div className={`d-flex align-items-center fs-5 gap-4 ms-auto ${mobileStyles.sums}`}>
          <div className="me-3 text-center">
            <span className="d-block small text-muted">{intl.formatMessage(messages.earnedLabel)}</span>
            <strong>{total_earned ?? 0}</strong>
          </div>
          <div className="mx-3 text-center">
            <span className="d-block small text-muted">{intl.formatMessage(messages.availableLabel)}</span>
            <strong className={total_balance > 0 ? 'text-success' : ''}>{total_balance ?? 0}</strong>
          </div>
          <div className="mx-3 text-center">
            <span className="d-block small text-muted">{intl.formatMessage(messages.spentLabel)}</span>
            <strong>{total_spent ?? 0}</strong>
          </div>

          <div className="ms-4 fs-4 fw-bold">{isOpen ? '▲' : '▼'}</div>
        </div>
      </div>

      {isOpen && (
        <div className="border-top">
          {courses?.length ? (
            courses.map((course) => (
              <CourseAccordion key={course.id} course={course} intl={intl} />
            ))
          ) : (
            <div className="p-4 text-muted">{intl.formatMessage(messages.noCoursesWithRewards)}</div>
          )}
        </div>
      )}
    </div>
  );
};

const CourseAccordion = ({ course, intl }) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    display_name = intl.formatMessage(messages.fallbackCourseName),
    number = '',
    total_earned = 0,
    total_spent = 0,
    total_balance = 0,
    blocks = [],
  } = course;

  return (
    <>
      <div
        className={`d-flex justify-content-between align-items-center px-4 py-3 bg-white cursor-pointer border-top ${mobileStyles.courseHeader}`}
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsOpen(!isOpen)}
      >
        <div className={`d-flex align-items-center ${mobileStyles.courseTitle}`}>
          <div className="fw-bold fs-5">{display_name}</div>
          {number && (
            <>
              <span className="mx-1">&nbsp;</span>
              <Badge bg="secondary" className={mobileStyles.courseBadge}>
                {number}
              </Badge>
            </>
          )}
        </div>

        <div className={`d-flex align-items-center text-nowrap ${mobileStyles.courseSums}`}>
          <div className="me-3">
            <span className="d-block small text-muted">{intl.formatMessage(messages.earnedLabel)}</span>
            <strong>{total_earned}</strong>
          </div>
          <div className="mx-3">
            <span className="d-block small text-muted">{intl.formatMessage(messages.availableLabel)}</span>
            <strong className={total_balance > 0 ? 'text-success' : ''}>
              {total_balance}
            </strong>
          </div>
          <div className="mx-3">
            <span className="d-block small text-muted">{intl.formatMessage(messages.spentLabel)}</span>
            <strong>{total_spent}</strong>
          </div>
          <div className="ms-3 fs-4 fw-bold">{isOpen ? '▲' : '▼'}</div>
        </div>
      </div>

      {isOpen && (
        <div className={`px-5 py-4 border-top ${mobileStyles.blocksContent}`}>
          {blocks.length === 0 ? (
            <div className="text-muted py-2">{intl.formatMessage(messages.noBlockRewards)}</div>
          ) : (
            <div className="table-responsive">
              <table className={`table table-sm table-hover mb-0 ${mobileStyles.blocksTable}`}>
                <thead className="table-light">
                  <tr>
                    <th>{intl.formatMessage(messages.blockNameHeader)}</th>
                    <th>{intl.formatMessage(messages.blockTypeHeader)}</th>
                    <th className="text-end">{intl.formatMessage(messages.rewardsHeader)}</th>
                    <th>{intl.formatMessage(messages.statusHeader)}</th>
                    <th>{intl.formatMessage(messages.earnedDateHeader)}</th>
                  </tr>
                </thead>
                <tbody>
                  {blocks.map((block) => (
                    <tr key={block.block_id}>
                      <td className="fw-medium">
                        {block.block_type === 'unknown'
                          ? intl.formatMessage(messages.deletedOrUnavailableBlockName)
                          : (block.block_name?.trim() || '—')}
                      </td>
                      <td>{getBlockTypeDisplayName(block.block_type, intl)}</td>
                      <td className="text-end">{block.points}</td>
                      <td>
                        {block.spent ? (
                          <span className="text-danger">
                            {intl.formatMessage(messages.statusSpent)} {block.spent_at ? `(${new Date(block.spent_at).toLocaleString('ru-RU')})` : ''}
                          </span>
                        ) : (
                          <span className="text-success fw-bold">{intl.formatMessage(messages.statusAvailable)}</span>
                        )}
                      </td>
                      <td>
                        {new Date(block.earned_at).toLocaleString('ru-RU', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default injectIntl(RewardsTab);