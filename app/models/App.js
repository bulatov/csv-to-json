module.exports = class App {
  constructor(zipFile, outputFile, structureFile, config) {
    this.zipFile = zipFile;
    this.outputFile = outputFile;
    this.config = config;
    this.structureFile = structureFile;
  }
}
