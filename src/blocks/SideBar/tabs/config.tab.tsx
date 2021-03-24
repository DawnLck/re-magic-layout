/**
 * Tab - Config
 */
import React, { Component } from 'react';
import HighLight from 'react-highlight';

interface ConfigTabProp {
  data: string;
}
class ConfigTab extends Component<ConfigTabProp> {
  componentDidMount() {}
  render() {
    const { data } = this.props;
    return <HighLight language="json">{data}</HighLight>;
  }
}

export default ConfigTab;
