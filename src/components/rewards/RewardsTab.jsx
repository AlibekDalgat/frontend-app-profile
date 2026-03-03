import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert, Badge, Form, OverlayTrigger, Tooltip, Pagination } from '@openedx/paragon';
import { injectIntl } from 'react-intl';
import { InfoOutline } from '@openedx/paragon/icons';

import styles from './Rewards.css';
import messages from './RewardsHistory.messages';
import { fetchRewardsHistory, toggleParticipateInRating } from './data/api';

const getBlockTypeDisplayName = (blockType, intl) => {
  const message = messages[`blockType.${blockType}`];
  return message ? intl.formatMessage(message) : blockType;
};

const getEventTypeDisplayName = (eventType, intl) => {
  const message = messages[`type.${eventType}`];
  return message ? intl.formatMessage(message) : eventType;
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
  const [events, setEvents] = useState(organization.events || []);
  const [currentPage, setCurrentPage] = useState(organization.page || 1);
  const [totalEvents, setTotalEvents] = useState(organization.total_events || 0);
  const [perPage] = useState(organization.per_page || 20);
  const [loadingEvents, setLoadingEvents] = useState(false);

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

  const loadEventsPage = async (page) => {
    setLoadingEvents(true);
    try {
      const response = await fetchRewardsHistory(id, page, perPage);
      const updatedOrg = response.data.organizations.find(o => o.id === id);
      if (updatedOrg) {
        setEvents(updatedOrg.events || []);
        setCurrentPage(updatedOrg.page || page);
        setTotalEvents(updatedOrg.total_events || 0);
      }
    } catch (err) {
      console.error('Ошибка загрузки страницы событий:', err);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    if (isOpen && events.length === 0 && totalEvents > 0) {
      loadEventsPage(1);
    }
  }, [isOpen]);

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
        className={`p-4 bg-light d-flex flex-column flex-md-row justify-content-between align-items-start cursor-pointer`}
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
          <h3 className="mb-1 fw-bold text-break">{currency_full_name || intl.formatMessage(messages.fallbackCurrency)}</h3>
          <div className="text-muted mb-2 text-break">{name || intl.formatMessage(messages.fallbackOrganization)}</div>

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

        <div className={`d-flex align-items-center fs-5 gap-4 mt-3 mt-md-0`}>
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
          {loadingEvents ? (
            <div className="p-4 text-center">
              <Spinner animation="border" size="sm" />
            </div>
          ) : events.length > 0 ? (
            <>
              {events.map((event, index) => (
                <EventAccordion
                  key={index}
                  event={event}
                  intl={intl}
                />
              ))}

              {totalEvents > perPage && (
                <div className="p-4 d-flex justify-content-center">
                  <Pagination
                    paginationLabel="история наград"
                    pageCount={Math.ceil(totalEvents / perPage)}
                    currentPage={currentPage}
                    onPageSelect={(newPage) => {
                      setCurrentPage(newPage);
                      loadEventsPage(newPage);
                    }}
                    variant="canonical"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="p-4 text-muted">{intl.formatMessage(messages.noEvents)}</div>
          )}
        </div>
      )}
    </div>
  );
};

const EventAccordion = ({ event, intl }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { type, time, points, details } = event;
  const isEarned = type === 'earned';
  const sign = isEarned ? '+' : '-';
  const colorClass = isEarned ? 'text-success' : 'text-danger';

  return (
    <>
      <div
        className="d-flex justify-content-between align-items-start px-3 py-3 bg-white cursor-pointer border-top flex-wrap flex-md-nowrap"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsOpen(!isOpen)}
      >
        <div className="d-flex flex-column me-md-4 flex-grow-1">
          <div className="fw-bold fs-5">
            {getEventTypeDisplayName(type, intl)}
          </div>
          <div className="text-muted small mt-1">
            {new Date(time).toLocaleString('ru-RU', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </div>
        </div>

        <div className="d-flex align-items-center flex-shrink-0">
          <div
            className={`fw-bold ${colorClass} text-end me-3`}
            style={{ minWidth: '70px' }}
          >
            {sign}{Math.abs(points)}
          </div>

          <div className="fs-4 fw-bold"> {isOpen ? '▲' : '▼'} </div>
        </div>
      </div>

      {isOpen && (
        <div className={`px-5 py-4 border-top bg-light`}>
          {isEarned ? (
            <>
              <div className="mb-2">
                <strong>{intl.formatMessage(messages.courseLabel || { defaultMessage: 'Курс' })}:</strong>{' '}
                {details.course_name}
              </div>
              <div className="mb-2">
                <strong>{intl.formatMessage(messages.blockNameHeader)}:</strong>{' '}
                {details.block_name === "Deleted or unavailable content"
                  ? intl.formatMessage(messages.deletedOrUnavailableBlockName)
                  : (details.block_name || '—')}
              </div>
              <div>
                <strong>{intl.formatMessage(messages.blockTypeHeader)}:</strong>{' '}
                {getBlockTypeDisplayName(details.block_type, intl)}
              </div>
            </>
          ) : (
            <div>
              <strong>{intl.formatMessage({ id: 'rewards.descriptionLabel', defaultMessage: 'Описание' })}:</strong>{' '}
              {details.description || intl.formatMessage({ id: 'rewards.noDescription', defaultMessage: 'Нет описания' })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default injectIntl(RewardsTab);