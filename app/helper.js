module.exports = {
  parseValuesFromLine: function (line, delimeter) {
    return line.split(delimeter).map((field) => field.replace(/(^")|("$)/g, ''));
  }
};
