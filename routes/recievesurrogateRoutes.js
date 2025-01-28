const express = require('express');
const surrogte = require('../models/addsurrogate'); // Import the model
const surrogacy=require('../models/surrogacy');
const router = express.Router();


router.post('/add-recieved-surrogate', async (req, res) => {
  try {
    console.log("hello");
    const {
      donorName,
      aadharNumber,
      bloodGroup,
      height,
      weight,
      source
    
    } = req.body;

    // Validation to ensure all required fields are filled
    if (
      !donorName || !aadharNumber || 
       !bloodGroup || !height || !weight || !source
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
      source
      
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

router.get('/get-surrogate-requisitions',async(req,res)=>{
  try{
    const response=await surrogacy.find({received:false});
    console.log(response);
    res.status(200).json({
      message:"retrived successfully",
      data:response
    })
  }
  catch(error){
    res.status(500).json({
      message:'Failed to retrive surrogate records',
      error:error.message
    })
  }
})

router.get('/view-recieved-surrogate', async (req, res) => {
  try {
    // Fetch all surrogte  records from the database
    const surrogtes = await surrogte.find({ source: { $ne: 'ART bank 1' } });

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

router.get('/view-surrogate-samples', async (req, res) => {
  try {
    // Fetch all surrogte  records from the database
    const surrogtes = await surrogte.find();

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

router.delete('/delete-recieved-surrogte/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find and delete the surrogte  record by ID
      const deleted = await surrogte.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({ message: 'surrogate  record not found' });
      }
  
      res.status(200).json({
        message: 'surrogate  record deleted successfully!',
        data: deleted
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Failed to delete surrogate  record', error: error.message });
    }
  });

module.exports = router;
