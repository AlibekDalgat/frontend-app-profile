import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

export const fetchRewardsHistory = async () => {
  return getAuthenticatedHttpClient().get(`${getConfig().LMS_BASE_URL}/api/rewards/v0/history/`);
};

export const toggleParticipateInRating = async (orgId, participate) => {
  return getAuthenticatedHttpClient().patch(
    `${getConfig().LMS_BASE_URL}/api/rewards/v0/wallet/${orgId}/participate/`,
    { participate }
  );
};

export const fetchReferralHistory = async () => {
  return getAuthenticatedHttpClient().get(`${getConfig().LMS_BASE_URL}/api/rewards/v0/referral_history/`);
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