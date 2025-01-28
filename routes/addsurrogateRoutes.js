const express = require('express');
const surrogte = require('../models/addsurrogate'); // Import the model

const router = express.Router();


router.post('/add-surrogate', async (req, res) => {
  try {
    console.log("hello");
    const {
      donorName,
      aadharNumber,
      bloodGroup,
      height,
      weight,
    
    } = req.body;

    // Validation to ensure all required fields are filled
    if (
      !donorName || !aadharNumber || 
       !bloodGroup || !height || !weight
    ) {
      return res.status(400).json({
        message: 'All fields are required.'
      });
    }
  console.log("hi");
    // Create a new surrogte  document
    const newsurrogte = new surrogte({
      donorName,
      aadharNumber,
      bloodGroup,
      height,
      weight,
      
    });

    // Save the document to the database
    const saved = await newsurrogte.save();

    // Success response
    res.status(201).json({
      message: 'surrogte  record added successfully!',
      data: saved
    });
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(500).json({
      message: 'Failed to add surrogte  record',
      error: error.message
    });
  }
});


router.get('/view-recruited-surrogate', async (req, res) => {
  try {
    // Fetch all surrogte  records from the database
    const surrogtes = await surrogte.find({ source: 'ART Bank 1' });

    // Respond with the fetched records
    res.status(200).json({
      message: 'surrogte  records retrieved successfully!',
      data: surrogtes
    });
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(500).json({
      message: 'Failed to retrieve surrogte  records',
      error: error.message
    });
  }
});

router.get('/view-surrogate-details/:id', async (req, res) => {
  try {
    // Fetch specific surrogte  records from the database
    const { id } = req.params;
    const surrogtes = await surrogte.findById(id);

    // Respond with the fetched records
    res.status(200).json({
      message: 'surrogate record retrieved successfully!',
      data: surrogtes
    });
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(500).json({
      message: 'Failed to retrieve surrogate record',
      error: error.message
    });
  }
});


router.delete('/delete-surrogate/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find and delete the surrogte  record by ID
      const deleted = await surrogte.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({ message: 'surrogte  record not found' });
      }
  
      res.status(200).json({
        message: 'surrogte  record deleted successfully!',
        data: deleted
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Failed to delete surrogte  record', error: error.message });
    }
  });

module.exports = router;
