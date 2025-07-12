import express from 'express';
import { uploadMultiple } from '../middleware/upload.mjs';
import { StorageFactory } from '../storage/StorageFactory.mjs';

const router = express.Router();

console.log('File routes module loaded - R2 storage only');

// Upload endpoint for photo menu images
router.post('/upload/photomenu', uploadMultiple, async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const storage = StorageFactory.getProvider();
    const uploadResults = [];

    for (const file of req.files) {
      const result = await storage.upload(file.buffer, file.originalname, {
        folder: 'photomenu',
        contentType: file.mimetype
      });

      uploadResults.push(result);
    }

    res.json({ 
      success: true, 
      files: uploadResults 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Single file upload endpoint
router.post('/upload/single', uploadMultiple, async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const storage = StorageFactory.getProvider();
    const file = req.files[0];
    
    const result = await storage.upload(file.buffer, file.originalname, {
      folder: 'photomenu',
      contentType: file.mimetype
    });

    res.json({ 
      success: true, 
      file: result 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router;