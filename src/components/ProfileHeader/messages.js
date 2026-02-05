import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  myLearning: {
    id: 'account.header.dashboardLink',
    defaultMessage: 'Моё обучение',
    description: 'Ссылка на дашборд в основном меню хедера страницы курса',
  },
  catalog: {
    id: 'profile.header.discoveryLink',
    defaultMessage: 'Каталог обучения',
    description: 'Ссылка на каталог курсов в основном меню хедера',
  },
  ratings: {
    id: 'profile.header.ratings',
    defaultMessage: 'Рейтинги',
    description: 'Ссылка на страницу рейтингов в основном меню хедера',
  },

  profile: {
    id: 'profile.header.profileLink',
    defaultMessage: 'Профиль',
    description: 'Ссылка на профиль пользователя в выпадающем меню',
  },
  account: {
    id: 'profile.header.accountLink',
    defaultMessage: 'Учётная запись',
    description: 'Ссылка на настройки аккаунта в выпадающем меню',
  },
  signOut: {
    id: 'profile.header.exitLink',
    defaultMessage: 'Выйти',
    description: 'Ссылка на выход из аккаунта в выпадающем меню',
  },
});

export default messages;