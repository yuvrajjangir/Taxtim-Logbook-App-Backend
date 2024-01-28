const express = require('express');
const LocationRouter = express.Router();
const {Person} = require('../model/locationmodel');


// Create a new person
LocationRouter.post('/', async (req, res) => {
    try {
      const { name, address } = req.body;
      const newPerson = new Person({ name, address });
      const savedPerson = await newPerson.save();
      res.status(201).json(savedPerson);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Get all persons
  LocationRouter.get('/', async (req, res) => {
    try {
      const persons = await Person.find();
      res.json(persons);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Get a specific person by ID
  LocationRouter.get('/:id', async (req, res) => {
    try {
      const person = await Person.findById(req.params.id);
      if (!person) {
        return res.status(404).json({ message: 'Person not found' });
      }
      res.json(person);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Update a person by ID
  LocationRouter.put('/:id', async (req, res) => {
    try {
      const { name, address } = req.body;
      const updatedPerson = await Person.findByIdAndUpdate(
        req.params.id,
        { name, address },
        { new: true }
      );
      res.json(updatedPerson);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Delete a person by ID
  LocationRouter.delete('/:id', async (req, res) => {
    try {
      const deletedPerson = await Person.findByIdAndDelete(req.params.id);
      if (!deletedPerson) {
        return res.status(404).json({ message: 'Person not found' });
      }
      res.status(200).json({ message: 'Person deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting person' });
    }
  });


  module.exports = {LocationRouter};
