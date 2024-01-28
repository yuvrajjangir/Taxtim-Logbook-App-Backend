const express = require('express');
const StatsRouter = express.Router();
const {TripModel} = require('../model/tripmodel');
const {Expense} = require('../model/expensemodel');
const {LogbookStats} = require("../model/logbookstatsmodel");
const {verifyToken} = require("../middleware/verifytoken");

StatsRouter.get('/:year', verifyToken, async (req, res) => {
    try {
      const requestedYear = parseInt(req.params.year);
      const trips = await Trip.find({});
      const expenses = await Expense.find({});
      
      const tripYears = trips.map(trip => {
        const tripDate = new Date(trip.time);
        const year = tripDate.getFullYear();
        const month = tripDate.getMonth() + 1;
        return month < 3 ? year - 1 : year;
      });
      const expenseYears = expenses.map(expense => {
        const expenseDate = new Date(expense.time);
        const year = expenseDate.getFullYear();
        const month = expenseDate.getMonth() + 1;
        return month < 3 ? year - 1 : year;
      });
      
      const uniqueYears = [...new Set([...tripYears, ...expenseYears])];
      
      const logbookStats = [];
      
      for (const year of uniqueYears) {
        if (requestedYear && year !== requestedYear) {
          continue;
        }
        
        const fiscalYearStart = new Date(year, 2, 1); // March is month 2 (0-indexed)
        const fiscalYearEnd = new Date(year + 1, 1, 28); // February has 28 days
      
        const yearTrips = trips.filter(trip => {
          const tripDate = new Date(trip.time);
          return tripDate >= fiscalYearStart && tripDate <= fiscalYearEnd;
        });
      
        const yearExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.time);
          return expenseDate >= fiscalYearStart && expenseDate <= fiscalYearEnd;
        });
      
        const totalKilometers = yearTrips.reduce((total, trip) => total + (trip.arrivalOdometer - trip.departureOdometer), 0);
        const businessKilometers = yearTrips.reduce((total, trip) => total + (trip.arrivalOdometer - trip.departureOdometer), 0);
      
        const totalExpenseCost = yearExpenses.reduce((total, expense) => total + expense.cost, 0);
        const totalLitersBought = yearExpenses.reduce((total, expense) => total + expense.litresOfFuel, 0);
      
        let yearLogbookStats = await LogbookStats.findOne({ year });
      
        if (!yearLogbookStats) {
          yearLogbookStats = new LogbookStats({
            totalKilometers,
            businessKilometers,
            totalExpenseCost,
            totalLitersBought,
            year,
          });
          await yearLogbookStats.save();
        } else {
          yearLogbookStats.totalKilometers = totalKilometers;
          yearLogbookStats.businessKilometers = businessKilometers;
          yearLogbookStats.totalExpenseCost = totalExpenseCost;
          yearLogbookStats.totalLitersBought = totalLitersBought;
          await yearLogbookStats.save();
        }
      
        const { yearStats, ...statsWithoutYearStats } = yearLogbookStats.toObject(); // Remove yearStats
      
        logbookStats.push(statsWithoutYearStats);
      }
      
      return res.status(200).json(logbookStats);
      
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching logbook stats', error: error.message });
    }
  });
  

  
  
  
module.exports = {StatsRouter};