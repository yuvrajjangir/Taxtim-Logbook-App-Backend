const express = require('express');
const Expenserouter = express.Router();
const {Expense} = require('../model/expensemodel');



// Create a new expense
Expenserouter.post('/', async (req, res) => {
    try {
      const {
        odometer,
        cost,
        time,
        reason,
        isFuel,
        litresOfFuel,
      } = req.body;
  
      const newExpense = new Expense({
        odometer,
        cost,
        time,
        reason,
        isFuel,
        litresOfFuel,
      });
  
      await newExpense.save();
      res.status(201).json(newExpense);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get all expenses
  Expenserouter.get('/', async (req, res) => {
    try {
      const expenses = await Expense.find();
      res.status(200).json(expenses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get a specific expense by ID
  Expenserouter.get('/:id', async (req, res) => {
    try {
      const expense = await Expense.findById(req.params.id);
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
      res.status(200).json(expense);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Update an expense by ID
  Expenserouter.put('/:id', async (req, res) => {
    try {
      const { odometer, cost, time, reason, isFuel, litresOfFuel } = req.body;
  
      const expense = await Expense.findById(req.params.id);
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
  
      expense.odometer = odometer;
      expense.cost = cost;
      expense.time = time;
      expense.reason = reason;
      expense.isFuel = isFuel;
      expense.litresOfFuel = litresOfFuel;
  
      await expense.save();
      res.status(200).json(expense);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Delete an expense by ID
  Expenserouter.delete('/:id', async (req, res) => {
    try {
      const deletedexpense = await Expense.findByIdAndDelete(req.params.id);
      if (!deletedexpense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
      res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  
  module.exports =  {Expenserouter};