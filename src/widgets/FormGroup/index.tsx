/**
 * FormGroup
 */
import React, { Component } from 'react';
import './index.less';

interface FormGroupProps {
  name: string;
  model: any;
}

class FormGroup extends Component<FormGroupProps> {
  render() {
    const { name, model, children } = this.props;
    return (
      <div className="form-group">
        <div className="form-group-label">
          <label>{name}</label>
          <small>{model}</small>
        </div>

        <div className="form-group-item">{children}</div>
      </div>
    );
  }
}

export default FormGroup;
