import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';
import { uploadMultiple } from '../middleware/upload.mts';

const router = express.Router();

console.log('File routes module loaded');

// Serve static files from uploads directory (for local storage)
router.use('/files', express.static(path.join(process.cwd(), 'uploads')));

// Upload endpoint for photo menu images
router.post('/upload/photomenu', uploadMultiple, async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadResults = [];
    const baseDir = 'uploads';
    const baseUrl = 'http://localhost:3000/api/files';

    for (const file of req.files) {
      const folder = 'photomenu';
      const ext = path.extname(file.originalname);
      const filename = `${randomUUID()}${ext}`;
      const key = `${folder}/${filename}`;
      const fullPath = path.join(baseDir, key);

      // Ensure directory exists
      await fs.mkdir(path.dirname(fullPath), { recursive: true });

      // Write file
      await fs.writeFile(fullPath, file.buffer);

      // Get file stats for size
      const stats = await fs.stat(fullPath);

      uploadResults.push({
        url: `${baseUrl}/${key}`,
        key,
        size: stats.size,
        contentType: file.mimetype
      });
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

    const file = req.files[0];
    const baseDir = 'uploads';
    const baseUrl = 'http://localhost:3000/api/files';
    const folder = 'photomenu';
    const ext = path.extname(file.originalname);
    const filename = `${randomUUID()}${ext}`;
    const key = `${folder}/${filename}`;
    const fullPath = path.join(baseDir, key);

    // Ensure directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    // Write file
    await fs.writeFile(fullPath, file.buffer);

    // Get file stats for size
    const stats = await fs.stat(fullPath);

    const result = {
      url: `${baseUrl}/${key}`,
      key,
      size: stats.size,
      contentType: file.mimetype
    };

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