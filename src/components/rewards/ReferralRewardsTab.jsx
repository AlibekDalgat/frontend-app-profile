import React, { useState, useEffect } from 'react';
import {
  Badge,
  Button,
  Form,
  Modal,
  Spinner,
  Alert,
  OverlayTrigger,
  Tooltip
} from '@openedx/paragon';
import { injectIntl } from 'react-intl';
import { ContentCopy, InfoOutline } from '@openedx/paragon/icons';
import { QRCodeSVG } from 'qrcode.react';

import mobileStyles from './RewardsHistory.mobile.module.css';
import messages from './RewardsHistory.messages';
import { fetchReferralHistory, toggleParticipateInReferral, fetchEnrolledCourses, generateReferralLink } from './data/api';

const UserAccordion = ({ userRef, intl }) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    username = intl.formatMessage(messages.fallbackUsername),
    total_earned = 0,
    total_spent = 0,
    total_balance = 0,
    actions = [],
    isInviter = false,
  } = userRef;

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
          <div className="fw-bold fs-5">
            {username}
            {isInviter && <Badge bg="primary" className="mx-1">{intl.formatMessage(messages.inviterBadge)}</Badge>}
          </div>
        </div>

        <div className={`d-flex align-items-center text-nowrap ${mobileStyles.courseSums}`}>
          <div className="me-3">
            <span className="d-block small text-muted">{intl.formatMessage(messages.earnedLabel)}</span>
            <strong>{total_earned}</strong>
          </div>
          <div className="mx-3">
            <span className="d-block small text-muted">{intl.formatMessage(messages.availableLabel)}</span>
            <strong className={total_balance > 0 ? 'text-success' : ''}>{total_balance}</strong>
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
          {actions.length === 0 ? (
            <div className="text-muted py-2">{intl.formatMessage(messages.noActions)}</div>
          ) : (
            <div className="table-responsive">
              <table className={`table table-sm table-hover mb-0 ${mobileStyles.blocksTable}`}>
                <thead className="table-light">
                  <tr>
                    <th>{intl.formatMessage(messages.actionHeader)}</th>
                    <th className="text-end">{intl.formatMessage(messages.pointsHeader)}</th>
                    <th>{intl.formatMessage(messages.statusHeader)}</th>
                    <th>{intl.formatMessage(messages.earnedDateHeader)}</th>
                  </tr>
                </thead>
                <tbody>
                  {actions.map((action, idx) => (
                    <tr key={idx}>
                      <td>{action.action}</td>
                      <td className="text-end">{action.points}</td>
                      <td>
                        {action.spent ? (
                          <span className="text-danger">
                            {intl.formatMessage(messages.statusSpent)} {action.spent_at ? `(${new Date(action.spent_at).toLocaleString('ru-RU')})` : ''}
                          </span>
                        ) : (
                          <span className="text-success fw-bold">{intl.formatMessage(messages.statusAvailable)}</span>
                        )}
                      </td>
                      <td>
                        {new Date(action.earned_at).toLocaleString('ru-RU', {
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

const OrganizationAccordion = ({ organization, onParticipateToggle, onInviteClick, intl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toggling, setToggling] = useState(false);

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
  } = organization;

  const handleSwitchChange = async (e) => {
    const newValue = e.target.checked;
    setToggling(true);
    await onParticipateToggle(id, newValue);
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
        className={`p-4 bg-light d-flex justify-content-between align-items-start cursor-pointer ${mobileStyles.orgHeader}`}
        onClick={headerClickHandler}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && headerClickHandler(e)}
      >
        <div className="d-flex flex-column">
          <h3 className="mb-1 fw-bold">{name}</h3>

          {referral_enabled && (
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
          )}

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
        </div>

        <div className={`d-flex align-items-center fs-5 gap-4 ms-auto ${mobileStyles.sums}`}>
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
          {allUsers.length > 0 ? (
            allUsers.map((userRef) => (
              <UserAccordion key={userRef.username} userRef={userRef} intl={intl} />
            ))
          ) : (
            <div className="p-4 text-muted">{intl.formatMessage(messages.noReferralInteractions)}</div>
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