const express = require('express');
const SpermSample = require('../models/addsperm'); // Import the model

const router = express.Router();


router.post('/receive-sperm-sample', async (req, res) => {
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

    // Create a new sperm sample document
    const newSpermSample = new SpermSample({
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
    const savedSample = await newSpermSample.save();

    // Success response
    res.status(201).json({
      message: 'Sperm sample record received successfully!',
      data: savedSample
    });
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(500).json({
      message: 'Failed to receive sperm sample record',
      error: error.message
    });
  }
});


router.get('/view-received-sperm-samples', async (req, res) => {
  try {
    // Fetch all sperm sample records from the database
    const spermSamples = await SpermSample.find({ source: { $ne: 'self' } });


    // Respond with the fetched records
    res.status(200).json({
      message: 'Sperm sample records retrieved successfully!',
      data: spermSamples
    });
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(500).json({
      message: 'Failed to retrieve sperm sample records',
      error: error.message
    });
  }
});


module.exports = router;
