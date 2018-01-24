import path from 'path';
import hash from './hash';

const makeFileName = (src, pathName, ext) => {
    return path.join(src, '.rx', hash(pathName, src) + '.g' + ext);
}

export default makeFileName;