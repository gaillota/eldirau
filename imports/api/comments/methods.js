import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import {Comments} from './comments';
import {Photos} from '../photos/photos';
import {Albums} from '../albums/albums';

const mixins = ValidatedMethod.mixins;

export const comment = new ValidatedMethod({
    name: 'comments.insert',
    mixins: [mixins.isLoggedIn, mixins.checkSchema, mixins.restrict, mixins.provide],
    schema: {
        photoId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id,
        },
        text: {
            type: String
        }
    },
    provide: function ({photoId}) {
        const photo = Photos.collection.findOne(photoId);
        return Albums.findOne(photo.meta.albumId);
    },
    restrictions: [
        {
            condition: function (args, album) {
                const grantedUsers = album.grantedUsersIds || [];
                return !(album.ownerId === this.userId || grantedUsers.indexOf(this.userId) >= 0);
            },
            error: function () {
                return new Meteor.Error("not-authorized", "You can't comment on this photo");
            }
        }
    ],
    run({photoId, text}) {
        return Comments.insert({
            photoId,
            text,
            userId: this.userId,
        });
    }
});

// We could merge comments.insert and comments.update into comments.upsert but we choosed not to because we're lazy af
export const update = new ValidatedMethod({
    name: 'comments.update',
    mixins: [mixins.isLoggedIn, mixins.checkSchema, mixins.restrict, mixins.provide],
    schema: {
        commentId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id,
        },
        text: {
            type: String
        }
    },
    provide: function ({commentId}) {
        return Comments.findOne(commentId);
    },
    restrictions: [
        {
            condition: function (args, comment) {
                return comment.userId !== this.userId;
            },
            error: function () {
                return new Meteor.Error("not-authorized", "You can't update this comment");
            }
        }
    ],
    run({commentId, text}) {
        return Comments.update(commentId, {
            $set: {
                text
            }
        });
    }
});

export const uncomment = new ValidatedMethod({
    name: 'comments.remove',
    mixins: [mixins.isLoggedIn, mixins.checkSchema, mixins.restrict, mixins.provide],
    schema: {
        commentId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id,
        }
    },
    provide: function ({commentId}) {
        return Comments.findOne(commentId);
    },
    restrictions: [
        {
            condition: function (args, comment) {
                return comment.userId !== this.userId;
            },
            error: function () {
                return new Meteor.Error("not-authorized", "You can only delete your own comments");
            }
        }
    ],
    run({commentId}) {
        return Comments.update(commentId, {
            $set: {
                deletedAt: new Date()
            }
        });
    }
});
