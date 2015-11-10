// Transforms takes strings and output values of any type
// However, no transform should output a null value, because that's really
// confusing for the defaults to handle
const transformFunctions = {
  number: (string) => {
    return Number(string);
  },
  // Transforms '95.5%' => 0.955
  gradeFloat: (string) => {
    if (string.length && string[string.length - 1] === '%') {
      string = string.slice(0, string.length - 1);
    }
    if (!string) return null;
    if (string === 'NM') return null;
    return Number(string) / 100;
  },
  // Transforms '2x' => 2
  multiplierNumber: (string) => {
    if (string.length > 0 && string[string.length - 1].toLowerCase() === 'x') {
      const slice = string.slice(0, string.length - 1);
      if (slice === '') return NaN;
      return Number(slice);
    } else {
      return Number(string);
    }
  },
};

export default transformFunctions;
