class ResplendenceWatcher {
  constructor(wfs, files, processFile) {
    this.wfs = wfs;
    this.files = files;
    this.processFile = processFile;
  }

  watch(files, dirs, missing, startTime, options, callback, callbackUndelayed) {
    this.wfs.watch(files, dirs, missing, startTime, options, (err, filesModified, dirsModified, missingModified, fileTimestamps, dirTimestamps) => {
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