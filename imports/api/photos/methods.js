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
        name: {
            type: String
        },
        description: {
            type: String,
            optional: true
        }
    },
    provide: function({photoId}) {
        return Photos.collection.findOne(photoId);
    },
    restrictions: [
        {
            condition: function(args, photo) {
                return photo.userId !== this.userId;
            },
            error: function() {
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
        return Photos.collection.findOne(photoId);
    },
    restrictions: [
        {
            condition: function(args, photo) {
                return photo.userId !== this.userId;
            },
            error: function() {
                return new Meteor.Error("not-authorized", "You can only update your photos");
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