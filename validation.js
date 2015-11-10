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

import ValidatingValue from './ValidatingValue';
import {reduce} from 'lodash';

const NO_ERROR = null;
const EMPTY_VALUE = null;

// Transforms takes strings and output values of any type
// However, no transform should output a null value, because that's really
// confusing for the defaults to handle
const transformFunctions = {
  number(string) {
    return Number(string);
  },
  gradeFloat(string) {
    if (string.length && string[string.length - 1] === '%') {
      string = string.slice(0, string.length - 1);
    }
    if (!string) return null;
    if (string === 'NM') return null;
    return Number(string) / 100;
  },
  multiplierNumber(string) {
    if (string.length > 0 && string[string.length - 1].toLowerCase() === 'x') {
      const slice = string.slice(0, string.length - 1);
      if (slice === '') return NaN;
      return Number(slice);
    } else {
      return Number(string);
    }
  },
  // percentageNumber(string) {
  //   if (string.length > 0 && string[string.length - 1] === '%') {
  //     const slice = string.slice(0, string.length - 1);
  //     if (slice === '') return NaN;
  //     return Number(slice) / 100;
  //   } else {
  //     return Number(string) / 100;
  //   }
  // },
};

// error functions take values and arguments and check to see if the value is valid
const errorFunctions = {
  /**
   * @param string {String}
   */
  isNumber(value) {
    if (typeof value !== 'number') return 'Not number';
    if (isNaN(value)) return 'Not number';
    return NO_ERROR;
  },
  /**
   * @param string {String}
   */
  max(string, count = 8) {
    if (string.length > count) return 'Max ' + count;
    return NO_ERROR;
  },
  /**
   * @param string {String}
   */
  min(string, count = 8) {
    if (string.length < count) return 'Min ' + count;
    return NO_ERROR;
  },
};

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
