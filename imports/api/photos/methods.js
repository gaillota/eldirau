import {ValidatedMethod} from 'meteor/mdg:validated-method';

import {Photos, CommentSchema} from './photos';

const mixins = ValidatedMethod.mixins;

export const update = new ValidatedMethod({
    name: 'photos.update',
    mixins: [mixins.isLoggedIn, mixins.checkSchema, mixins.restrict, mixins.provide],
    schema: {
        photoId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        },
        name: {
            type: String
        },
        description: {
            type: String,
            optional: true
        }
    },
    provide: function ({photoId}) {
        return Photos.collection.findOne(photoId);
    },
    restrictions: [
        {
            condition: function (args, photo) {
                return photo.userId !== this.userId;
            },
            error: function () {
                return new Meteor.Error("not-authorized", "You can only update your own photos");
            }
        }
    ],
    run({photoId, name, description}) {
        return Photos.update(photoId, {
            $set: {
                "meta.name": name,
                "meta.description": description
            }
        });
    }
});

export const like = new ValidatedMethod({
    name: 'photos.like',
    mixins: [mixins.isLoggedIn, mixins.checkSchema, mixins.provide],
    schema: {
        photoId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        },
    },
    provide: function ({photoId}) {
        return Photos.collection.findOne(photoId);
    },
    run({photoId}, photo) {
        const isLiked = photo.meta.likes.indexOf(this.userId) >= 0;
        const field = {"meta.likes": this.userId};
        const update = isLiked ? {$pull: field} : {$addToSet: field};

        return Photos.collection.update(photoId, update);
    }
});

export const comment = new ValidatedMethod({
    name: 'photos.comment',
    mixins: [mixins.isLoggedIn, mixins.checkSchema, mixins.provide],
    schema: {
        commentId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id,
            optional: true,
        },
        photoId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id,
        },
        text: {
            type: String
        }
    },
    provide: function () {
        return Meteor.users.findOne(this.userId);
    },
    run({commentId, photoId, text}, user) {
        console.log('photoId', photoId);
        console.log('text', text);
        console.log('user', user.fullName());
        // const update = {};
        // if (commentId) {
        //     update["$set"] = {
        //         "meta.comment.$._id": commentId
        //     }
        // }
        return Photos.collection.update(photoId, {
            $addToSet: {
                "meta.comments": {
                    userId: this.userId,
                    text: text.trim()
                }
            }
        });
    }
});

export const uncomment = new ValidatedMethod({
    name: 'photos.uncomment',
    mixins: [mixins.isLoggedIn, mixins.checkSchema, mixins.restrict, mixins.provide],
    schema: {
        photoId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id,
        },
        commentId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id,
        },
    },
    provide: function ({photoId}) {
        return Photos.collection.findOne(photoId);
    },
    restrictions: [
        {
            condition: function ({commentId}, photo) {
                return !photo.meta.comments.filter(c => (c.commentId === commentId && c.userId === this.userId)).length;
            },
            error: function () {
                return new Meteor.Error("not-authorized", "You can only delete your comments");
            }
        }
    ],
    run({photoId, commentId}, photo) {
        console.log('photoId', photoId);
        console.log('commentId', commentId);
        const comments = photo.meta.comments;
        console.log(comments);

        return Photos.collection.update({
            _id: photoId,
            "meta.comments.commentId": commentId
        }, {
            $set: {
                "meta.comments.$.deletedAt": new Date()
            }
        });
        // return Photos.collection.update(photoId, {
        //     $pull: {
        //         "meta.comments": {
        //             commentId
        //         }
        //     }
        // });
    }
});

export const remove = new ValidatedMethod({
    name: 'photos.remove',
    mixins: [mixins.isLoggedIn, mixins.checkSchema, mixins.restrict, mixins.provide],
    schema: {
        photoId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        },
    },
    provide: function ({photoId}) {
        return Photos.collection.findOne(photoId);
    },
    restrictions: [
        {
            condition: function (args, photo) {
                return photo.userId !== this.userId;
            },
            error: function () {
                return new Meteor.Error("not-authorized", "You can only update your own photos");
            }
        }
    ],
    run({photoId}) {
        return Photos.update(photoId, {
            $set: {
                "meta.deletedAt": new Date()
            }
        });
    }
});
