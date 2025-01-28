const express = require('express');
const surrogacy = require('../models/surrogacy'); // Adjust the path as necessary

const router = express.Router();

// Route to add a new Surrogacy record
router.post('/add-surrogacy-details', async (req, res) => {
  try {
    const { bloodGroup, height, weight,artBank } = req.body;

    // Create a new Surrogacy document
    const newSurrogacy = new surrogacy({
      bloodGroup,
      height,
      weight,
      artBank
    });

    // Save the document to the database
    const savedSurrogacy = await newSurrogacy.save();

    // Respond with the saved document
    res.status(201).json({
      message: 'Surrogacy record added successfully!',
      data: savedSurrogacy
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      message: 'Failed to add surrogacy record',
      error: error.message
    });
  }
});

// Route to view all Surrogacy records
router.get('/view-surrogacy-details', async (req, res) => {
  try {
    // Fetch all Surrogacy records from the database
    const surrogacyRecords = await surrogacy.find();

    // Respond with the fetched records
    res.status(200).json({
      message: 'Surrogacy records retrieved successfully!',
      data: surrogacyRecords
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      message: 'Failed to retrieve surrogacy records',
      error: error.message
    });
  }
});

// Route to delete a Surrogacy record by ID
router.delete('/delete-surrogacy-details/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the Surrogacy record by ID
    const deletedSurrogacy = await surrogacy.findByIdAndDelete(id);

    if (!deletedSurrogacy) {
      return res.status(404).json({
        message: 'Surrogacy record not found'
      });
    }

    // Respond with success message
    res.status(200).json({
      message: 'Surrogacy record deleted successfully!',
      data: deletedSurrogacy
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      message: 'Failed to delete surrogacy record',
      error: error.message
    });
  }
});

// Export the router
module.exports = router;
