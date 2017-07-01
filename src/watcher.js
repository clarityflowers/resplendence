class ResplendenceWatcher {
  constructor(wfs, files, processFile) {
    this.wfs = wfs;
    this.files = files;
    this.processFile = processFile;
  }

  watch(files, dirs, missing, startTime, options, callback, callbackUndelayed) {
    const ignored = file => this.files.includes(file);
    const allowed = file => !ignored(file);
    const ignoredFiles = files.filter(ignored);
    const allowedFiles = files.filter(allowed);
    if (ignoredFiles.length) {
      while (this.files.length) {
        this.files.pop();
      }
    }
    this.wfs.watch(allowedFiles, dirs, missing, startTime, options, (err, filesModified, dirsModified, missingModified, fileTimestamps, dirTimestamps) => {
      if(err) return callback(err);
      if (filesModified) {
        filesModified.forEach(this.processFile);
      }
      callback(err, filesModified, dirsModified, missingModified, fileTimestamps, dirTimestamps);
    }, (fileName, changeTime) => {
      callbackUndelayed(fileName, changeTime);
    });
  }
}

export default ResplendenceWatcher;