import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Counts} from 'meteor/tmeasday:publish-counts';

import {Photos} from '../photos';
import {PhotoRepository} from '../../../startup/repositories';
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

            const nonDeleted = {$exists: false};
            const photo = Photos.collection.find({
                _id: photoId,
                "meta.deletedAt": nonDeleted,
                "meta.comments.deletedAt": nonDeleted
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
                    // Previous photo
                    return PhotoRepository.findPreviousPhotoFrom(photo);
                }
            },
            {
                find(photo) {
                    // Next photo
                    return PhotoRepository.findNextPhotoFrom(photo);
                }
            },
            {
                find(photo) {
                    // Likes
                    const likes = photo.meta.likes;
                    if (likes && likes.length > 0 && likes.length < 4) {
                        return Meteor.users.find({
                            _id: {
                                $in: likes
                            }
                        });
                    }
                }
            },
            {
                find(photo) {
                    const comments = photo.meta.comments;
                    if (comments && !!comments.length) {
                        return Meteor.users.find({
                            _id: {
                                $in: comments.map(c => c.userId)
                            }
                        });
                    }
                }
            }
        ]
    }
});

Meteor.publish('photos.admin.count', function () {
    if (!this.userId || !Roles.userIsInRole(this.userId, 'ADMIN')) {
        return this.ready();
    }

    Counts.publish(this, 'photos.admin.count', Photos.collection.find({"meta.deletedAt": {$exists: false}}));

    return this.ready();
});
