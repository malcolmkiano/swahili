const SWNumber = require('../../interpreter/types/number');
const sikiza = require('./sikiza');
const taka = require('./taka');

module.exports = {
  constants: {
    POTI_ASILI: new SWNumber(9000),
  },
  methods: [sikiza, taka],
};
