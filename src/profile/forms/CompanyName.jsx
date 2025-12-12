import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';

import messages from './CompanyName.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { editableFormSelector } from '../data/selectors';

class CompanyName extends React.Component {
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
      formId, companyName, visibilityCompanyName, editMode, saveState, error, intl,
    } = this.props;

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
                    {intl.formatMessage(messages['profile.companyName.label'])}
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id={formId}
                    name={formId}
                    value={companyName || ''}
                    onChange={this.handleChange}
                    maxLength="255"
                  />
                  {error !== null && (
                    <Form.Control.Feedback hasIcon={false}>
                      {error}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <FormControls
                  visibilityId="visibilityCompanyName"
                  saveState={saveState}
                  visibility={visibilityCompanyName}
                  cancelHandler={this.handleClose}
                  changeHandler={this.handleChange}
                />
              </form>
            </div>
          ),
          editable: (
            <>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.companyName.label'])}
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibilityCompanyName !== null}
                visibility={visibilityCompanyName}
              />
              <p data-hj-suppress className="h5">{companyName}</p>
            </>
          ),
          empty: (
            <>
              <EditableItemHeader content={intl.formatMessage(messages['profile.companyName.label'])} />
              <EmptyContent onClick={this.handleOpen}>
                {intl.formatMessage(messages['profile.companyName.empty'])}
              </EmptyContent>
            </>
          ),
          static: (
            <>
              <EditableItemHeader content={intl.formatMessage(messages['profile.companyName.label'])} />
              <p data-hj-suppress className="h5">{companyName}</p>
            </>
          ),
        }}
      />
    );
  }
}

CompanyName.propTypes = {
  formId: PropTypes.string.isRequired,
  companyName: PropTypes.string,
  visibilityCompanyName: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

CompanyName.defaultProps = {
  editMode: 'static',
  saveState: null,
  companyName: null,
  visibilityCompanyName: 'private',
  error: null,
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(CompanyName));