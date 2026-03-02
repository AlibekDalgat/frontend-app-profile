import React, { useState, useEffect } from 'react';
import {
  Badge,
  Button,
  Form,
  Modal,
  Spinner,
  Alert,
  OverlayTrigger,
  Tooltip,
  Pagination,
} from '@openedx/paragon';
import { injectIntl } from 'react-intl';
import { ContentCopy, InfoOutline } from '@openedx/paragon/icons';
import { QRCodeSVG } from 'qrcode.react';

import styles from './Rewards.css';
import messages from './RewardsHistory.messages';
import { fetchReferralHistory, toggleParticipateInReferral, fetchEnrolledCourses, generateReferralLink, toggleParticipateInReferralRating } from './data/api';

const getActionTypeDisplayName = (actionType, intl) => {
  const message = messages[`actionType.${actionType}`];
  return message ? intl.formatMessage(message) : actionType;
};

const getEventTypeDisplayName = (eventType, intl) => {
  const message = messages[`type.${eventType}`];
  return message ? intl.formatMessage(message) : eventType;
};

const ReferralEventAccordion = ({ event, intl }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { type, time, points, details } = event;
  const isEarned = type.startsWith('earned_');
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
        <div className="d-flex flex-column me-3 flex-grow-1">
          <div className="fw-bold event-status-text">
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

          <div className="fs-5 fw-bold"> {isOpen ? '▲' : '▼'} </div>
        </div>
      </div>

      {isOpen && (
        <div className={`px-5 py-4 border-top bg-light`}>
          {isEarned ? (
            <>
              <div className="mb-2">
                <strong>{type === 'earned_referrer'
                  ? intl.formatMessage({ id: 'rewards.refereeLabel', defaultMessage: 'Приглашённый' })
                  : intl.formatMessage({ id: 'rewards.referrerLabel', defaultMessage: 'Пригласил' })}:</strong>{' '}
                {details.referee_username || details.referrer_username || '—'}
              </div>
              <div className="mb-2">
                <strong>{intl.formatMessage(messages.actionHeader)}:</strong>{' '}
                {getActionTypeDisplayName(details.action, intl)}
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

const OrganizationAccordion = ({ organization, onParticipateToggle, onParticipateRatingToggle, onInviteClick, intl }) => {
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
    total_earned = 0,
    total_balance = 0,
    total_spent = 0,
    referrer_rewards = [],
    referee_rewards = null,
    referral_enabled = false,
    user_referral_active = false,
    participate_in_rating = false,
  } = organization;

  const loadEventsPage = async (page) => {
    setLoadingEvents(true);
    try {
      const response = await fetchReferralHistory(id, page, perPage);
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

  const handleSwitchRatingChange = async (e) => {
    const newValue = e.target.checked;
    setToggling(true);
    await onParticipateRatingToggle(id, newValue);
    setToggling(false);
  };

  let allUsers = [...referrer_rewards];
  if (referee_rewards) {
    allUsers.push({ ...referee_rewards, isInviter: true });
  }
  allUsers.sort((a, b) => (b.isInviter ? 1 : 0) - (a.isInviter ? 1 : 0));

  const headerClickHandler = (e) => {
    if (e.target.closest('label') || e.target.type === 'checkbox') {
      e.stopPropagation();
      return;
    }
    if (e.target.tagName === 'BUTTON') return;
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-5 border rounded shadow-sm overflow-hidden">
      <div
        className={`p-4 bg-light d-flex flex-column flex-md-row justify-content-between align-items-start cursor-pointer`}
        onClick={headerClickHandler}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && headerClickHandler(e)}
      >
        <div className="d-flex flex-column">
          <h3 className="mb-1 fw-bold text-break">{name}</h3>

          {referral_enabled && (
            <>
              <div className="d-flex align-items-center mb-2">
                <Form.Switch
                  id={`referral-participate-${id}`}
                  checked={user_referral_active}
                  onChange={handleSwitchChange}
                  disabled={toggling}
                  label=""
                  className="me-2 mb-0"
                />
                <div className="small">
                  <span>{intl.formatMessage(messages.participateInReferral)}</span>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-ref-${id}`}>
                        {intl.formatMessage(messages.participateInReferralTooltip)}
                      </Tooltip>
                    }
                  >
                    <InfoOutline className="ms-1 text-muted" />
                  </OverlayTrigger>
                </div>
              </div>

              {user_referral_active && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInviteClick(organization, e);
                  }}
                >
                  {intl.formatMessage(messages.inviteButton)}
                </Button>
              )}

              <div className="d-flex align-items-center mb-2 mt-2">
                <Form.Switch
                  id={`referral-rating-participate-${id}`}
                  checked={participate_in_rating}
                  onChange={handleSwitchRatingChange}
                  disabled={toggling}
                  label=""
                  className="me-2 mb-0"
                />
                <div className="small">
                  <span>{intl.formatMessage({ id: 'profile.referralParticipateInRating', defaultMessage: 'Участвовать в реферальном рейтинге' })}</span>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        {intl.formatMessage({ id: 'profile.referralRatingTooltip', defaultMessage: 'Ваш реферальный опыт будет виден в общем рейтинге' })}
                      </Tooltip>
                    }
                  >
                    <InfoOutline className="ms-1 text-muted" />
                  </OverlayTrigger>
                </div>
              </div>
            </>
          )}
        </div>

        <div className={`d-flex align-items-center fs-5 gap-4 mt-3 mt-md-0`}>
          <div className="me-3 text-center">
            <span className="d-block small text-muted">{intl.formatMessage(messages.earnedLabel)}</span>
            <strong>{total_earned}</strong>
          </div>
          <div className="mx-3 text-center">
            <span className="d-block small text-muted">{intl.formatMessage(messages.availableLabel)}</span>
            <strong className={total_balance > 0 ? 'text-success' : ''}>{total_balance}</strong>
          </div>
          <div className="mx-3 text-center">
            <span className="d-block small text-muted">{intl.formatMessage(messages.spentLabel)}</span>
            <strong>{total_spent}</strong>
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
                <ReferralEventAccordion
                  key={index}
                  event={event}
                  intl={intl}
                />
              ))}

              {totalEvents > perPage && (
                <div className="p-4 d-flex justify-content-center">
                  <Pagination
                    paginationLabel="реферальная история"
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
            <div className="p-4 text-muted">
              {intl.formatMessage(messages.noEvents || { defaultMessage: 'Нет событий в истории' })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CourseSelect = ({ value, onChange, courses, loading, intl }) => {
  if (loading) {
    return (
      <div className="d-flex align-items-center">
        <Spinner animation="border" size="sm" />
        <span className="ms-2 small">{intl.formatMessage(messages.loadingCourses)}</span>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <Alert variant="info" className="small mb-0">
        {intl.formatMessage(messages.noEnrolledCourses)}
      </Alert>
    );
  }

  return (
    <Form.Control
      as="select"
      value={value || ''}
      onChange={onChange}
      aria-label="Выберите курс для реферальной ссылки"
    >
      <option value="">{intl.formatMessage(messages.generalLinkOption)}</option>
      {courses.map((course) => (
        <option key={course.id} value={course.id}>
          {course.display_name} {course.number ? `(${course.number})` : ''}
        </option>
      ))}
    </Form.Control>
  );
};

const InviteModalContent = ({
  referralLink,
  referralCode,
  selectedCourseId,
  onCourseSelect,
  enrolledCourses,
  coursesLoading,
  intl,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = (text) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 3000);
        })
        .catch((err) => {
          console.error('Ошибка копирования:', err);
          alert('Не удалось скопировать. Попробуйте выделить текст вручную.');
        });
    } else {
      alert(`Скопируйте вручную:\n\n${text}`);
    }
  };

  const renderMainContent = () => {
    if (!referralLink) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3">{intl.formatMessage(messages.generatingLink)}</p>
        </div>
      );
    }

    return (
      <div className="text-center">
        <div className="mb-4 d-flex justify-content-center">
          <QRCodeSVG value={referralLink} size={256} />
        </div>

        <div className="mb-3">
          <strong>{intl.formatMessage(messages.provideQrOrLink)}</strong>{' '}
          <div
            className="pgn__form-control-decorator-group font-monospace text-break p-2 rounded border-0"
            style={{ backgroundColor: 'transparent' }}
          >
            <Form.Control
              as="textarea"
              readOnly
              rows={1}
              value={referralLink}
              className="font-monospace text-break"
              style={{
                resize: 'none',
                minHeight: 'auto',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                padding: '0.375rem 0.75rem',
              }}
              onClick={(e) => e.target.select()}
            />
          </div>
          <Button
            variant="outline-secondary"
            size="sm"
            className="ms-2 align-top"
            onClick={() => copyToClipboard(referralLink)}
          >
            <ContentCopy /> {intl.formatMessage(messages.copyButton)}
          </Button>

          {copySuccess && (
            <div className="mt-2 text-success small fw-bold">
              {intl.formatMessage(messages.copySuccess)}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderMainContent()}

      <hr className="my-4" />

      <Form.Group className="mb-3">
        <Form.Label>{intl.formatMessage(messages.destinationLabel)}</Form.Label>
        <CourseSelect
          value={selectedCourseId}
          onChange={onCourseSelect}
          courses={enrolledCourses}
          loading={coursesLoading}
          intl={intl}
        />
      </Form.Group>
    </div>
  );
};

const ReferralRewardsTab = ({ intl }) => {
  const [data, setData] = useState({ organizations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [referralLink, setReferralLink] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  const handleParticipateToggle = async (orgId, newValue) => {
    try {
      await toggleParticipateInReferral(orgId, newValue);
      await fetchReferralHistoryLocal();
    } catch (err) {
      console.error(intl.formatMessage(messages.errorToggleReferral), err);
      alert(intl.formatMessage(messages.errorSaveSetting));
    }
  };

  const handleParticipateRatingToggle = async (orgId, newValue) => {
    try {
      await toggleParticipateInReferralRating(orgId, newValue);
      setData(prev => ({
        ...prev,
        organizations: prev.organizations.map(org =>
          org.id === orgId ? { ...org, participate_in_rating: newValue } : org
        )
      }));
    } catch (err) {
      console.error(intl.formatMessage(messages.errorToggleReferralRating), err);
      alert(intl.formatMessage(messages.errorSaveSetting));
    }
  };

  const fetchReferralHistoryLocal = async () => {
    try {
      const response = await fetchReferralHistory();
      setData(response.data || { organizations: [] });
    } catch (err) {
      setError(intl.formatMessage(messages.errorLoadReferralHistory));
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCoursesLocal = async () => {
    setCoursesLoading(true);
    try {
      const response = await fetchEnrolledCourses();
      setEnrolledCourses(response.data.courses || []);
    } catch (err) {
      console.error('Ошибка загрузки курсов:', err);
    } finally {
      setCoursesLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralHistoryLocal();
  }, []);

  const handleInviteClick = (org, e) => {
    e.stopPropagation();
    e.preventDefault();

    setSelectedOrg(org);
    setReferralLink('');
    setReferralCode('');
    setSelectedCourseId(null);
    setIsInviteModalOpen(true);
    fetchEnrolledCoursesLocal();
  };

  const generateGeneralLink = async () => {
    try {
      const response = await generateReferralLink(selectedOrg.id);
      setReferralLink(response.data.referral_link);
      setReferralCode(response.data.referral_code);
    } catch (err) {
      alert(intl.formatMessage(messages.errorGenerateGeneralLink));
    }
  };

  const generateCourseLink = async (courseId) => {
    try {
      const response = await generateReferralLink(selectedOrg.id, courseId);
      setReferralLink(response.data.referral_link);
      setReferralCode(response.data.referral_code);
    } catch (err) {
      alert(intl.formatMessage(messages.errorGenerateCourseLink));
    }
  };

  const handleCourseSelect = (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);

    if (courseId) {
      generateCourseLink(courseId);
    } else {
      generateGeneralLink();
    }
  };

  useEffect(() => {
    if (isInviteModalOpen && selectedOrg && !referralLink && !selectedCourseId) {
      generateGeneralLink();
    }
  }, [isInviteModalOpen, selectedOrg, referralLink, selectedCourseId]);

  const closeModal = () => {
    setIsInviteModalOpen(false);
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!data.organizations?.length) {
    return <Alert variant="info">{intl.formatMessage(messages.noReferralRecords)}</Alert>;
  }

  return (
    <>
      {data.organizations.map((org) => (
        <OrganizationAccordion
          key={org.id}
          organization={org}
          onParticipateToggle={handleParticipateToggle}
          onParticipateRatingToggle={handleParticipateRatingToggle}
          onInviteClick={handleInviteClick}
          intl={intl}
        />
      ))}

      <Modal
        open={isInviteModalOpen}
        onClose={closeModal}
        title={`${intl.formatMessage(messages.inviteModalTitlePrefix)} ${selectedOrg?.name || ''}`}
        closeText={intl.formatMessage(messages.modalCloseText)}
        body={
          <InviteModalContent
            referralLink={referralLink}
            referralCode={referralCode}
            selectedCourseId={selectedCourseId}
            onCourseSelect={handleCourseSelect}
            enrolledCourses={enrolledCourses}
            coursesLoading={coursesLoading}
            intl={intl}
          />
        }
        dialogClassName="modal-lg"
      />
    </>
  );
};

export default injectIntl(ReferralRewardsTab);
