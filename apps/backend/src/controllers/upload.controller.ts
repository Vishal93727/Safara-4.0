import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responses';
import path from 'path';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    return successResponse(res, {
      file: {
        url: fileUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      }
    }, 'File uploaded successfully', 201);

  } catch (error: any) {
    console.error('Upload error:', error);
    return errorResponse(res, 'File upload failed', 500, error);
  }
};