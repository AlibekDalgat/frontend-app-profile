import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';
import { useNavigate } from 'react-router-dom';

import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import SwitchContent from './elements/SwitchContent';

import { editableFormSelector } from '../data/selectors';

import messages from './Rewards.messages';

const Rewards = ({
  formId,
  rewards,
  visibilityRewards,
  editMode,
  saveState,
  intl,
  isAuthenticatedUserProfile,
  changeHandler,
  submitHandler,
  closeHandler,
  openHandler,
}) => {
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    changeHandler(name, value);
  };

  const handleVisibilityChange = (e) => {
    const newVisibility = e.target.value;
    changeHandler('visibilityRewards', newVisibility);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitHandler(formId);
  };

  const handleClose = () => {
    closeHandler(formId);
  };

  const handleOpen = () => {
    openHandler(formId);
  };

  const handleDetailsClick = () => {
    navigate('/rewards');
  };

  const renderRewards = () => {
    if (!rewards || rewards.length === 0) {
      return (
        <FormattedMessage
          id="profile.no.rewards"
          defaultMessage="У вас ещё нет наград."
        />
      );
    }

    return (
      <>
        <ul className="list-group">
          {rewards.map((reward) => (
            <li key={reward.organization} className="list-group-item">
              <div className="d-flex flex-column">
                <strong>
                  {reward.currency}: {reward.experience}
                </strong>
                <small className="text-muted mt-1">
                  За прохождение курсов от "{reward.organization}"
                </small>
              </div>
            </li>
          ))}
        </ul>

        {isAuthenticatedUserProfile && (
          <div className="mt-3 text-end">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={handleDetailsClick}
            >
              <FormattedMessage
                id="profile.rewards.details"
                defaultMessage="Подробнее"
              />
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <SwitchContent
      className="mb-4"
      expression={editMode}
      cases={{
        editing: (
          <div role="dialog" aria-labelledby={`${formId}-label`}>
            <form onSubmit={handleSubmit}>
              <EditableItemHeader
                headingId={`${formId}-label`}
                content={intl.formatMessage(messages.myRewards)}
              />

              <div className="mt-3">
                {renderRewards()}
              </div>

              <FormControls
                visibilityId="visibilityRewards"
                saveState={saveState}
                visibility={visibilityRewards}
                cancelHandler={handleClose}
                changeHandler={handleVisibilityChange}
              />
            </form>
          </div>
        ),
        editable: (
          <>
            <EditableItemHeader
              content={intl.formatMessage(messages.myRewards)}
              showEditButton={isAuthenticatedUserProfile}
              onClickEdit={handleOpen}
              showVisibility={visibilityRewards !== null}
              visibility={visibilityRewards}
            />
            {renderRewards()}
          </>
        ),
        empty: (
          <>
            <EditableItemHeader
              content={intl.formatMessage(messages.myRewards)}
              showEditButton={isAuthenticatedUserProfile}
              onClickEdit={handleOpen}
            />
            {renderRewards()}
          </>
        ),
        static: (
          <>
            <EditableItemHeader
              content={intl.formatMessage(messages.myRewards)}
            />
            {renderRewards()}
          </>
        ),
      }}
    />
  );
};

Rewards.propTypes = {
  formId: PropTypes.string.isRequired,
  rewards: PropTypes.arrayOf(
    PropTypes.shape({
      organization: PropTypes.string,
      currency: PropTypes.string,
      experience: PropTypes.number,
    })
  ),
  visibilityRewards: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  isAuthenticatedUserProfile: PropTypes.bool,
};

Rewards.defaultProps = {
  editMode: 'static',
  saveState: null,
  rewards: null,
  visibilityRewards: 'private',
  isAuthenticatedUserProfile: false,
};

const mapStateToProps = (state, ownProps) => ({
  ...editableFormSelector(state, ownProps),
  isAuthenticatedUserProfile: state.profilePage.isAuthenticatedUserProfile,
});

export default connect(mapStateToProps)(injectIntl(Rewards));