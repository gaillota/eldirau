import {Albums} from '../../api/albums/albums';

export const AlbumRepository = {
    findAlbumsByUser(userId, query = {}, projection = {}) {
        return Albums.find({
            ownerId: userId,
            deletedAt: {
                $exists: false
            },
            ...query
        }, projection);
    },
    findAlbumsSharedWithUser(userId, query = {}, projection = {}) {
        return Albums.find({
            deletedAt: {
                $exists: false
            },
            grantedUsersIds: {
                $in: [userId]
            },
            ...query
        }, projection);
    }
};
