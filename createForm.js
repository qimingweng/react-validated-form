import React from 'react';
import {Map} from 'immutable';
import ValidatingValue from './ValidatingValue';
import {getFirstErrorInMap} from './validation';
import Q from 'q';

const createForm = (setup) => (Component) => {
  // .values is required in setup
  // Discussion: in the future, a function might be allowed, like getValues,
  // that takes props as the first argument...

  return class DecoratedComponent extends React.Component {
    constructor(props) {
      // This needs to be in the constructor because we may want to fetch
      // default text values based on props
      super(props);

      const initialValues = Map(setup.values)
        .map((value, k) => {
          if (typeof value === 'function') {
            return new ValidatingValue(value(props));
          } else if (typeof value === 'object' && value !== null) {
            return new ValidatingValue(value);
          } else {
            throw new Error(`the value "${k}" must be either an object or a function`);
          }
        });

      this.state = {
        values: initialValues,
      };
    }
    render() {
      const getValueForKey = (key) => this.state.values.get(key);

      const changeValueForKey = (key) => (event) => {
        this.setState({
          values: this.state.values.setIn([key, 'text'], event.target.value).setIn([key, 'shouldValidate'], false),
        });
      };

      const checkForValidValues = () => {
        return Q.Promise((resolve, reject) => {
          const values = this.state.values.map(value => value.set('shouldValidate', true));
          const error = getFirstErrorInMap(values);

          // This sets the state of the `ValidatingValue`s to shouldValidate
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
};

export default createForm;
