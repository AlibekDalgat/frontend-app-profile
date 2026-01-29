import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert, Badge } from '@openedx/paragon';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import messages from './RewardsHistory.messages';
import mobileStyles from './RewardsHistory.mobile.module.css';

const getBlockTypeDisplayName = (blockType) => {
  return messages[`blockType.${blockType}`] || blockType;
};

const RewardsHistoryPage = () => {
  const [data, setData] = useState({ organizations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    fetchHistory();
  }, []);

  if (loading) return <Container size="lg" className="py-5 text-center"><Spinner animation="border" variant="primary" /></Container>;
  if (error) return <Container size="lg" className="py-5"><Alert variant="danger">{error}</Alert></Container>;
  if (!data.organizations?.length) {
    return <Container size="lg" className="py-5"><Alert variant="info">У вас пока нет записей в истории наград.</Alert></Container>;
  }

  return (
    <Container size="lg" className="py-5">
      <h2 className="mb-5">История наград</h2>

      {data.organizations.map((org) => (
        <OrganizationAccordion key={org.id} organization={org} />
      ))}
    </Container>
  );
};

const OrganizationAccordion = ({ organization }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { name, currency_full_name, total_earned, total_balance, total_spent, courses } = organization;

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
          <h3 className="mb-1 fw-bold">{currency_full_name || 'Валюта'}</h3>
          <div className="text-muted">{name || 'Организация'}</div>
        </div>

        <div className="d-flex align-items-center fs-5">
          <div className="me-3">
            <span className="d-block small text-muted">Начислено</span>
            <strong>{total_earned ?? 0}</strong>
          </div>
          <div className="mx-3">
            <span className="d-block small text-muted">Доступно</span>
            <strong className={total_balance > 0 ? 'text-success' : ''}>
              {total_balance ?? 0}
            </strong>
          </div>
          <div className="mx-3">
            <span className="d-block small text-muted">Списано</span>
            <strong>{total_spent ?? 0}</strong>
          </div>
          <div className="ms-3 fs-4 fw-bold">{isOpen ? '▲' : '▼'}</div>
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
        className="d-flex justify-content-between align-items-center px-4 py-3 bg-white cursor-pointer border-top"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsOpen(!isOpen)}
      >
        <div className="d-flex align-items-center">
          <div className="fw-bold fs-5">{display_name}</div>
          {number && (
            <>
              <span className="mx-1">&nbsp;</span>
              <Badge bg="secondary">
                {number}
              </Badge>
            </>
          )}
        </div>

        <div className="d-flex align-items-center text-nowrap">
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
        <div className="px-5 py-4 border-top">
          {blocks.length === 0 ? (
            <div className="text-muted py-2">Нет наград по блокам</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm table-hover mb-0">
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

export default RewardsHistoryPage;