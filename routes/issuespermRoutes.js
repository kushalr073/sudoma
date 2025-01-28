const express = require('express');
const SpermSample = require('../models/addsperm'); // Import the model
const SpermSchema = require('../models/sperm');

const router = express.Router();

router.post('/issue-sperm-sample',async(req,res)=>{
  try{
    const {reqId,sampleId}=req.body;
    console.log(reqId);
    console.log(sampleId);
    const sample=await SpermSample.findOne({_id:sampleId});
    const requisition=await SpermSchema.findOne({_id:reqId});

    sample.issued=true;
    requisition.received=true;
    console.log("Hello");
    sample.issuedToRequest=reqId
    requisition.spermSampleId=sampleId;
    console.log("Hi");
    await sample.save();
    await requisition.save();

    res.status(200).json({message:"Sample issued"})
  } catch (error) {
    // Handle errors
    console.error(error.message);
    res.status(500).json({
      message: 'Failed to issue sperm sample',
      error: error.message
    });
  }

})

router.get('/view-issued-sperm-samples', async (req, res) => {
  try {
    // Fetch all sperm sample records from the database
    const spermSamples = await SpermSample.find({ issued: true });

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
