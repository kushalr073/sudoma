const express = require('express');
const oocyte = require('../models/oocyte'); // Adjust the path as necessary

const router = express.Router();


// Route to add a new Oocyte record
router.post('/add-oocyte-details', async (req, res) => {
  try {
    const {
      bloodGroup,
      height,
      weight,
      eyeColor,
      skinColor,
      hairColor,
      state,
      artBank,
    } = req.body;

    // Log the received request body for debugging
    console.log("Request Body:", req.body);

    // Create a new Oocyte document
    const newOocyte = new oocyte({
      bloodGroup,
      height,
      weight,
      eyeColor,
      skinColor,
      hairColor,
      state,
      artBank,
      // BMI will be calculated automatically based on the schema's default function
    });

    // Save the document to the database
    const savedOocyte = await newOocyte.save();

    // Respond with the saved document
    res.status(201).json({
      message: 'Oocyte record added successfully!',
      data: savedOocyte,
    });
  } catch (error) {
    console.error("Error saving oocyte record:", error.message); // Log the error for debugging
    // Handle errors
    res.status(500).json({
      message: 'Failed to add oocyte record',
      error: error.message,
    });
  }
});



router.get('/view-oocyte-details', async (req, res) => {
    try {
      // Fetch all Oocyte records from the database
      const oocyteRecords = await oocyte.find();
  
      // Respond with the fetched records
      res.status(200).json({
        message: 'Oocyte records retrieved successfully!',
        data: oocyteRecords
      });
    } catch (error) {
      // Handle errors
      res.status(500).json({
        message: 'Failed to retrieve oocyte records',
        error: error.message
      });
    }
  });
  


  // Route to delete an Oocyte record by ID
  router.delete('/delete-oocyte-details/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find and delete the Oocyte record by ID
      const deletedOocyte = await oocyte.findByIdAndDelete(id);
  
      if (!deletedOocyte) {
        return res.status(404).json({
          message: 'Oocyte record not found'
        });
      }
  
      // Respond with success message
      res.status(200).json({
        message: 'Oocyte record deleted successfully!',
        data: deletedOocyte
      });
    } catch (error) {
      // Handle errors
      res.status(500).json({
        message: 'Failed to delete oocyte record',
        error: error.message
      });
    }
  });
  
  // Export the router
  module.exports = router;

// Export the router
module.exports = router;
