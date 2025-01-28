const express = require('express');
const oocyteSample = require('../models/addoocytedonor'); // Import the model

const router = express.Router();


router.post('/add-oocyte-sample', async (req, res) => {
  try {
    console.log("hello");
    const {
      donorName,
      aadharNumber,
      collectionMethod,
      collectionPlace,
      sampleQuantity,
      collectionDate,
      storagePlace,
      expiryDate,
      bloodGroup,
      height,
      weight,
      eyeColor,
      skinColor,
      hairColor
    } = req.body;

    // Validation to ensure all required fields are filled
    if (
      !donorName || !aadharNumber || !collectionMethod || !collectionPlace ||
      !sampleQuantity || !collectionDate || !storagePlace || !expiryDate ||
       !bloodGroup || !height || !weight || !eyeColor || !skinColor || !hairColor
    ) {
      return res.status(400).json({
        message: 'All fields are required.'
      });
    }
  console.log("hi");
    // Create a new oocyte sample document
    const newoocyteSample = new oocyteSample({
      donorName,
      aadharNumber,
      collectionMethod,
      collectionPlace,
      sampleQuantity,
      collectionDate: new Date(collectionDate),
      storagePlace,
      expiryDate: new Date(expiryDate),
      bloodGroup,
      height,
      weight,
      eyeColor,
      skinColor,
      hairColor
    });

    // Save the document to the database
    const savedSample = await newoocyteSample.save();

    // Success response
    res.status(201).json({
      message: 'oocyte sample record added successfully!',
      data: savedSample
    });
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(500).json({
      message: 'Failed to add oocyte sample record',
      error: error.message
    });
  }
});


router.get('/view-recruited-oocyte-samples', async (req, res) => {
  try {
    // Fetch all oocyte sample records from the database
    const oocyteSamples = await oocyteSample.find({ source: 'ART Bank 1' });

    // Respond with the fetched records
    res.status(200).json({
      message: 'oocyte sample records retrieved successfully!',
      data: oocyteSamples
    });
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(500).json({
      message: 'Failed to retrieve oocyte sample records',
      error: error.message
    });
  }
});

router.delete('/delete-oocyte-sample/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find and delete the oocyte sample record by ID
      const deletedSample = await oocyteSample.findByIdAndDelete(id);
  
      if (!deletedSample) {
        return res.status(404).json({ message: 'oocyte sample record not found' });
      }
  
      res.status(200).json({
        message: 'oocyte sample record deleted successfully!',
        data: deletedSample
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Failed to delete oocyte sample record', error: error.message });
    }
  });

  router.get('/view-oocyte-donor-details/:id', async (req, res) => {
    try {
      // Fetch the Oocyte record from the database
      const { id } = req.params;
      const oocyteRecords = await oocyteSample.findById(id);
  
      // Respond with the fetched records
      res.status(200).json({
        message: 'Oocyte record retrieved successfully!',
        data: oocyteRecords
      });
    } catch (error) {
      // Handle errors
      res.status(500).json({
        message: 'Failed to retrieve oocyte record',
        error: error.message
      });
    }
  });

module.exports = router;
