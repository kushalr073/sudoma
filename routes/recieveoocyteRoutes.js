const express = require('express');
const OocyteSample = require('../models/addoocytedonor'); // Import the model

const router = express.Router();


router.post('/receive-Oocyte-sample', async (req, res) => {
  try {
    const {
      donorName,
      aadharNumber,
      collectionMethod,
      collectionPlace,
      sampleQuantity,
      collectionDate,
      storagePlace,
      expiryDate,
      source,
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
      !source || !bloodGroup || !height || !weight || !eyeColor || !skinColor || !hairColor
    ) {
      return res.status(400).json({
        message: 'All fields are required.'
      });
    }

    // Create a new Oocyte sample document
    const newOocyteSample = new OocyteSample({
      donorName,
      aadharNumber,
      collectionMethod,
      collectionPlace,
      sampleQuantity,
      collectionDate: new Date(collectionDate),
      storagePlace,
      expiryDate: new Date(expiryDate),
      source,
      bloodGroup,
      height,
      weight,
      eyeColor,
      skinColor,
      hairColor
    });

    // Save the document to the database
    const savedSample = await newOocyteSample.save();

    // Success response
    res.status(201).json({
      message: 'Oocyte sample record received successfully!',
      data: savedSample
    });
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(500).json({
      message: 'Failed to receive Oocyte sample record',
      error: error.message
    });
  }
});


router.get('/view-received-Oocyte-samples', async (req, res) => {
  try {
    // Fetch all Oocyte sample records from the database
    const OocyteSamples = await OocyteSample.find({ source: { $ne: 'ART Bank 1' } });


    // Respond with the fetched records
    res.status(200).json({
      message: 'Oocyte sample records retrieved successfully!',
      data: OocyteSamples
    });
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(500).json({
      message: 'Failed to retrieve Oocyte sample records',
      error: error.message
    });
  }
});

router.delete('/delete-Oocyte-recieved/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find and delete the Oocyte sample record by ID
      const deletedSample = await OocyteSample.findByIdAndDelete(id);
  
      if (!deletedSample) {
        return res.status(404).json({ message: 'Oocyte sample record not found' });
      }
  
      res.status(200).json({
        message: 'Oocyte sample record deleted successfully!',
        data: deletedSample
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Failed to delete Oocyte sample record', error: error.message });
    }
  });

  router.get('/view-Oocyte-samples', async (req, res) => {
    try {
      // Fetch all Oocyte sample records from the database
      const OocyteSamples = await OocyteSample.find();
  
  
      // Respond with the fetched records
      res.status(200).json({
        message: 'Oocyte sample records retrieved successfully!',
        data: OocyteSamples
      });
    } catch (error) {
      // Handle errors
      console.error(error.message);
      res.status(500).json({
        message: 'Failed to retrieve Oocyte sample records',
        error: error.message
      });
    }
  });

module.exports = router;
