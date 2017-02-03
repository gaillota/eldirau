import {Albums} from '../../api/albums/albums';

export const AlbumRepository = {
    findAlbumsByUser(userId, query = {}, projection = {}) {
        return Albums.find({
            ownerId: userId,
            ...query
        }, projection);
    },
    findAlbumsSharedWithUser(userId, query = {}, projection = {}) {
        return Albums.find({
            grantedUsersIds: {
                $in: [userId]
            },
            ...query
        }, projection);
    }
};