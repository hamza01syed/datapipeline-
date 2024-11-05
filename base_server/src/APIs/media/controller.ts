// media/controller.ts
import { NextFunction, Request, Response } from 'express';
import httpResponse from '../../handlers/httpResponse';
import responseMessage from '../../constant/responseMessage';
import httpError from '../../handlers/errorHandler/httpError';
import mediaRepository from './_shared/repo/media.repository';

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import sharp from 'sharp';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import dotenv from 'dotenv';
dotenv.config();

// Initialize S3 client
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
    fileFilter: (req, file, cb) => {
        console.log(req)
        const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) cb(null, true);
        else     cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Unsupported file type') as unknown as null, false);
    }
}).single('file');

// Helper function to upload to S3
async function uploadToS3(buffer: Buffer, name: string, mimetype: string) {
    const uniqueName = `${Date.now()}-${name}`;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: uniqueName,
        Body: buffer,
        ContentType: mimetype,
    };
    await s3.send(new PutObjectCommand(params));
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueName}`;
}

export default {
    uploadFile: async (request: Request, response: Response, next: NextFunction) => {
        upload(request, response, async (err) => {
            if (err) return httpResponse(response, request, 400, responseMessage.NOT_FOUND('File upload error'), null);

            const { file } :any= request;
            const { originalname, mimetype, size } = file;

            try {
                let s3Url, metadata: any = {};

                if (mimetype.startsWith('image/')) {
                    const processedImage = await sharp(file.buffer).resize({ width: 800 }).jpeg().toBuffer();
                    s3Url = await uploadToS3(processedImage, originalname, mimetype);
                    metadata.resolution = '800px width';
                } else if (mimetype.startsWith('video/')) {
                    s3Url = await uploadToS3(file.buffer, originalname, mimetype);
                    metadata.transcoding = 'not required';
                } else if (mimetype === 'application/pdf') {
                    const textContent = await pdfParse(file.buffer);
                    metadata.textContent = textContent.text;
                    s3Url = await uploadToS3(file.buffer, originalname, mimetype);
                } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    const result = await mammoth.extractRawText({ buffer: file.buffer });
                    metadata.textContent = result.value;
                    s3Url = await uploadToS3(file.buffer, originalname, mimetype);
                } else {
                    return httpResponse(response, request, 400, responseMessage.SOMETHING_WENT_WRONG, null);
                }

                const mediaData = {
                    filename: originalname,
                    fileType: mimetype,
                    fileSize: size,
                    s3Url,
                    metadata,
                };

                const newMedia = await mediaRepository.createMedia(mediaData);
                httpResponse(response, request, 201, responseMessage.SUCCESS, newMedia);
            } catch (error) {
                httpError(next, error, request, 500);
            }
        });
    },

    getAllMedia: async (request: Request, response: Response, next: NextFunction) => {
        try {
            const mediaList = await mediaRepository.findAllMedia();
            httpResponse(response, request, 200, responseMessage.SUCCESS, mediaList);
        } catch (error) {
            httpError(next, error, request, 500);
        }
    },

    getMediaById: async (request: Request, response: Response, next: NextFunction) => {
        try {
            const mediaId = request.params.id;
            const mediaItem = await mediaRepository.findMediaById(mediaId);
            if (!mediaItem) {
                return httpResponse(response, request, 404, responseMessage.NOT_FOUND("Item"), null);
            }
            httpResponse(response, request, 200, responseMessage.SUCCESS, mediaItem);
        } catch (error) {
            httpError(next, error, request, 500);
        }
    },

    deleteMedia: async (request: Request, response: Response, next: NextFunction) => {
        try {
            const mediaId = request.params.id;
            const mediaItem = await mediaRepository.findMediaById(mediaId);
            if (!mediaItem) {
                return httpResponse(response, request, 404, responseMessage.NOT_FOUND("delete"), null);
            }

            const deleteParams = {
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: mediaItem.s3Url.split('/').pop()!,
            };
            await s3.send(new DeleteObjectCommand(deleteParams));
            await mediaRepository.deleteMedia(mediaId);

            httpResponse(response, request, 200, responseMessage.SUCCESS, { message: 'Media deleted successfully' });
        } catch (error) {
            httpError(next, error, request, 500);
        }
    },

    searchMedia: async (request: Request, response: Response, next: NextFunction) => {
        const { query } = request.params;
        console.log(query)

        if (typeof query !== 'string') {
            return httpResponse(response, request, 400, responseMessage.NOT_FOUND("Query must be a string"), null);
        }

        try {
            const mediaFiles = await mediaRepository.searchMedia({
                $or: [
                    { filename: { $regex: query, $options: 'i' } },
                    { 'metadata.textContent': { $regex: query, $options: 'i' } }
                ]
            });
            httpResponse(response, request, 200, responseMessage.SUCCESS, mediaFiles);
        } catch (error) {
            httpError(next, error, request, 500);
        }
    }
};
