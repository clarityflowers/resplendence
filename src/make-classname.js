import hash from './hash';

const makeStyledClassName = function(string, index) {
  return `resplendent-${hash(string)}-${index}`;
};

export default makeStyledClassName;