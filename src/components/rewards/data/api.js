import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

export const fetchRewardsHistory = async (orgId = null, page = 1, perPage = 20) => {
  let url = `${getConfig().LMS_BASE_URL}/api/rewards/v0/history/`;
  const params = new URLSearchParams();
  if (orgId) params.append('org_id', orgId);
  if (page !== 1) params.append('page', page);
  if (perPage !== 20) params.append('per_page', perPage);
  if (params.toString()) url += `?${params.toString()}`;
  return getAuthenticatedHttpClient().get(url);
};

export const toggleParticipateInRating = async (orgId, participate) => {
  return getAuthenticatedHttpClient().patch(
    `${getConfig().LMS_BASE_URL}/api/rewards/v0/wallet/${orgId}/participate/`,
    { participate }
  );
};

export const toggleParticipateInReferralRating = async (orgId, participate) => {
  return getAuthenticatedHttpClient().patch(
    `${getConfig().LMS_BASE_URL}/api/rewards/v0/referral/wallet/${orgId}/participate-rating/`,
    { participate }
  );
};

export const fetchReferralHistory = async (orgId = null, page = 1, perPage = 20) => {
  let url = `${getConfig().LMS_BASE_URL}/api/rewards/v0/referral_history/`;
  const params = new URLSearchParams();
  if (orgId) params.append('org_id', orgId);
  if (page !== 1) params.append('page', page);
  if (perPage !== 20) params.append('per_page', perPage);
  if (params.toString()) url += `?${params.toString()}`;
  return getAuthenticatedHttpClient().get(url);
};

export const toggleParticipateInReferral = async (orgId, is_active) => {
  return getAuthenticatedHttpClient().patch(
    `${getConfig().LMS_BASE_URL}/api/rewards/v0/referral/wallet/${orgId}/active/`,
    { is_active }
  );
};

export const fetchEnrolledCourses = async () => {
  return getAuthenticatedHttpClient().get(`${getConfig().LMS_BASE_URL}/api/rewards/enrolled-courses/`);
};

export const generateReferralLink = async (orgId, course_id = null) => {
  const data = course_id ? { course_id } : {};
  return getAuthenticatedHttpClient().post(
    `${getConfig().LMS_BASE_URL}/api/rewards/v0/referral/wallet/${orgId}/generate-link/`,
    data
  );
};