import {Record} from 'immutable';

const ValidatingValue = Record({
  text: '',
  required: false,
  transform: null,
  validation: null,
  shouldValidate: false,
});

export default ValidatingValue;
