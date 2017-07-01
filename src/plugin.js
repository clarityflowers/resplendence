import fs from 'fs';
import path from 'path';
import makeClassName from './make-classname';
import makeFileName from './make-filename';
import getImportName from './get-import-name';
import regex from './regex';

function ResplendencePlugin(options) {
  this.files = [];
  this.first = true;
  this.src = options.src;
  this.ext = options.ext;

  this.processFile = (pathName, files) => {
    if (/\.js$/.test(pathName)) {
      const file = fs.readFileSync(pathName, "utf8");
      const importName = getImportName(file);
      if (!importName) return;
      const re = regex(importName);
      let match = re.exec(file);
      const array = [];
      while (match !== null && match.length >= 2) {
        array.push({isComponent: !!match[1], css: match[3]});
        match = re.exec(file);
      }
      if (array.length) {
        let newFile = "";
        let count = 0;
        for (let i=0; i < array.length; i++)
        {
          const section = array[i];
          if (section.isComponent) {
            newFile += `.${makeClassName(pathName, count++)} {`;
          }
          newFile += section.css;
          if (section.isComponent) {
            newFile += `}`;
          }
          newFile += `\n`;
        }
        const newName = makeFileName(this.src, pathName, this.ext);
        console.log(`Generating ${newName}`);
        if (!fs.existsSync(path.join(this.src, '.generated'))) {
          fs.mkdirSync(path.join(this.src, '.generated'));
        }
        fs.writeFileSync(newName, newFile, 'utf8');
        if (files) {
          files.push(newName);
        }
      }
    }
  }

  const processFile = this.processFile;

  this.walkSync = (dir, action) => {
      if (!fs.lstatSync(dir).isDirectory()) {
        action(dir);
      }  
      else {
        fs.readdirSync(dir).map(f => this.walkSync(path.join(dir, f), action)); // `join("\n")`
      }
  }

  this.processAll = (files) => {
    this.walkSync(path.join(this.src), file => this.processFile(file, files));
  }

  this.watcher = class ResplendenceWatcher {
    constructor(wfs, files, deletedFiles) {
      this.wfs = wfs;
      this.files = files;
      this.deletedFiles = deletedFiles;
    }

    watch(files, dirs, missing, startTime, options, callback, callbackUndelayed) {
      const ignored = file => this.files.includes(file);
      const allowed = file => !ignored(file);
      const ignoredFiles = files.filter(ignored);
      const allowedFiles = files.filter(allowed);
      while (this.files.length) {
        this.files.pop();
      }
      this.wfs.watch(allowedFiles, dirs, missing, startTime, options, (err, filesModified, dirsModified, missingModified, fileTimestamps, dirTimestamps) => {
        if(err) return callback(err);
        if (filesModified) {
          filesModified.forEach(processFile);
        }
        callback(err, filesModified, dirsModified, missingModified, fileTimestamps, dirTimestamps);
      }, (fileName, changeTime) => {
        callbackUndelayed(fileName, changeTime);
      });
    }
  }
}



ResplendencePlugin.prototype.apply = function(compiler) {

  compiler.plugin('after-environment', () => {
    compiler.watchFileSystem = new this.watcher(compiler.watchFileSystem, this.files, this.deletedFiles);
  });

  compiler.plugin('entry-option', () => {
    this.processAll(this.files);
  });

  compiler.plugin('done', (stats) => {
    if (this.once) {
      while (this.files.length) {
        const file = this.files.pop();
        fs.unlinkSync(file);
      }
    }
  })
};

export default ResplendencePlugin;