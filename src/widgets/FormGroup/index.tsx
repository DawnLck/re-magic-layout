/**
 * FormGroup
 */
import React, { Component } from 'react';
import { classNames } from '@/utils';

import './index.less';

interface FormGroupProps {
  name: string;
  model?: any;
  isInline?: boolean;
}

class FormGroup extends Component<FormGroupProps> {
  static defaultProps = { isInline: false };
  render() {
    const { name, model, children, isInline } = this.props;
    return (
      <div className={classNames({ 'form-group': true, inline: isInline })}>
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
