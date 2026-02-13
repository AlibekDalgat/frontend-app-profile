import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert, Badge, Form, OverlayTrigger, Tooltip } from '@openedx/paragon';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { InfoOutline } from '@openedx/paragon/icons';

import messages from './RewardsHistory.messages';
import mobileStyles from './RewardsHistory.mobile.module.css';

const getBlockTypeDisplayName = (blockType) => {
  return messages[`blockType.${blockType}`] || blockType;
};

const RewardsTab = () => {
  const [data, setData] = useState({ organizations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      const response = await getAuthenticatedHttpClient().get(
        `${getConfig().LMS_BASE_URL}/api/rewards/v0/history/`
      );
      setData(response.data || { organizations: [] });
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить историю наград');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleParticipateToggle = async (orgId, newValue) => {
    try {
      await getAuthenticatedHttpClient().patch(
        `${getConfig().LMS_BASE_URL}/api/rewards/v0/wallet/${orgId}/participate/`,
        { participate: newValue }
      );
      await fetchHistory();
    } catch (err) {
      console.error('Ошибка изменения участия:', err);
      alert('Не удалось сохранить настройку');
    }
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!data.organizations?.length) {
    return <Alert variant="info">У вас пока нет записей в истории наград.</Alert>;
  }

  return (
    <>
      {data.organizations.map((org) => (
        <OrganizationAccordion
          key={org.id}
          organization={org}
          onParticipateToggle={handleParticipateToggle}
        />
      ))}
    </>
  );
};

const OrganizationAccordion = ({ organization, onParticipateToggle }) => {
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
          <h3 className="mb-1 fw-bold">{currency_full_name || 'Валюта'}</h3>
          <div className="text-muted mb-2">{name || 'Организация'}</div>

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
                <span>Участвовать в рейтинге</span>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-${id}`}>
                      Если включено — ваш опыт будет учитываться в публичном рейтинге организации
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
            <span className="d-block small text-muted">Начислено</span>
            <strong>{total_earned ?? 0}</strong>
          </div>
          <div className="mx-3 text-center">
            <span className="d-block small text-muted">Доступно</span>
            <strong className={total_balance > 0 ? 'text-success' : ''}>{total_balance ?? 0}</strong>
          </div>
          <div className="mx-3 text-center">
            <span className="d-block small text-muted">Списано</span>
            <strong>{total_spent ?? 0}</strong>
          </div>

          <div className="ms-4 fs-4 fw-bold">{isOpen ? '▲' : '▼'}</div>
        </div>
      </div>

      {isOpen && (
        <div className="border-top">
          {courses?.length ? (
            courses.map((course) => (
              <CourseAccordion key={course.id} course={course} />
            ))
          ) : (
            <div className="p-4 text-muted">Нет курсов с наградами</div>
          )}
        </div>
      )}
    </div>
  );
};

const CourseAccordion = ({ course }) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    display_name = 'Без названия',
    number = '',
    total_earned = 0,
    total_spent = 0,
    total_balance = 0,
    blocks = [],
  } = course;

  return (
    <>
      <div
        className={`d-flex justify-content-between align-items-center px-4 py-3 bg-white cursor-pointer border-top ${mobileStyles.courseHeader}`}        onClick={() => setIsOpen(!isOpen)}
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
            <span className="d-block small text-muted">Начислено</span>
            <strong>{total_earned}</strong>
          </div>
          <div className="mx-3">
            <span className="d-block small text-muted">Доступно</span>
            <strong className={total_balance > 0 ? 'text-success' : ''}>
              {total_balance}
            </strong>
          </div>
          <div className="mx-3">
            <span className="d-block small text-muted">Списано</span>
            <strong>{total_spent}</strong>
          </div>
          <div className="ms-3 fs-4 fw-bold">{isOpen ? '▲' : '▼'}</div>
        </div>
      </div>

      {isOpen && (
        <div className={`px-5 py-4 border-top ${mobileStyles.blocksContent}`}>
          {blocks.length === 0 ? (
            <div className="text-muted py-2">Нет наград по блокам</div>
          ) : (
            <div className="table-responsive">
              <table className={`table table-sm table-hover mb-0 ${mobileStyles.blocksTable}`}>
                <thead className="table-light">
                  <tr>
                    <th>Название блока</th>
                    <th>Тип</th>
                    <th className="text-end">Награды</th>
                    <th>Статус</th>
                    <th>Дата получения</th>
                  </tr>
                </thead>
                <tbody>
                  {blocks.map((block) => (
                    <tr key={block.block_id}>
                      <td className="fw-medium">{block.block_name || '—'}</td>
                      <td>{getBlockTypeDisplayName(block.block_type)}</td>
                      <td className="text-end">{block.points}</td>
                      <td>
                        {block.spent ? (
                          <span className="text-danger">
                            Списано {block.spent_at ? `(${new Date(block.spent_at).toLocaleString('ru-RU')})` : ''}
                          </span>
                        ) : (
                          <span className="text-success fw-bold">Доступно</span>
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

export default RewardsTab;