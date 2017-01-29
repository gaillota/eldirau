import {ValidatedMethod} from 'meteor/mdg:validated-method';

import {Albums} from './albums';
import {Photos} from '../photos/photos';
import {form as AlbumForm} from "../../startup/common/forms/albums/album.form";

const mixins = ValidatedMethod.mixins;

export const upsert = new ValidatedMethod({
    name: 'albums.upsert',
    mixins: [mixins.isLoggedIn, mixins.checkSchema],
    schema: [AlbumForm, {
        albumId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id,
            optional: true
        }
    }],
    run({name, description, albumId}) {
        if (albumId) {
            const album = Albums.findOne(albumId);

            if (album.ownerId !== this.userId) {
                throw new Meteor.Error("not-authorized", "You can only edit your own albums");
            }

            return Albums.update(albumId, {
                $set: {
                    name,
                    description
                }
            });
        }

        return Albums.insert({
            name,
            description,
            ownerId: this.userId
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
                return album.ownerId !== this.userId;
            },
            error: function() {
                return new Meteor.Error("not-authorized", "You can only delete your albums");
            }
        }
    ],
    run({albumId}) {
        Photos.update({
            albumId: albumId
        }, {
            $set: {
                "meta.deletedAt": new Date()
            }
        }, {
            multi: true
        });

        return Albums.remove(albumId);
    }
});

export const share = new ValidatedMethod({
    name: 'albums.share',
    mixins: [mixins.isLoggedIn, mixins.checkSchema, mixins.restrict, mixins.provide],
    schema: {
        albumId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        },
        usersIds: {
            type: [String],
            regEx: SimpleSchema.RegEx.Id
        }
    },
    provide: function({albumId}) {
        return Albums.findOne(albumId);
    },
    restrictions: [
        {
            condition: function(args, album) {
                return album.ownerId !== this.userId;
            },
            error: function() {
                return new Meteor.Error("not-authorized", "You can only share your albums");
            }
        }
    ],
    run({albumId, usersIds}) {
        return Albums.update(albumId, {
            $set: {
                grantedUsersIds: usersIds
            }
        });
    }
});