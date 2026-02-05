import { getConfig } from '@edx/frontend-platform';

import messages from './messages';

const getProfileHeaderMenu = (formatMessage, catalogUrl, authenticatedUser) => ({
  mainMenu: [
    {
      type: 'item',
      href: `${getConfig().LMS_BASE_URL}/dashboard`,
      content: formatMessage(messages.myLearning),
    },
    {
      type: 'item',
      href: catalogUrl.startsWith('http') ? catalogUrl : `${getConfig().LMS_BASE_URL}${catalogUrl}`,
      content: formatMessage(messages.catalog),
    },
    {
      type: 'item',
      href: `${getConfig().ACCOUNT_PROFILE_URL}/ratings`,
      content: formatMessage(messages.ratings),
    },
  ],

  secondaryMenu: [],

  userMenu: authenticatedUser ? [
    {
      heading: '',
      items: [
        {
          type: 'item',
          href: `${getConfig().ACCOUNT_PROFILE_URL}/u/${authenticatedUser.username}`,
          content: formatMessage(messages.profile),
        },
        {
          type: 'item',
          href: getConfig().ACCOUNT_SETTINGS_URL,
          content: formatMessage(messages.account),
        },
      ],
    },
    {
      heading: '',
      items: [
        {
          type: 'item',
          href: getConfig().LOGOUT_URL,
          content: formatMessage(messages.signOut),
        },
      ],
    },
  ] : [],
});

export default getProfileHeaderMenu;