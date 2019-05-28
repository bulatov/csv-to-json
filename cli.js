const minimist = require('minimist');

const App = require('./app/models/App.js');
const AppService = require('./app/services/AppService.js');
const config = require('./config.json');

const argv = minimist(process.argv.slice(2));

if (!argv[config.cli.zip]) {
  console.log('Missing required --zip parameter');
} else if (!argv[config.cli.output]) {
  console.log('Missing required --output parameter');
} else if (!argv[config.cli.structure]) {
  console.log('Missing required --structure parameter');
} else {
  const app = new App(argv[config.cli.zip], argv[config.cli.output], argv[config.cli.structure], config);
  (new AppService()).run(app);
}
