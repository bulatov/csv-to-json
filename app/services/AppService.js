const fs = require('fs');
const unzipper = require('unzipper');
const { promisify } = require('util');
const readline = require('readline');

const helper = require('../helper.js');
const Record = require('../models/Record.js');
const Structure = require('../models/Structure.js');
const StructureService = require('./StructureService.js');

module.exports = class AppService {
  constructor() {
    this.totalLinesProcessed = 0;
  }

  run(app) {
    this
    ._unzip(app.zipFile, app.config.tmpDir)
    .then((directory) => this._readDirectory(directory))
    .then((csvFiles) => this._parseAndTransformCsvFilesToJsonFile(csvFiles, app))

    .then(() => console.log('Done'))
    .catch((err) => console.log(err));
  }

  _unzip(zipFile, extractDirectory) {
    return new Promise((resolve, reject) => {
      fs.createReadStream(zipFile)
        .pipe(unzipper.Extract({ path: extractDirectory }))
        .on('finish', (err) => {
          return err ? reject(err) : resolve(extractDirectory);
        })
    });
  }

  _readDirectory(directory) {
    return promisify(fs.readdir)(directory);
  }

  _parseAndTransformCsvFilesToJsonFile(csvFiles, app) {
    const promises = csvFiles.map((csvFile) => {
      return this._parseAndTransformCsvFileToJsonFile(app.config.tmpDir + '/' + csvFile, app);
    });
    return Promise.resolve()
    .then(() => promisify(fs.writeFile)(app.outputFile, '['))
    .then(() => Promise.all(promises))
    .then(() => promisify(fs.appendFile)(app.outputFile, ']'));
  }

  _parseAndTransformCsvFileToJsonFile(csvFile, app) {
     const lineReader = readline.createInterface({
       input: fs.createReadStream(csvFile)
     });
     lineReader.lines = 0;


    return new Promise((resolve, reject) => {
      lineReader.on('line', (line) => {
        lineReader.lines++;
        this.totalLinesProcessed++;

        if (lineReader.lines === 1) {
          lineReader.fields = helper.parseValuesFromLine(line, app.config.delimeter);
          return;
        }

        if (app.config.linesLimit && lineReader.lines > app.config.linesLimit) {
          resolve();
          return;
        }

        const record = new Record(lineReader.fields, helper.parseValuesFromLine(line, app.config.delimeter));
        const obj = (new StructureService()).createObjectByStructureAndRecord(new Structure(require(app.structureFile)), record);
        let objJson = JSON.stringify(obj);
        if (this.totalLinesProcessed > 2) {
          objJson = ',' + objJson;
        }

        fs.appendFile(app.outputFile, objJson, (err) => {
          if (err) {
            reject(err);
          }
        });
      });

      lineReader.on('close', resolve);
    });
  }
}
