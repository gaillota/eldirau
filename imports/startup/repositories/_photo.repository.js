import {Photos} from '../../api/photos/photos';
import {_} from 'lodash';

export const PhotoRepository = {
    _findQuery(photoOrPhotoId, $operator, sort, limit = 1) {
        if (!_.isString(photoOrPhotoId) && !_.isObject(photoOrPhotoId)) {
            return;
        }

        const photo = _.isString(photoOrPhotoId) ? Photos.collection.findOne(photoOrPhotoId) : photoOrPhotoId;
        const subQuery = {};
        subQuery[$operator] = photo.meta.uploadedAt;

        return Photos.collection.find({
            "meta.albumId": photo.meta.albumId,
            "meta.deletedAt": {
                $exists: false
            },
            "meta.uploadedAt": subQuery
        }, {
            sort: {
                "meta.uploadedAt": sort
            },
            limit
        });
    },
    findPreviousPhotoFrom(photoOrPhotoId) {
        return this._findQuery(photoOrPhotoId, "$gt", 1, 1);
    },
    findNextPhotoFrom(photoOrPhotoId) {
        return this._findQuery(photoOrPhotoId, "$lt", -1, 1);
    },
};
