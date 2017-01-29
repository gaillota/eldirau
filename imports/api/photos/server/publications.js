import {Meteor} from 'meteor/meteor';

import {Photos} from '../photos';
import {PhotoManager} from '../../../startup/services/photo.manager';

Meteor.publishComposite('photos.album', (albumId, limit = 20) => {
    return {
        find() {
            if (!this.userId) {
                return this.ready();
            }

            return Photos.find({
                "meta.albumId": albumId,
                "meta.deletedAt": {
                    $exists: false
                }
            }, {
                sort: {
                    "meta.uploadedAt": -1
                },
                limit
            }).cursor;
        }
    }
});

Meteor.publishComposite('photo.view', (photoId) => {
    return {
        find() {
            if (!this.userId) {
                return this.ready();
            }

            return Photos.collection.find({
                _id: photoId,
                "meta.deletedAt": {
                    $exists: false
                }
            });
        },
        children: [
            {
                find(photo) {
                    return PhotoManager.findPreviousPhotoFrom(photo);
                }
            },
            {
                find(photo) {
                    return PhotoManager.findNextPhotoFrom(photo);
                }
            }
        ]
    }
});