// shared/types/media.interface.ts
export interface IMedia {
    filename: string;
    fileType: string;
    uploadDate?: Date; // Optional if you want to use default value
    fileSize: number;
    resolution?: string; // Optional
    quality?: string;    // Optional
    metadata?: object;   // Optional
    s3Url: string;
}

export interface IMediaWithId extends IMedia {
    _id: string;
}
