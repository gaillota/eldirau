import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import {Photos} from './photos';

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
            type: String,
            optional: true
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
    run({photoId, name = '', description = ''}) {
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
        const likes = photo.meta.likes || [];
        const isLiked = likes.indexOf(this.userId) >= 0;
        const field = {"meta.likes": this.userId};
        const update = isLiked ? {$pull: field} : {$addToSet: field};

        return Photos.collection.update(photoId, update);
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
