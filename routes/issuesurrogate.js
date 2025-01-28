const express = require('express');
const surrogatesample = require('../models/addsurrogate'); // Import the model
const surrogateSchema = require('../models/surrogacy');

const router = express.Router();

router.post('/find-matches-surrogate', async (req, res) => {
  try {
    const { bloodGroup, artBank } = req.body;

    if (!bloodGroup || !artBank) {
      return res.status(400).json({ message: 'bloodGroup and artBank are required.' });
    }

    // Query for matching records from the same ART bank
    const sameBankMatches = await surrogatesample.find({
      bloodGroup,
      source: artBank,
      issued:false
    });

    // Query for matching records from different ART banks
    const otherBankMatches = await surrogatesample.find({
      bloodGroup,
      issued:false,
      source: { $ne: artBank }, // Exclude the current ART bank
    });

    console.log("here1")
    // Construct response
    res.status(200).json({
      message: 'Matches retrieved successfully.',
      data: {
        sameBankMatches,
        otherBankMatches,
      },
    });
  } catch (error) {
    console.log("here2")
    console.error('Error finding matches:', error.message);
    res.status(500).json({
      message: 'Error while finding matches.',
      error: error.message,
    });
  }
});


router.post('/issue-surrogate-sample',async(req,res)=>{
  try{
    const {reqId,sampleId}=req.body;
    console.log(reqId);
    console.log(sampleId);
    const sample=await surrogatesample.findOne({_id:sampleId});
    const requisition=await surrogateSchema.findOne({_id:reqId});

    sample.issued=true;
    requisition.received=true;
    console.log("Hello");
    sample.issuedToRequest=reqId
    requisition.donorSampleId=sampleId;
    console.log("Hi");
    await sample.save();
    await requisition.save();

    res.status(200).json({message:"Surrogate issued"})
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(500).json({
      message: 'Failed to issue surrogate sample',
      error: error.message
    });
  }

})

router.get('/view-issued-surrogate', async (req, res) => {
  try {
    // Fetch all surrogate sample records from the database
    const surrogate = await surrogatesample.find({ issued: true });

    // Respond with the fetched records
    res.status(200).json({
      message: 'surrogate sample records retrieved successfully!',
      data: surrogate
    });
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(500).json({
      message: 'Failed to retrieve surrogate sample records',
      error: error.message
    });
  }
});

router.delete('/delete-surrogate-issued/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find and delete the surrogate sample record by ID
      const deletedsample = await surrogatesample.findByIdAndDelete(id);
  
      if (!deletedsample) {
        return res.status(404).json({ message: 'surrogate record not found' });
      }
  
      res.status(200).json({
        message: 'surrogate record deleted successfully!',
        data: deletedsample
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Failed to delete surrogate record', error: error.message });
    }
  });

module.exports = router;
