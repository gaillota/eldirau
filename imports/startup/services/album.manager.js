import {Albums} from '../../api/albums/albums';

export const AlbumManager = {
    findUserAlbums(userId, query = {}, projection = {}) {
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