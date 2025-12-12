import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';

import messages from './Position.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { editableFormSelector } from '../data/selectors';

class Position extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.props.changeHandler(name, value);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.submitHandler(this.props.formId);
  }

  handleClose() {
    this.props.closeHandler(this.props.formId);
  }

  handleOpen() {
    this.props.openHandler(this.props.formId);
  }

  render() {
    const {
      formId, position, visibilityPosition, editMode, saveState, error, intl,
    } = this.props;

    const isAuthenticatedUser = this.props.isAuthenticatedUserProfile;
    const canEditContent = false;

    return (
      <SwitchContent
        className="mb-5"
        expression={editMode}
        cases={{
          editing: (
            <div role="dialog" aria-labelledby={`${formId}-label`}>
              <form onSubmit={this.handleSubmit}>
                <Form.Group
                  controlId={formId}
                  isInvalid={error !== null}
                >
                  <label className="edit-section-header" htmlFor={formId}>
                    {intl.formatMessage(messages['profile.position.label'])}
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id={formId}
                    name={formId}
                    value={position || ''}
                    onChange={this.handleChange}
                    maxLength="255"
                    disabled={!canEditContent}
                    readOnly={!canEditContent}
                  />
                  {error !== null && (
                    <Form.Control.Feedback hasIcon={false}>
                      {error}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <FormControls
                  visibilityId="visibilityPosition"
                  saveState={saveState}
                  visibility={visibilityPosition}
                  cancelHandler={this.handleClose}
                  changeHandler={this.handleChange}
                  showVisibilityOnly={!canEditContent}
                />
              </form>
            </div>
          ),
          editable: (
            <>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.position.label'])}
                showEditButton={isAuthenticatedUser}
                onClickEdit={this.handleOpen}
                showVisibility={visibilityPosition !== null}
                visibility={visibilityPosition}
              />
              <p data-hj-suppress className="h5">{position}</p>
            </>
          ),
          empty: (
            <>
              <EditableItemHeader content={intl.formatMessage(messages['profile.position.label'])} />
              <EmptyContent onClick={isAuthenticatedUser ? this.handleOpen : null}>
                {intl.formatMessage(messages['profile.position.empty'])}
              </EmptyContent>
            </>
          ),
          static: (
            <>
              <EditableItemHeader content={intl.formatMessage(messages['profile.position.label'])} />
              <p data-hj-suppress className="h5">{position}</p>
            </>
          ),
        }}
      />
    );
  }
}

Position.propTypes = {
  formId: PropTypes.string.isRequired,
  position: PropTypes.string,
  visibilityPosition: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  isAuthenticatedUserProfile: PropTypes.bool,
};

Position.defaultProps = {
  editMode: 'static',
  saveState: null,
  position: null,
  visibilityPosition: 'private',
  error: null,
  isAuthenticatedUserProfile: false,
};

const mapStateToProps = (state, ownProps) => ({
  ...editableFormSelector(state, ownProps),
  isAuthenticatedUserProfile: state.profilePage.isAuthenticatedUserProfile,
});

export default connect(
  mapStateToProps,
  {},
)(injectIntl(Position));