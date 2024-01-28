const mongoose = require('mongoose');

const allowedReasons = ['Maintenance/repairs', 'Oil', 'Insurance', 'Licensing', 'Interest/finance changes'];
const expenseSchema = new mongoose.Schema({
  odometer: Number,
  cost: Number,
  time: String,
  reason: {
    type: String,
    enum: allowedReasons,
  },
  isFuel: Boolean,
  litresOfFuel: {
    type: Number,
    required: function() {
      return this.isFuel === true;
    },
},
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = {Expense};