import React, {PropTypes} from 'react';

const ENTER = 13;

export default class Form extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onEnterDown: PropTypes.func, // handle enter key down
  }
  handleKeyUp = (event) => {
    if (event.keyCode === ENTER &&
        event.target.type !== 'textarea') {
      event.preventDefault();
      return this.props.onSubmit && this.props.onSubmit();
    }
  }
  handleKeyDown = (event) => {
    if (event.keyCode === ENTER &&
        event.target.type !== 'textarea') {
      event.preventDefault();
      return this.props.onEnterDown && this.props.onEnterDown();
    }
  }
  render() {
    const {
      props: {
        onSubmit, // not used because it is just removed from the rest
        ...rest,
      },
    } = this;

    return <form
      {...rest}
      onKeyUp={this.handleKeyUp}
      onKeyDown={this.handleKeyDown}
    />;
  }
}
