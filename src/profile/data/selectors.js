import { createSelector } from 'reselect';
import {
  getLocale,
  getLanguageList,
  getCountryList,
  getCountryMessages,
  getLanguageMessages,
} from '@edx/frontend-platform/i18n'; // eslint-disable-line

export const formIdSelector = (state, props) => props.formId;
export const userAccountSelector = state => state.userAccount;

export const profileAccountSelector = state => state.profilePage.account;
export const profileDraftsSelector = state => state.profilePage.drafts;
export const accountPrivacySelector = state => state.profilePage.preferences.accountPrivacy;
export const profilePreferencesSelector = state => state.profilePage.preferences;
export const profileCourseCertificatesSelector = state => state.profilePage.courseCertificates;
export const profileRewardsSelector = state => state.profilePage.rewards;
export const profileAccountDraftsSelector = state => state.profilePage.accountDrafts;
export const profileVisibilityDraftsSelector = state => state.profilePage.visibilityDrafts;
export const saveStateSelector = state => state.profilePage.saveState;
export const savePhotoStateSelector = state => state.profilePage.savePhotoState;
export const isLoadingProfileSelector = state => state.profilePage.isLoadingProfile;
export const currentlyEditingFieldSelector = state => state.profilePage.currentlyEditingField;
export const accountErrorsSelector = state => state.profilePage.errors;
export const isAuthenticatedUserProfileSelector = state => state.profilePage.isAuthenticatedUserProfile;

export const editableFormModeSelector = createSelector(
  profileAccountSelector,
  isAuthenticatedUserProfileSelector,
  profileCourseCertificatesSelector,
  profileRewardsSelector,
  formIdSelector,
  currentlyEditingFieldSelector,
  (account, isAuthenticatedUserProfile, certificates, rewards, formId, currentlyEditingField) => {
    // If the prop doesn't exist, that means it hasn't been set (for the current user's profile)
    // or is being hidden from us (for other users' profiles)
    let propExists = account[formId] != null && account[formId].length > 0;
    if (formId === 'certificates') {
      propExists = certificates.length > 0;
    } else if (formId === 'rewards') {
      propExists = (rewards ?? []).length > 0;
    }
    // If this isn't the current user's profile
    if (!isAuthenticatedUserProfile) {
      return 'static';
    }
    // the current user has no age set / under 13 ...
    if (account.requiresParentalConsent) {
      // then there are only two options: static or nothing.
      // We use 'null' as a return value because the consumers of
      // getMode render nothing at all on a mode of null.
      return propExists ? 'static' : null;
    }
    // Otherwise, if this is the current user's profile...
    if (formId === currentlyEditingField) {
      return 'editing';
    }

    if (!propExists) {
      return 'empty';
    }

    return 'editable';
  },
);

export const accountDraftsFieldSelector = createSelector(
  formIdSelector,
  profileDraftsSelector,
  (formId, drafts) => drafts[formId],
);

export const visibilityDraftsFieldSelector = createSelector(
  formIdSelector,
  profileVisibilityDraftsSelector,
  (formId, visibilityDrafts) => visibilityDrafts[formId],
);

// Note: Error messages are delivered from the server
// localized according to a user's account settings
export const formErrorSelector = createSelector(
  accountErrorsSelector,
  formIdSelector,
  (errors, formId) => (errors[formId] ? errors[formId].userMessage : null),
);

export const editableFormSelector = createSelector(
  editableFormModeSelector,
  formErrorSelector,
  saveStateSelector,
  (editMode, error, saveState) => ({
    editMode,
    error,
    saveState,
  }),
);

// Because this selector has no input selectors, it will only be evaluated once.  This is fine
// for now because we don't allow users to change the locale after page load.
// Once we DO allow this, we should create an actual action which dispatches the locale into redux,
// then we can modify this to get the locale from state rather than from getLocale() directly.
// Once we do that, this will work as expected and be re-evaluated when the locale changes.
export const localeSelector = () => getLocale();
export const countryMessagesSelector = createSelector(
  localeSelector,
  locale => getCountryMessages(locale),
);
export const languageMessagesSelector = createSelector(
  localeSelector,
  locale => getLanguageMessages(locale),
);

export const sortedLanguagesSelector = createSelector(
  localeSelector,
  locale => getLanguageList(locale),
);

export const sortedCountriesSelector = createSelector(
  localeSelector,
  locale => getCountryList(locale),
);

export const preferredLanguageSelector = createSelector(
  editableFormSelector,
  sortedLanguagesSelector,
  languageMessagesSelector,
  (editableForm, sortedLanguages, languageMessages) => ({
    ...editableForm,
    sortedLanguages,
    languageMessages,
  }),
);

export const countrySelector = createSelector(
  editableFormSelector,
  sortedCountriesSelector,
  countryMessagesSelector,
  (editableForm, sortedCountries, countryMessages) => ({
    ...editableForm,
    sortedCountries,
    countryMessages,
  }),
);

export const certificatesSelector = createSelector(
  editableFormSelector,
  profileCourseCertificatesSelector,
  (editableForm, certificates) => ({
    ...editableForm,
    certificates,
    value: certificates,
  }),
);

export const rewardsSelector = createSelector(
  editableFormSelector,
  profileRewardsSelector,
  (editableForm, rewards) => ({
    ...editableForm,
    rewards,
    value: rewards,
  }),
);

export const profileImageSelector = createSelector(
  profileAccountSelector,
  account => (account.profileImage != null
    ? {
      src: account.profileImage.imageUrlFull,
      isDefault: !account.profileImage.hasImage,
    }
    : {}),
);

/**
 * This is used by a saga to pull out data to process.
 */
export const handleSaveProfileSelector = createSelector(
  profileDraftsSelector,
  profilePreferencesSelector,
  (drafts, preferences) => ({
    drafts,
    preferences,
  }),
);

// Reformats the social links in a platform-keyed hash.
const socialLinksByPlatformSelector = createSelector(
  profileAccountSelector,
  (account) => {
    const linksByPlatform = {};
    if (Array.isArray(account.socialLinks)) {
      account.socialLinks.forEach((socialLink) => {
        linksByPlatform[socialLink.platform] = socialLink;
      });
    }
    return linksByPlatform;
  },
);

const draftSocialLinksByPlatformSelector = createSelector(
  profileDraftsSelector,
  (drafts) => {
    const linksByPlatform = {};
    if (Array.isArray(drafts.socialLinks)) {
      drafts.socialLinks.forEach((socialLink) => {
        linksByPlatform[socialLink.platform] = socialLink;
      });
    }
    return linksByPlatform;
  },
);

// Fleshes out our list of existing social links with all the other ones the user can set.
export const formSocialLinksSelector = createSelector(
  socialLinksByPlatformSelector,
  draftSocialLinksByPlatformSelector,
  (linksByPlatform, draftLinksByPlatform) => {
    const knownPlatforms = ['telegram', 'vk', 'max'];
    const socialLinks = [];
    // For each known platform
    knownPlatforms.forEach((platform) => {
      // If the link is in our drafts.
      if (draftLinksByPlatform[platform] !== undefined) {
        // Use the draft one.
        socialLinks.push(draftLinksByPlatform[platform]);
      } else if (linksByPlatform[platform] !== undefined) {
        // Otherwise use the real one.
        socialLinks.push(linksByPlatform[platform]);
      } else {
        // And if it's not in either, use a stub.
        socialLinks.push({
          platform,
          socialLink: null,
        });
      }
    });
    return socialLinks;
  },
);

export const visibilitiesSelector = createSelector(
  profilePreferencesSelector,
  accountPrivacySelector,
  (preferences, accountPrivacy) => {
    switch (accountPrivacy) {
      case 'custom':
        return {
          visibilityBio: preferences.visibilityBio || 'all_users',
          visibilityCourseCertificates: preferences.visibilityCourseCertificates || 'all_users',
          visibilityRewards: preferences.visibilityRewards || 'all_users',
          visibilityCountry: preferences.visibilityCountry || 'all_users',
          visibilityLevelOfEducation: preferences.visibilityLevelOfEducation || 'all_users',
          visibilityLanguageProficiencies: preferences.visibilityLanguageProficiencies || 'all_users',
          visibilityName: preferences.visibilityName || 'all_users',
          visibilitySocialLinks: preferences.visibilitySocialLinks || 'all_users',
          visibilityCity: preferences.visibilityCity || 'all_users',
          visibilityPosition: preferences.visibilityPosition || 'all_users',
          visibilityCompanyName: preferences.visibilityCompanyName || 'all_users',
        };
      case 'private':
        return {
          visibilityBio: 'private',
          visibilityCourseCertificates: 'private',
          visibilityRewards: 'private',
          visibilityCountry: 'private',
          visibilityLevelOfEducation: 'private',
          visibilityLanguageProficiencies: 'private',
          visibilityName: 'private',
          visibilitySocialLinks: 'private',
          visibilityCity: 'private',
          visibilityPosition: 'private',
          visibilityCompanyName: 'private',
        };
      case 'all_users':
      default:
        // All users is intended to fall through to default.
        // If there is no value for accountPrivacy in perferences, that means it has not been
        // explicitly set yet. The server assumes - today - that this means "all_users",
        // so we emulate that here in the client.
        return {
          visibilityBio: 'all_users',
          visibilityCourseCertificates: 'all_users',
          visibilityRewards: 'all_users',
          visibilityCountry: 'all_users',
          visibilityLevelOfEducation: 'all_users',
          visibilityLanguageProficiencies: 'all_users',
          visibilityName: 'all_users',
          visibilitySocialLinks: 'all_users',
          visibilityCity: 'all_users',
          visibilityPosition: 'all_users',
          visibilityCompanyName: 'all_users',
        };
    }
  },
);

/**
 * If there's no draft present at all (undefined), use the original committed value.
 */
function chooseFormValue(draft, committed) {
  return draft !== undefined ? draft : committed;
}

export const formValuesSelector = createSelector(
  profileAccountSelector,
  visibilitiesSelector,
  profileDraftsSelector,
  profileCourseCertificatesSelector,
  profileRewardsSelector,
  formSocialLinksSelector,
  (account, visibilities, drafts, courseCertificates, rewards, socialLinks) => ({
    bio: chooseFormValue(drafts.bio, account.bio),
    visibilityBio: chooseFormValue(drafts.visibilityBio, visibilities.visibilityBio),
    courseCertificates,
    visibilityCourseCertificates: chooseFormValue(
      drafts.visibilityCourseCertificates,
      visibilities.visibilityCourseCertificates,
    ),
    rewards,
    visibilityRewards: chooseFormValue(
      drafts.visibilityRewards,
      visibilities.visibilityRewards
    ),
    country: chooseFormValue(drafts.country, account.country),
    visibilityCountry: chooseFormValue(drafts.visibilityCountry, visibilities.visibilityCountry),
    city: chooseFormValue(drafts.city, account.city),
    visibilityCity: chooseFormValue(drafts.visibilityCity, visibilities.visibilityCity),
    position: chooseFormValue(drafts.position, account.position),
    visibilityPosition: chooseFormValue(drafts.visibilityPosition, visibilities.visibilityPosition),
    companyName: chooseFormValue(drafts.companyName, account.companyName),
    visibilityCompanyName: chooseFormValue(drafts.visibilityCompanyName, visibilities.visibilityCompanyName),
    levelOfEducation: chooseFormValue(drafts.levelOfEducation, account.levelOfEducation),
    visibilityLevelOfEducation: chooseFormValue(
      drafts.visibilityLevelOfEducation,
      visibilities.visibilityLevelOfEducation,
    ),
    languageProficiencies: chooseFormValue(
      drafts.languageProficiencies,
      account.languageProficiencies,
    ),
    visibilityLanguageProficiencies: chooseFormValue(
      drafts.visibilityLanguageProficiencies,
      visibilities.visibilityLanguageProficiencies,
    ),
    name: chooseFormValue(drafts.name, account.name),
    visibilityName: chooseFormValue(drafts.visibilityName, visibilities.visibilityName),
    socialLinks, // Social links is calculated in its own selector, since it's complicated.
    visibilitySocialLinks: chooseFormValue(
      drafts.visibilitySocialLinks,
      visibilities.visibilitySocialLinks,
    ),
  }),
);

export const profilePageSelector = createSelector(
  profileAccountSelector,
  formValuesSelector,
  profileImageSelector,
  saveStateSelector,
  savePhotoStateSelector,
  isLoadingProfileSelector,
  draftSocialLinksByPlatformSelector,
  accountErrorsSelector,
  (
    account,
    formValues,
    profileImage,
    saveState,
    savePhotoState,
    isLoadingProfile,
    draftSocialLinksByPlatform,
    errors,
  ) => ({
    // Account data we need
    username: account.username,
    profileImage,
    requiresParentalConsent: account.requiresParentalConsent,
    dateJoined: account.dateJoined,
    yearOfBirth: account.yearOfBirth,
    cashbackUserId: account.cashbackUserId,

    // Bio form data
    bio: formValues.bio,
    visibilityBio: formValues.visibilityBio,

    // Certificates form data
    courseCertificates: formValues.courseCertificates,
    visibilityCourseCertificates: formValues.visibilityCourseCertificates,

    // Rewards
    rewards: formValues.rewards,
    visibilityRewards: formValues.visibilityRewards,

    // Country form data
    country: formValues.country,
    visibilityCountry: formValues.visibilityCountry,

    // City form data
    city: formValues.city,
    visibilityCity: formValues.visibilityCity,

    // Position form data
    position: formValues.position,
    visibilityPosition: formValues.visibilityPosition,

    // Company name form data
    companyName: formValues.companyName,
    visibilityCompanyName: formValues.visibilityCompanyName,

    // Education form data
    levelOfEducation: formValues.levelOfEducation,
    visibilityLevelOfEducation: formValues.visibilityLevelOfEducation,

    // Language proficiency form data
    languageProficiencies: formValues.languageProficiencies,
    visibilityLanguageProficiencies: formValues.visibilityLanguageProficiencies,

    // Name form data
    name: formValues.name,
    visibilityName: formValues.visibilityName,

    // Social links form data
    socialLinks: formValues.socialLinks,
    visibilitySocialLinks: formValues.visibilitySocialLinks,
    draftSocialLinksByPlatform,

    // Other data we need
    saveState,
    savePhotoState,
    isLoadingProfile,
    photoUploadError: errors.photo || null,
  }),
);
