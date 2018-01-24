import hash from './hash';

const makeStyledClassName = function(string, index, src) {
  return `rx_${hash(string, src)}-${index}`;
};

export default makeStyledClassName;