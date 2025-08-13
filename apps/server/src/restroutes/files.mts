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

    return res.json({ 
      success: true, 
      files: uploadResults 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
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

    return res.json({ 
      success: true, 
      file: result 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Upload failed', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Upload endpoint for menu item images
router.post('/upload/menuitem', uploadMultiple, async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const storage = StorageFactory.getProvider();
    const uploadResults = [];

    for (const file of req.files) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ 
          error: 'Invalid file type', 
          message: 'Only JPEG, PNG, and WebP images are allowed' 
        });
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        return res.status(400).json({ 
          error: 'File too large', 
          message: 'File size must be less than 5MB' 
        });
      }

      const result = await storage.upload(file.buffer, file.originalname, {
        folder: 'menuitem',
        contentType: file.mimetype
      });

      uploadResults.push(result);
    }

    return res.json({ 
      success: true, 
      files: uploadResults 
    });
  } catch (error) {
    console.error('Menu item upload error:', error);
    return res.status(500).json({ 
      error: 'Upload failed', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Single menu item image upload endpoint
router.post('/upload/menuitem/single', uploadMultiple, async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const storage = StorageFactory.getProvider();
    const file = req.files[0];
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        error: 'Invalid file type', 
        message: 'Only JPEG, PNG, and WebP images are allowed' 
      });
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return res.status(400).json({ 
        error: 'File too large', 
        message: 'File size must be less than 5MB' 
      });
    }
    
    const result = await storage.upload(file.buffer, file.originalname, {
      folder: 'menuitem',
      contentType: file.mimetype
    });

    return res.json({ 
      success: true, 
      file: result 
    });
  } catch (error) {
    console.error('Menu item single upload error:', error);
    return res.status(500).json({ 
      error: 'Upload failed', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});


export default router;