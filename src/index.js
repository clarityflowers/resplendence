import Plugin from './plugin';
import rx from './resplendent';
const loader = require.resolve('./loader');

export const config = ({src, ext}) => {
  return {
    plugin: new Plugin({src, ext}),
    loader: {
      loader: loader,
      options: {src, ext}
    }
  }
}

export default rx;
  