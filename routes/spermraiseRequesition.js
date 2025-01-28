// Import required modules
const express = require('express');
const Sperm = require('../models/sperm'); // Adjust the path as necessary

const router = express.Router();

// Route to add a new Sperm record
router.post('/add-sperm-details', async (req, res) => {
  try {
    const {
      bloodGroup,
      height,
      weight,
      eyeColor,
      skinColor,
      hairColor,
      artBank
      
    } = req.body;

    // Create a new Sperm document
    const newSperm = new Sperm({
      bloodGroup,
      height,
      weight,
      eyeColor,
      skinColor,
      hairColor,
      artBank
   
    });

    // Save the document to the database
    const savedSperm = await newSperm.save();

    // Respond with the saved document
    res.status(201).json({
      message: 'Sperm record added successfully!',
      data: savedSperm
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      message: 'Failed to add sperm record',
      error: error.message
    });
  }
});


router.get('/view-sperm-details', async (req, res) => {
  try {
    // Fetch all sperm records from the database
    const spermRecords = await Sperm.find();

    // Respond with the list of records
    res.status(200).json({
      message: 'Sperm records retrieved successfully!',
      data: spermRecords
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      message: 'Failed to retrieve sperm records',
      error: error.message
    });
  }
});

router.delete('/delete-sperm-details/:id', async (req, res) => {
  try {
    const spermId = req.params.id;

    // Delete the sperm record by ID
    const deletedSperm = await Sperm.findByIdAndDelete(spermId);

    if (!deletedSperm) {
      return res.status(404).json({
        message: 'Sperm record not found'
      });
    }

    // Respond with a success message
    res.status(200).json({
      message: 'Sperm record deleted successfully!',
      data: deletedSperm
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      message: 'Failed to delete sperm record',
      error: error.message
    });
  }
});

// Export the router
module.exports = router;
