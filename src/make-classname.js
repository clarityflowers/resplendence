import hash from './hash';

const makeStyledClassName = function(string, index) {
  return `styled-${hash(string)}-${index}`;
};

export default makeStyledClassName;