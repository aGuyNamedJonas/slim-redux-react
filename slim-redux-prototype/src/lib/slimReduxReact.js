import React from 'react';

function slimReduxReact(params) {
  const WrappedComponent = params.component;
  const changeTriggers = params.changeTriggers;

  return class extends React.Component {
    constructor(props){
      super(props);
    }

    render() {
      return <WrappedComponent {...this.props} {...changeTriggers} />
    }
  }
}

export default slimReduxReact;
