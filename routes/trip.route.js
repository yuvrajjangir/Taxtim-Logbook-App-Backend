const express = require('express');
const {Router} = require("express");
const triprouter = Router();
const Trip = require('../model/Tripmodel');



// GET all trips
triprouter.get('/', async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

triprouter.get('/:id', async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.id);
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      res.json(trip);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// POST a new trip
triprouter.post('/', async (req, res) => {
    const { departureOdometer, arrivalOdometer } = req.body;

    // Calculate distance
    const distance = arrivalOdometer - departureOdometer;
  
    const trip = new Trip({
      departureOdometer,
      arrivalOdometer,
      distance, // Save the calculated distance
      reason: req.body.reason,
      time: req.body.time,
      leavingFrom: req.body.leavingFrom, 
      goingTo: req.body.goingTo,
    });
  
    try {
      const newTrip = await trip.save();
      res.status(201).json(newTrip);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

// UPDATE a trip
triprouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { departureOdometer, arrivalOdometer } = req.body;
  
    try {
      // Calculate distance
      const distance = arrivalOdometer - departureOdometer;
  
      const updatedTrip = await Trip.findByIdAndUpdate(id, { ...req.body, distance }, { new: true });
      res.json(updatedTrip);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
// DELETE a trip
triprouter.delete('/:id', async (req, res) => {
    try {
      const deletedTrip = await Trip.findByIdAndDelete(req.params.id);
      if (!deletedTrip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      res.status(200).json({ message: 'Trip deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting trip' });
    }
  });

module.exports = {triprouter};
