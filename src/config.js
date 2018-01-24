import Plugin from './plugin';
import path from 'path';

const loader = path.resolve('./loader.js');

function config({src, ext = '.css'}) {
  return {
    plugin: new Plugin({src, ext}),
    loader: {
      loader,
      options: {src, ext}
    }
  }
}

export default config;