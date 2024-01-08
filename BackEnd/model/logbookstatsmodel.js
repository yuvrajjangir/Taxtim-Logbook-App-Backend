const mongoose = require('mongoose');

const logbookStatsSchema = new mongoose.Schema({
  totalKilometers: {
    type: Number,
    default: 0,
  },
  businessKilometers: {
    type: Number,
    default: 0,
  },
  totalExpenseCost: {
    type: Number,
    default: 0,
  },
  totalLitersBought: {
    type: Number,
    default: 0,
  },
  year: {
    type: Number,
    required: true,
  },
  // Add any other fields related to logbook stats if needed
});

const LogbookStats = mongoose.model('LogbookStats', logbookStatsSchema);

module.exports = LogbookStats;
