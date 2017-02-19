import {check} from 'meteor/check';
import {_} from 'lodash';

import {Comments} from './comments';
import {Photos} from '../photos/photos';

const denormalizer = {
    _updatePhoto(photoId) {
        check(photoId, String);

        // We recompute the number of comments directly from MongoDB
        const commentsCount = Comments.find({photoId, deletedAt: {$exists: false}}).count();
        Photos.collection.update(photoId, {$set: {"meta.commentsCount": commentsCount}});
    },
    afterInsertComment(comment) {
        this._updatePhoto(comment.photoId);
    },
    afterUpdateComment(selector, modifier) {
        check(modifier, {$set: Object});

        // Update comment count only if comment is "removed"
        if (_.has(modifier.$set, 'deletedAt')) {
            const comment = Comments.findOne(selector, {fields: {photoId: 1}});
            this._updatePhoto(comment.photoId);
        }
    },
};

export default denormalizer;
