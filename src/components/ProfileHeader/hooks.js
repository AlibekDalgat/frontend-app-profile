import { useIntl } from '@edx/frontend-platform/i18n';

import getProfileHeaderMenu from './ProfileHeaderMenu';

export const useProfileHeaderMenu = ({ catalogUrl, authenticatedUser }) => {
  const { formatMessage } = useIntl();
  return getProfileHeaderMenu(formatMessage, catalogUrl, authenticatedUser);
};