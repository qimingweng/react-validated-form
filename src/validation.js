// ValidatingValue
// .text: String
// .transform: String
// .required: Bool
// .validation: ValidationString, to be parsed by a validation parser
// .shouldValidate: Bool = false
//
// IDEA: add a default parameter?
// This is like how required is a special validation, default can be a special
// transform
//
// validate functions return either an error string or false for NO_ERROR for
// no errors

import transformFunctions from './transformFunctions';
import errorFunctions from './errorFunctions';
import {reduce} from 'lodash';

const NO_ERROR = null;
const EMPTY_VALUE = null;

const transformValidatingValue = (validatingValue) => {
  const text = validatingValue.text;
  const transform = validatingValue.transform;
  // Empty strings transform into EMPTY_VALUE
  if (!text) return EMPTY_VALUE;
  if (!transform) return text;
  return transformFunctions[transform](text);
};

const getErrorBasic = (value, validationRule) => {
  if (!validationRule) {
    return NO_ERROR;
  }

  if (typeof validationRule === 'function') {
    return validationRule(value);
  }

  const parse = validationRule.split(',');

  return reduce(parse, (memo, scheme) => {
    if (memo) return memo;
    const args = scheme.split(':');
    const fnName = args.shift();
    const error = errorFunctions[fnName](value, ...args);
    if (error) return error;
    return memo;
  }, NO_ERROR);
};

const getError = (validatingValue) => {
  if (!validatingValue.shouldValidate) {
    return NO_ERROR;
  }

  const testValue = transformValidatingValue(validatingValue);

  // Special case of required
  if (testValue === EMPTY_VALUE) {
    if (validatingValue.required) return 'Required';
    // No errors if field is not required
    return NO_ERROR;
  }

  return getErrorBasic(testValue, validatingValue.validation);
};

const getFirstErrorInMap = (mapOfValidatingValues) => {
  return mapOfValidatingValues.reduce((memo, value) => {
    if (memo) {
      return memo;
    }

    const error = getError(value);

    if (error) {
      return error;
    }

    return memo;
  }, NO_ERROR);
};

export default {
  getError,
  getFirstErrorInMap,
};
