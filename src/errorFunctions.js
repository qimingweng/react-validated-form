const NO_ERROR = null;

// error functions take values and arguments and check to see if the value is valid
const errorFunctions = {
  /**
   * @param string {string}
   * @returns {ErrorString?}
   */
  number: (value) => {
    if (typeof value !== 'number') return 'Not number';
    if (isNaN(value)) return 'Not number';
    return NO_ERROR;
  },
  /**
   * @param string {string}
   * @param count {number}
   * @returns {ErrorString?}
   */
  max: (string, count = 8) => {
    if (string.length > count) return 'Max ' + count;
    return NO_ERROR;
  },
  /**
   * @param string {string}
   * @param count {number}
   * @returns {ErrorString?}
   */
  min: (string, count = 8) => {
    if (string.length < count) return 'Min ' + count;
    return NO_ERROR;
  },
  /**
   * @param string {string}
   * @returns {ErrorString?}
   */
  email: (string) => {
    if (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(string)) {
      return NO_ERROR;
    }

    return 'Invalid email';
  },
};

if (typeof window != 'undefined') {
  window.__errorFunctions = errorFunctions;
}

export default errorFunctions;
