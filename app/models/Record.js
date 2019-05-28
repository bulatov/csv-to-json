module.exports = class Record {
  constructor(fields, values) {
    this.data = {};
    fields.forEach((field, i) => this.data[field] = values[i]);
  }
}
