import React from 'react';
import {Map} from 'immutable';
import ValidatingValue from './ValidatingValue';
import {getFirstErrorInMap} from './validation';
import Q from 'q';

const createForm = (setup) => (Component) => {
  // .values is required in setup
  // Discussion: in the future, a function might be allowed, like getValues,
  // that takes props as the first argument...

  const initialValues = Map(setup.values)
    .map(value => new ValidatingValue(value));

  return class DecoratedComponent extends React.Component {
    state = {
      values: initialValues,
    }
    render() {
      const getValueForKey = (key) => {
        return this.state.values.get(key);
      };

      const changeValueForKey = (key) => (event) => {
        this.setState({
          values: this.state.values.setIn([key, 'text'], event.target.value).setIn([key, 'shouldValidate'], false),
        });
      };

      const checkForValidValues = () => {
        return Q.Promise((resolve, reject) => {
          const values = this.state.values.map(value => value.set('shouldValidate', true));
          const error = getFirstErrorInMap(values);

          this.setState({
            values,
          }, () => {
            if (error) {
              reject(error);
            } else {
              resolve(this.state.values.map(value => value.text));
            }
          });
        });
      };

      return <Component
        {...this.props}
        checkForValidValues={checkForValidValues}
        getValueForKey={getValueForKey}
        changeValueForKey={changeValueForKey}
      />;
    }
  }
}

export default createForm;
