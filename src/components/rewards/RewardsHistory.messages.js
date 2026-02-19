import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'rewards.page.title',
    defaultMessage: 'Мои награды',
    description: 'Заголовок страницы наград',
  },
  learningTabTitle: {
    id: 'rewards.tab.learning',
    defaultMessage: 'За обучение',
    description: 'Заголовок вкладки наград за обучение',
  },
  referralTabTitle: {
    id: 'rewards.tab.referral',
    defaultMessage: 'За рефералы',
    description: 'Заголовок вкладки реферальных наград',
  },
  errorLoadHistory: {
    id: 'rewards.error.loadHistory',
    defaultMessage: 'Не удалось загрузить историю наград',
    description: 'Сообщение об ошибке загрузки истории',
  },
  noHistoryRecords: {
    id: 'rewards.noHistoryRecords',
    defaultMessage: 'У вас пока нет записей в истории наград.',
    description: 'Сообщение об отсутствии записей в истории',
  },
  errorToggleParticipate: {
    id: 'rewards.error.toggleParticipate',
    defaultMessage: 'Ошибка изменения участия:',
    description: 'Сообщение об ошибке изменения участия',
  },
  errorSaveSetting: {
    id: 'rewards.error.saveSetting',
    defaultMessage: 'Не удалось сохранить настройку',
    description: 'Сообщение об ошибке сохранения настройки',
  },
  fallbackCurrency: {
    id: 'rewards.fallback.currency',
    defaultMessage: 'Валюта',
    description: 'Fallback для названия валюты',
  },
  fallbackOrganization: {
    id: 'rewards.fallback.organization',
    defaultMessage: 'Организация',
    description: 'Fallback для названия организации',
  },
  participateInRating: {
    id: 'rewards.participateInRating',
    defaultMessage: 'Участвовать в рейтинге',
    description: 'Надпись для переключателя участия в рейтинге',
  },
  participateInRatingTooltip: {
    id: 'rewards.participateInRating.tooltip',
    defaultMessage: 'Если включено — ваш опыт будет учитываться в публичном рейтинге организации',
    description: 'Подсказка для участия в рейтинге',
  },
  earnedLabel: {
    id: 'rewards.earnedLabel',
    defaultMessage: 'Начислено',
    description: 'Надпись для начисленных наград',
  },
  availableLabel: {
    id: 'rewards.availableLabel',
    defaultMessage: 'Доступно',
    description: 'Надпись для доступных наград',
  },
  spentLabel: {
    id: 'rewards.spentLabel',
    defaultMessage: 'Списано',
    description: 'Надпись для списанных наград',
  },
  noCoursesWithRewards: {
    id: 'rewards.noCoursesWithRewards',
    defaultMessage: 'Нет курсов с наградами',
    description: 'Сообщение об отсутствии курсов с наградами',
  },
  fallbackCourseName: {
    id: 'rewards.fallback.courseName',
    defaultMessage: 'Без названия',
    description: 'Fallback для названия курса',
  },
  blockNameHeader: {
    id: 'rewards.blockNameHeader',
    defaultMessage: 'Название блока',
    description: 'Заголовок столбца названия блока',
  },
  blockTypeHeader: {
    id: 'rewards.blockTypeHeader',
    defaultMessage: 'Тип',
    description: 'Заголовок столбца типа блока',
  },
  rewardsHeader: {
    id: 'rewards.rewardsHeader',
    defaultMessage: 'Награды',
    description: 'Заголовок столбца наград',
  },
  statusHeader: {
    id: 'rewards.statusHeader',
    defaultMessage: 'Статус',
    description: 'Заголовок столбца статуса',
  },
  earnedDateHeader: {
    id: 'rewards.earnedDateHeader',
    defaultMessage: 'Дата получения',
    description: 'Заголовок столбца даты получения',
  },
  statusSpent: {
    id: 'rewards.status.spent',
    defaultMessage: 'Списано',
    description: 'Статус списано',
  },
  statusAvailable: {
    id: 'rewards.status.available',
    defaultMessage: 'Доступно',
    description: 'Статус доступно',
  },
  noBlockRewards: {
    id: 'rewards.noBlockRewards',
    defaultMessage: 'Нет наград по блокам',
    description: 'Сообщение об отсутствии наград по блокам',
  },
  fallbackUsername: {
    id: 'rewards.fallback.username',
    defaultMessage: 'Аноним',
    description: 'Fallback для имени пользователя',
  },
  inviterBadge: {
    id: 'rewards.inviterBadge',
    defaultMessage: 'Пригласил Вас',
    description: 'Бейдж для пригласителя',
  },
  noActions: {
    id: 'rewards.noActions',
    defaultMessage: 'Нет действий',
    description: 'Сообщение об отсутствии действий',
  },
  actionHeader: {
    id: 'rewards.actionHeader',
    defaultMessage: 'Действие',
    description: 'Заголовок столбца действия',
  },
  pointsHeader: {
    id: 'rewards.pointsHeader',
    defaultMessage: 'Баллы',
    description: 'Заголовок столбца баллов',
  },
  participateInReferral: {
    id: 'rewards.participateInReferral',
    defaultMessage: 'Участвовать в реферальной программе',
    description: 'Надпись для переключателя участия в реферальной программе',
  },
  participateInReferralTooltip: {
    id: 'rewards.participateInReferral.tooltip',
    defaultMessage: 'Если включено — другие пользователи смогут регистрироваться по вашей реферальной ссылке, за что Вы получите награды',
    description: 'Подсказка для участия в реферальной программе',
  },
  inviteButton: {
    id: 'rewards.inviteButton',
    defaultMessage: 'Пригласить',
    description: 'Текст кнопки пригласить',
  },
  noReferralInteractions: {
    id: 'rewards.noReferralInteractions',
    defaultMessage: 'Нет реферальных взаимодействий',
    description: 'Сообщение об отсутствии реферальных взаимодействий',
  },
  loadingCourses: {
    id: 'rewards.loadingCourses',
    defaultMessage: 'Загрузка курсов...',
    description: 'Сообщение загрузки курсов',
  },
  noEnrolledCourses: {
    id: 'rewards.noEnrolledCourses',
    defaultMessage: 'У вас нет активных зачислений на курсы',
    description: 'Сообщение об отсутствии зачислений на курсы',
  },
  generalLinkOption: {
    id: 'rewards.generalLinkOption',
    defaultMessage: 'Общая ссылка (на каталог курсов)',
    description: 'Опция общей ссылки',
  },
  generatingLink: {
    id: 'rewards.generatingLink',
    defaultMessage: 'Генерация ссылки...',
    description: 'Сообщение генерации ссылки',
  },
  provideQrOrLink: {
    id: 'rewards.provideQrOrLink',
    defaultMessage: 'Предоставьте QR-код или ссылку:',
    description: 'Надпись предоставьте QR или ссылку',
  },
  copyButton: {
    id: 'rewards.copyButton',
    defaultMessage: 'Копировать',
    description: 'Текст кнопки копировать',
  },
  copySuccess: {
    id: 'rewards.copySuccess',
    defaultMessage: 'Скопировано в буфер обмена!',
    description: 'Сообщение успешного копирования',
  },
  destinationLabel: {
    id: 'rewards.destinationLabel',
    defaultMessage: 'Адрес назначения',
    description: 'Надпись адреса назначения',
  },
  errorLoadReferralHistory: {
    id: 'rewards.error.loadReferralHistory',
    defaultMessage: 'Не удалось загрузить реферальную историю',
    description: 'Сообщение об ошибке загрузки реферальной истории',
  },
  noReferralRecords: {
    id: 'rewards.noReferralRecords',
    defaultMessage: 'У вас пока нет реферальных наград или активных программ.',
    description: 'Сообщение об отсутствии реферальных записей',
  },
  errorToggleReferral: {
    id: 'rewards.error.toggleReferral',
    defaultMessage: 'Ошибка изменения участия в реферальной программе:',
    description: 'Сообщение об ошибке изменения участия в рефералах',
  },
  errorToggleReferralRating: {
    id: 'rewards.error.toggleReferralRating',
    defaultMessage: 'Ошибка изменения участия в реферальном рейтинге:',
    description: 'Сообщение об ошибке изменения участия в реферальном рейтинге',
  },
  errorGenerateGeneralLink: {
    id: 'rewards.error.generateGeneralLink',
    defaultMessage: 'Не удалось сгенерировать общую ссылку',
    description: 'Сообщение об ошибке генерации общей ссылки',
  },
  errorGenerateCourseLink: {
    id: 'rewards.error.generateCourseLink',
    defaultMessage: 'Не удалось сгенерировать ссылку на курс',
    description: 'Сообщение об ошибке генерации ссылки на курс',
  },
  inviteModalTitlePrefix: {
    id: 'rewards.inviteModalTitle.prefix',
    defaultMessage: 'Пригласить в',
    description: 'Префикс заголовка модалки приглашения',
  },
  modalCloseText: {
    id: 'rewards.modalCloseText',
    defaultMessage: 'Закрыть',
    description: 'Текст кнопки закрытия модалки',
  },
  'blockType.html': {
    id: 'rewards.blockType.html',
    defaultMessage: 'Текст',
  },
  'blockType.video': {
    id: 'rewards.blockType.video',
    defaultMessage: 'Видео',
  },
  'blockType.problem': {
    id: 'rewards.blockType.problem',
    defaultMessage: 'Тестирование',
  },
  'blockType.drag-and-drop-v2': {
    id: 'rewards.blockType.drag-and-drop-v2',
    defaultMessage: 'Перетаскивание',
  },
  'blockType.itembank': {
    id: 'rewards.blockType.itembank',
    defaultMessage: 'Банк задач',
  },
  'blockType.openassessment': {
    id: 'rewards.blockType.openassessment',
    defaultMessage: 'Открытый ответ',
  },
  'blockType.pdf': {
    id: 'rewards.blockType.pdf',
    defaultMessage: 'PDF',
  },
  'blockType.scorm': {
    id: 'rewards.blockType.scorm',
    defaultMessage: 'SCORM',
  },
  'blockType.poll': {
    id: 'rewards.blockType.poll',
    defaultMessage: 'Опрос',
  },
  'blockType.survey': {
    id: 'rewards.blockType.survey',
    defaultMessage: 'Оценка',
  },
  'blockType.word_cloud': {
    id: 'rewards.blockType.word_cloud',
    defaultMessage: 'Вебинар',
  },
  'blockType.unknown': {
    id: 'rewards.blockType.unknown',
    defaultMessage: 'Неизвестно',
  },
  deletedOrUnavailableBlockName: {
    id: 'rewards.deletedOrUnavailableBlockName',
    defaultMessage: 'Блок удалён или недоступен',
     description: 'Показывается в названии блока, когда block_type = unknown',
  },
});