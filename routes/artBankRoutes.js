const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const ARTBank = require('../models/ARTbank');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../.uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Unique filenames
  },
});

const upload = multer({ storage });

// Route: Fetch all ARTBanks
router.get('/fetch-art-banks', async (req, res) => {
  try {
    const artBanks = await ARTBank.find(); // Fetch all records
    res.status(200).json(artBanks);
  } catch (err) {
    console.error('Error fetching ART banks:', err);
    res.status(500).json({ message: 'Failed to fetch ART banks' });
  }
});

// Route: Delete an ARTBank by registrationId
router.delete('/remove-art-bank/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const deletedBank = await ARTBank.findOneAndDelete({ registrationId: id });
    if (!deletedBank) {
      return res.status(404).json({ message: 'ART Bank not found' });
    }

    // Delete associated files
    if (deletedBank.documents && deletedBank.documents.length > 0) {
      deletedBank.documents.forEach((filePath) => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          }
        });
      });
    }

    res.status(200).json({ message: 'ART Bank deleted successfully' });
  } catch (error) {
    console.error('Error deleting ART bank:', error);
    res.status(500).json({ message: 'Error deleting ART bank', error });
  }
});

// Route: Edit an ARTBank
router.patch('/edit-bank/:id', upload.array('documents', 10), async (req, res) => {
  try {
    const id = req.params.id;
    const existingDocuments = JSON.parse(req.body.existingDocuments || "[]");
    const removedDocuments = JSON.parse(req.body.removedDocuments || "[]");

    const bankToUpdate = await ARTBank.findOne({ registrationId: id });
    if (!bankToUpdate) {
      return res.status(404).json({ message: 'ART Bank not found' });
    }

    // Update text fields from the request body
    Object.keys(req.body).forEach((key) => {
      if (!['existingDocuments', 'removedDocuments'].includes(key)) {
        bankToUpdate[key] = req.body[key];
      }
    });

    // Handle removed documents
    if (removedDocuments.length > 0) {
      bankToUpdate.documents = bankToUpdate.documents.filter(
        (doc) => !removedDocuments.includes(doc)
      );

      // Physically delete files
      removedDocuments.forEach((filePath) => {
        fs.unlink(filePath, (err) => {
          if (err) console.error(`Error deleting file: ${filePath}`);
        });
      });
    }

    // Add new uploaded files
    if (req.files && req.files.length > 0) {
      const newDocs = req.files.map((file) => file.path);
      bankToUpdate.documents = [...bankToUpdate.documents, ...newDocs];
    } else {
      // Ensure existing files are not removed accidentally
      bankToUpdate.documents = existingDocuments;
    }

    await bankToUpdate.save();
    res.status(200).json(bankToUpdate);
  } catch (error) {
    console.error('Error updating ART Bank:', error);
    res.status(500).json({ message: 'Error updating ART Bank', error });
  }
});


// Route: Add a new ARTBank
router.post('/add-art-bank', upload.array('documents', 10), async (req, res) => {
  try {
    console.log('Request Headers:', req.headers); // Debugging headers
    console.log('Request Body:', req.body); // Debugging body
    console.log('Uploaded Files:', req.files); // Debugging files

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    const {
      name,
      directorName,
      aadharNumber,
      panNumber,
      registrationId,
      address,
      donorSemenPrice,
      oocyteDonorPrice,
      surrogateMotherPrice,
    } = req.body;

    // Map file paths
    const documentPaths = req.files.map((file) => file.path);

    // Check if registration ID already exists
    const existingARTBank = await ARTBank.findOne({ registrationId });
    if (existingARTBank) {
      return res.status(400).json({ message: 'Registration ID already exists.' });
    }

    // Create a new ARTBank record
    const newARTBank = new ARTBank({
      name,
      directorName,
      aadharNumber,
      panNumber,
      registrationId,
      address,
      donorSemenPrice,
      oocyteDonorPrice,
      surrogateMotherPrice,
      documents: documentPaths,
    });

    await newARTBank.save();
    res.status(201).json(newARTBank);
  } catch (err) {
    console.error('Error adding ART bank:', err);
    res.status(500).json({ message: 'Error adding ART bank', error: err });
  }
});


module.exports = router;
