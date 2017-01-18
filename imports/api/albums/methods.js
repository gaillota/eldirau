import {ValidatedMethod} from 'meteor/mdg:validated-method';

import {Albums} from './albums';
import {Photos} from '../photos/photos';

const mixins = ValidatedMethod.mixins;

export const create = new ValidatedMethod({
    name: 'albums.create',
    mixins: [mixins.isLoggedIn, mixins.checkSchema],
    schema: {
        title: {
            type: String
        }
    },
    run({title}) {
        return Albums.insert({
            title,
            ownerId: this.userId
        })
    }
});

export const update = new ValidatedMethod({
    name: 'albums.update',
    mixins: [mixins.isLoggedIn, mixins.checkSchema, mixins.restrict, mixins.provide],
    schema: {
        albumId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        },
        title: {
            type: String
        }
    },
    provide: function({albumId}) {
        return Albums.findOne(albumId);
    },
    restrictions: [
        {
            condition: function(args, album) {
                return album.ownerId === this.userId;
            },
            error: function() {
                return new Meteor.Error("not-authorized", "You can only update your albums");
            }
        }
    ],
    run({albumId, title}) {
        Albums.update(albumId, {
            $set: {
                title
            }
        });
    }
});

export const remove = new ValidatedMethod({
    name: 'albums.remove',
    mixins: [mixins.isLoggedIn, mixins.checkSchema, mixins.restrict, mixins.provide],
    schema: {
        albumId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        },
    },
    provide: function({albumId}) {
        return Albums.findOne(albumId);
    },
    restrictions: [
        {
            condition: function(args, album) {
                return album.ownerId === this.userId;
            },
            error: function() {
                return new Meteor.Error("not-authorized", "You can only delete your albums");
            }
        }
    ],
    run({albumId}) {
        Photos.remove({
            albumId: albumId
        }, {
            multi: true
        });

        return Albums.remove(albumId);
    }
});