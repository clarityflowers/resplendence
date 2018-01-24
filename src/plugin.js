import fs from 'fs';
import path from 'path';
import makeClassName from './make-classname';
import makeFileName from './make-filename';
import getImportName from './get-import-name';
import regex from './regex';
import watcher from './watcher';

class ResplendencePlugin {
  constructor(options) {
    this.files = [];
    this.first = true;
    this.src = options.src;
    this.ext = options.ext;
    this.processFile = this.processFile.bind(this);
    this.walkSync = this.walkSync.bind(this);
    this.processAll = this.processAll.bind(this);
    this.apply = this.apply.bind(this);
  }

  processFile(pathName, files) {
    if (/\.js$/.test(pathName)) {
      const file = fs.readFileSync(pathName, "utf8");
      const importName = getImportName(file);
      if (!importName) return;
      const re = regex(importName);
      let match = re.exec(file);
      const array = [];
      while (match !== null && match.length >= 2) {
        array.push({isComponent: !!match[1], level: parseInt(match[5]), css: match[6]});
        match = re.exec(file);
      }
      if (array.length) {
        let newFile = "";
        let count = 0;
        for (let i=0; i < array.length; i++)
        {
          const section = array[i];
          if (section.isComponent) {
            newFile += `.${makeClassName(pathName, count++, this.src)}`;
            if (section.level) {
              newFile += '._rx1';
            }
            newFile += ' {'
          }
          newFile += section.css;
          if (section.isComponent) {
            newFile += `}`;
          }
          newFile += `\n`;
        }
        const newName = makeFileName(this.src, pathName, this.ext);
        console.log(`Generating ${newName}`);
        if (!fs.existsSync(path.join(this.src, '.rx'))) {
          fs.mkdirSync(path.join(this.src, '.rx'));
        }
        fs.writeFileSync(newName, newFile, 'utf8');
        if (files) {
          // files.push(newName);
        }
      }
    }
  }

  walkSync(dir, action) {
      if (!fs.lstatSync(dir).isDirectory()) {
        action(dir);
      }  
      else {
        fs.readdirSync(dir).map(f => this.walkSync(path.join(dir, f), action)); // `join("\n")`
      }
  }

  processAll(files) {
    const generatedFolder = path.join(this.src, '.rx'); 
    if (fs.existsSync(generatedFolder)) {
      const fileList = [];
      this.walkSync(generatedFolder, file => fileList.push(file));
      fileList.forEach(file => fs.unlinkSync(file));
    }
    this.walkSync(this.src, file => this.processFile(file, files));
  }

  apply(compiler) {
    compiler.plugin('after-environment', () => {
      compiler.watchFileSystem = new watcher(compiler.watchFileSystem, this.files, this.processFile);
    });

    compiler.plugin('entry-option', () => {
      this.processAll(this.files);
    });

    compiler.plugin('done', (stats) => {
      // if (this.once) {
      //   while (this.files.length) {
      //     const file = this.files.pop();
      //     fs.unlinkSync(file);
      //   }
      // }
    });
  }
}

export default ResplendencePlugin;