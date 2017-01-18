import {ValidatedMethod} from 'meteor/mdg:validated-method';

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
        title: {
            type: String
        }
    },
    provide: function({photoId}) {
        return Photos.findOne(photoId);
    },
    restrictions: [
        {
            condition: function(args, photo) {
                return photo.ownerId === this.userId;
            },
            error: function() {
                return new Meteor.Error("not-authorized", "You can onyl update your photos");
            }
        }
    ],
    run({photoId, title}) {
        return Photos.update(photoId, {
            $set: {
                title: title
            }
        });
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
    provide: function({photoId}) {
        return Photos.findOne(photoId);
    },
    restrictions: [
        {
            condition: function(args, photo) {
                return photo.ownerId === this.userId;
            },
            error: function() {
                return new Meteor.Error("not-authorized", "You can onyl update your photos");
            }
        }
    ],
    run({photoId}) {
        return Photos.remove(photoId);
    }
});