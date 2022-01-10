import { Request, Response } from 'express';
import app from '../app';
import { logger } from '../lib/logger';
import { imageUpload } from '../lib/image-upload';
import { ResponseFormat } from '../models/swagger';

export class UploadController {

  public responseFormat: ResponseFormat;

  private sendResponse(res: Response, statusCode: number, response: ResponseFormat) {
    if (statusCode)
      res.status(statusCode).json(response);
    else
      res.json(response);
  }

  public uploadFile(req: Request, res: Response) {
    try {
      logger.debug('Upload file' + JSON.stringify(req.body));
      imageUpload(req, res, async (error) => {
        if (error) { //instanceof multer.MulterError
          if (error.code == 'LIMIT_FILE_SIZE') {
            error.message = 'File Size is too large. Allowed file size is below 10 MB';
            error.success = false;
          }
          return this.sendResponse(res, 413, { success: false, message: error.message || JSON.stringify(error) });
        } else {
          if (!req.file) return this.sendResponse(res, 500, { success: false, message: 'File not found' });
          const { table, id, field } = req.body;
          if (table && id && field) {
            let collectionsName = 'Products'
            if (!collectionsName) return this.sendResponse(res, 400, { success: false, message: 'Invalid table name' });
            // update db
            await app.mongoConnection.model(collectionsName).findByIdAndUpdate(id, { [field]: `/images/${req.file.filename}` });
            this.sendResponse(res, null, { success: true, message: 'Request Success', data: `/images/${req.file.filename}` });
          } else {
            this.sendResponse(res, null, { success: true, message: 'Request Success', data: req.file.filename });
          }
        }
      });
    } catch (error) {
      logger.error('Upload file failed: ' + error);
      return this.sendResponse(res, 500, { success: false, message: error.message || JSON.stringify(error) });
    }
  }
}