import Plugin from './plugin';
import rx from './resplendent';
const loader = require.resolve('./loader');

export const config = ({src, ext}) => {
  if (ext === undefined) ext = '.css'; 
  return {
    plugin: new Plugin({src, ext}),
    loader: {
      loader: loader,
      options: {src, ext}
    }
  }
}

export default rx;
  