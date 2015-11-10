import React, {PropTypes} from 'react';
import {getError} from './validation';

export default class FormInput extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.object, // a ValidatingValue
  }
  render() {
    const {
      props: {
        onChange,
        value,
        ...rest,
      },
    } = this;

    const error = getError(value);

    return <div
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <input {...rest} value={value.text} onChange={onChange}/>
      {
        error &&
        <div
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            color: 'red',
          }}
        >
          {error}
        </div>
      }
    </div>;
  }
}
