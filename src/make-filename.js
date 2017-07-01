import path from 'path';
import hash from './hash';

const makeFileName = (src, pathName, ext) => {
    return path.join(src, '.generated', 'resplendent-' + hash(pathName) + '.g' + ext);
}

export default makeFileName;