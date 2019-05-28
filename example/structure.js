const moment = require('moment');

module.exports = {
  name: (record) => `${record['last_name']} ${record['first_name']}`,
  phone: (record) => record['phone'].replace(/[^\d]/g, ''),
  person: {
    firstName: (record) => record['first_name'],
    lastName: (record) => record['last_name']
  },
  amount: (record) => parseFloat(record['amount']),
  date: (record) => moment(record['date'], 'DD/MM/YYYY').format('YYYY-MM-DD'),
  costCenterNum: (record) => record['cc'].replace('ACN', '')
};
