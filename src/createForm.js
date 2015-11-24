import React from 'react';
import {Map, Set} from 'immutable';
import ValidatingValue from './ValidatingValue';
import {getFirstErrorInMap, transformValidatingValue} from './validation';
import Q from 'q';

/**
 * createForm injects a few things into the component to be decorated
 */
const createForm = (setup) => (Component) => {
  // .values is required in setup
  // Discussion: in the future, a function might be allowed, like getValues,
  // that takes props as the first argument...

  return class DecoratedComponent extends React.Component {
    static displayName = `Form(${Component.displayName})`
    constructor(props) {
      // This needs to be in the constructor because we may want to fetch
      // default text values based on props
      super(props);

      const initialValues = Map(setup.values).map((value, k) => {
        if (typeof value === 'function') {
          return new ValidatingValue(value(props));
        } else if (typeof value === 'object' && value !== null) {
          return new ValidatingValue(value);
        }

        throw new Error(`the value "${k}" must be either an object or a function that returns an object`);
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

      const checkForValidValues = (keys = Set()) => {
        return Q.Promise((resolve, reject) => {
          const values = this.state.values.map(value => value.set('shouldValidate', true));

          const valuesToCheck = keys.count() ?
            values.filter((_, k) => keys.has(k)) :
            values;

          const error = getFirstErrorInMap(valuesToCheck);

          // This sets the state of the `ValidatingValue`s to shouldValidate
          this.setState({
            values,
          }, () => {
            if (error) {
              reject(error);
            } else {
              resolve(valuesToCheck.map(value => transformValidatingValue(value)));
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
  };
};

export default createForm;
