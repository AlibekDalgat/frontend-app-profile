import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from '@openedx/paragon';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import ratingStyles from './RatingsPage.css'

const RatingsPage = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await getAuthenticatedHttpClient().get(
          `${getConfig().LMS_BASE_URL}/api/rewards/v0/ratings/`
        );
        setRatings(res.data.ratings || []);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить рейтинги');
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, []);

  if (loading) return <Container size="lg" className="py-5 text-center"><Spinner animation="border" variant="primary" /></Container>;
  if (error) return <Container size="lg" className="py-5"><Alert variant="danger">{error}</Alert></Container>;

  if (ratings.length === 0) {
    return (
      <Container size="lg" className="py-5">
        <Alert variant="info">Нет рейтингов для ваших организаций.</Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" className="py-5">
      <h2 className="mb-5">Рейтинги</h2>

      {ratings.map((org) => (
        <RatingAccordion key={org.organization_id} org={org} />
      ))}
    </Container>
  );
};

const RatingAccordion = ({ org }) => {
  const [isOpen, setIsOpen] = useState(false);

  const userInTop = org.user_position && org.user_position.rank <= org.top_limit;
  const showEllipsisAndUser = org.user_position && !userInTop;

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
          <div className="small text-muted">Топ-{org.top_limit} участников</div>
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
                  <th className="text-end">Опыт</th>
                </tr>
              </thead>
              <tbody>
                {org.top && org.top.length > 0 ? (
                  org.top.map((entry) => (
                    <tr
                      key={entry.rank}
                      className={
                        org.user_position?.rank === entry.rank ? 'table-primary' : ''
                      }
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
                      Топ пока пуст
                    </td>
                  </tr>
                )}

                {showEllipsisAndUser && (
                  <>
                    <tr>
                      <td colSpan="3" className="text-center text-muted py-2">…</td>
                    </tr>
                    <tr className="table-primary">
                      <td className="text-center fw-bold">{org.user_position.rank}</td>
                      <td>
                        {org.user_position.username}
                        {org.user_position.tied_total > 1 && (
                          <small className="text-muted mx-1">
                            и ещё {org.user_position.tied_total - 1}
                          </small>
                        )}
                      </td>
                      <td className="text-end">{org.user_position.experience}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {!org.user_position && (
            <div className="p-3 text-muted border-top">
              Вы не участвуете в этом рейтинге или у вас пока нет опыта.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RatingsPage;