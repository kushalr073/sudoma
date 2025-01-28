const express = require('express');
const OocyteSample = require('../models/addoocytedonor'); // Import the model
const OocyteSchema = require('../models/oocyte');

const router = express.Router();

router.post('/find-matches-oocyte', async (req, res) => {
  try {
    const { bloodGroup, artBank } = req.body;

    if (!bloodGroup || !artBank) {
      return res.status(400).json({ message: 'bloodGroup and artBank are required.' });
    }

    // Query for matching records from the same ART bank where `issued` is false
    const sameBankMatches = await OocyteSample.find({
      bloodGroup,
      source: artBank,
      issued: false, // Ensure the sample is not issued
    });

    // Query for matching records from different ART banks where `issued` is false
    const otherBankMatches = await OocyteSample.find({
      bloodGroup,
      source: { $ne: artBank }, // Exclude the current ART bank
      issued: false, // Ensure the sample is not issued
    });

    console.log('Matches retrieved successfully.');

    // Construct response
    res.status(200).json({
      message: 'Matches retrieved successfully.',
      data: {
        sameBankMatches,
        otherBankMatches,
      },
    });
  } catch (error) {
    console.error('Error finding matches:', error.message);
    res.status(500).json({
      message: 'Error while finding matches.',
      error: error.message,
    });
  }
});



router.post('/issue-oocyte-sample',async(req,res)=>{
  try{
    const {reqId,sampleId}=req.body;
    console.log(reqId);
    console.log(sampleId);
    const sample=await OocyteSample.findOne({_id:sampleId});
    const requisition=await OocyteSchema.findOne({_id:reqId});

    sample.issued=true;
    requisition.received=true;
    console.log("Hello");
    sample.issuedToRequest=reqId
    requisition.donorSampleId=sampleId;
    console.log("Hi");
    await sample.save();
    await requisition.save();

    res.status(200).json({message:"Donor issued"})
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(500).json({
      message: 'Failed to issue Oocyte sample',
      error: error.message
    });
  }

})

router.get('/view-issued-Oocyte-samples', async (req, res) => {
  try {
    // Fetch all Oocyte sample records from the database
    const OocyteSamples = await OocyteSample.find({ issued: true });

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

router.delete('/delete-Oocyte-issued/:id', async (req, res) => {
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

module.exports = router;
