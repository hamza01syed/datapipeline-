import mediaModel from '../models/media.model';
import { IMedia } from '../types/media.interface';

export default {
    createMedia: async (payload: IMedia) => {
        return await mediaModel.create(payload);
    },

    findAllMedia: async () => {
        return await mediaModel.find();
    },

    findMediaById: async (id: string) => {
        const media = await mediaModel.findById(id);
        if (!media) {
            throw new Error('Media not found'); // Handle not found case
        }
        return media;
    },

    searchMedia: async (query: Record<string, unknown>) => {
        return await mediaModel.find(query); // Use your search criteria here, e.g., by title or tags
    },

    deleteMedia: async (id: string) => {
        return await mediaModel.findByIdAndDelete(id);
    },
};
