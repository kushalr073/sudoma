const express = require('express');
const SpermSample = require('../models/addsperm'); // Import the model

const router = express.Router();

router.post('/find-matches-sperm', async (req, res) => {
  try {
    // Extract matching criteria from request body
    const {
      bloodGroup,
      height, // Height in cm
      weight, // Weight in kg
      eyeColor,
      hairColor,
      skinColor,
      artBank,
    } = req.body;

    // Convert height and weight to numbers
    const numericHeight = Number(height); // Height in cm
    const numericWeight = Number(weight); // Weight in kg

    // Check for valid height and weight inputs
    if (!numericHeight || !numericWeight || numericHeight <= 0 || numericWeight <= 0) {
      return res.status(400).json({ message: 'Invalid height or weight provided.' });
    }

    // Define ranges for height and weight ±10
    const minHeight = numericHeight - 10;
    const maxHeight = numericHeight + 10;
    const minWeight = numericWeight - 10;
    const maxWeight = numericWeight + 10;

    console.log(
      `Height Range: ${minHeight} - ${maxHeight}, Weight Range: ${minWeight} - ${maxWeight}`
    );

    // Build query to find matching samples
    const query = {
      bloodGroup,
      height: { $gte: minHeight, $lte: maxHeight }, // Height range ±10
      weight: { $gte: minWeight, $lte: maxWeight }, // Weight range ±10
      eyeColor,
      hairColor,
      skinColor,
      source: artBank,
      issued:false
    };

    // Query the database for matching samples
    const matchedSamples = await SpermSample.find(query);

    console.log('Matched Samples:', matchedSamples);

    if (matchedSamples.length > 0) {
      // If matches are found
      return res.status(200).json({
        message: 'Match Found',
        data: matchedSamples,
      });
    } else {
      // If no matches are found
      return res.status(404).json({
        message: 'No Match Found',
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      message: 'Error while finding matches',
      error: error.message,
    });
  }
});


router.post('/add-sperm-sample', async (req, res) => {
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
      message: 'Sperm sample record added successfully!',
      data: savedSample
    });
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(500).json({
      message: 'Failed to add sperm sample record',
      error: error.message
    });
  }
});

router.get('/view-sperm-samples', async (req, res) => {
  try {
    // Fetch all sperm sample records from the database
    const spermSamples = await SpermSample.find();

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

router.get('/view-sample-details/:id', async (req, res) => {
  try {
    // Fetch specific sperm sample records from the database
    const { id } = req.params;
    const spermSample = await SpermSample.findById(id);

    // Respond with the fetched records
    res.status(200).json({
      message: 'Sperm sample record retrieved successfully!',
      data: spermSample
    });
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(500).json({
      message: 'Failed to retrieve sperm sample',
      error: error.message
    });
  }
});

router.get('/view-collected-sperm-samples', async (req, res) => {
  try {
    // Fetch all sperm sample records from the database
    const spermSamples = await SpermSample.find({ source: 'self' });

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

router.delete('/delete-sperm-sample/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find and delete the sperm sample record by ID
      const deletedSample = await SpermSample.findByIdAndDelete(id);
  
      if (!deletedSample) {
        return res.status(404).json({ message: 'Sperm sample record not found' });
      }
  
      res.status(200).json({
        message: 'Sperm sample record deleted successfully!',
        data: deletedSample
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Failed to delete sperm sample record', error: error.message });
    }
  });

module.exports = router;
