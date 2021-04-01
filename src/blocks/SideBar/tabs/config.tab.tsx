/**
 * Tab - Config
 */
import React, { Component } from 'react';
import HighLight from 'react-highlight';

interface ConfigTabProp {
  data: any;
}
class ConfigTab extends Component<ConfigTabProp> {
  componentDidMount() {}
  render() {
    const { data } = this.props;
    return (
      <HighLight language="json">{JSON.stringify(data, null, 2)}</HighLight>
    );
  }
}

export default ConfigTab;
