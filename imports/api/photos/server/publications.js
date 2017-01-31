import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import {Photos} from '../photos';
import {PhotoManager} from '../../../startup/services/photo.manager';
import {Albums} from '../../albums/albums';

Meteor.publishComposite('photos.album', (albumId, page = 1, limit = 12) => {
    return {
        find() {
            if (!this.userId) {
                return this.ready();
            }

            new SimpleSchema({
                albumId: {type: String, regEx: SimpleSchema.RegEx.Id},
                page: {type: Number, min: 1, optional: true},
                limit: {type: Number, min: 0}
            }).validate({albumId, page, limit});

            const album = Albums.findOne(albumId);

            if (!album.hasAccess(this.userId)) {
                throw new Meteor.Error("not-authorized", "You are not allowed to access this album");
            }

            page = page || 1;
            const skip = limit * (page - 1);

            return Photos.find({
                "meta.albumId": albumId,
                "meta.deletedAt": {
                    $exists: false
                }
            }, {
                sort: {
                    "meta.uploadedAt": -1
                },
                limit,
                skip
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

            const photo = Photos.collection.find({
                _id: photoId,
                "meta.deletedAt": {
                    $exists: false
                }
            });

            if (!photo.count()) {
                throw new Meteor.Error("not-found", 'Photo not found');
            }

            const album = Albums.findOne(photo.fetch()[0].meta.albumId);

            if (!album.hasAccess(this.userId)) {
                throw new Meteor.Error("not-authorized", "You are not allowed to see this photo");
            }

            return photo;
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