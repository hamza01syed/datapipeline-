// shared/models/media.model.ts
import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        required: true,
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    },
    fileSize: {
        type: Number,
        required: true,
    },
    resolution: {
        type: String, // e.g., "1920x1080" for videos/images
    },
    quality: {
        type: String, // e.g., "720p", "1080p" for videos
    },
    metadata: {
        type: Object, // Store any extra metadata
    },
    s3Url: {
        type: String, // URL of the file on S3
        required: true,
    },
}, { timestamps: true });

export default mongoose.model('Media', mediaSchema);
