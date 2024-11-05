import mediaRepository from '../_shared/repo/media.repository';
import { IMedia } from '../_shared/types/media.interface';
import { CustomError } from '../../../utils/errors';
import responseMessage from '../../../constant/responseMessage';

export const uploadMediaService = async (payload: IMedia) => {
    // Validate the media file, etc.
    const newMedia = await mediaRepository.createMedia(payload);
    return newMedia;
};


export const getMediaByIdService = async (id: string) => {
    const media = await mediaRepository.findMediaById(id);
    if (!media) {
        throw new CustomError(responseMessage.NOT_FOUND('Media'), 404);
    }
    return media;
};

// Add additional services as needed for processing, updating, and deleting media.
