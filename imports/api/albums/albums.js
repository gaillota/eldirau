import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Roles} from 'meteor/alanning:roles';

import {Photos} from "../photos/photos";

export const Albums = new Mongo.Collection("albums");

// Deny all client-side access (management through methods)
Albums.deny({
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return true;
    }
});

Albums.schema = new SimpleSchema({
    name: {
        type: String,
        max: 60
    },
    description: {
        type: String,
        max: 255,
        optional: true,
    },
    ownerId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert && !this.isSet) {
                return new Date();
            }
        },
        denyUpdate: true
    },
    updatedAt: {
        type: Date,
        optional: true
    },
    deletedAt: {
        type: Date,
        optional: true
    },
    previewId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true
    },
    grantedUsersIds: {
        type: [String],
        regEx: SimpleSchema.RegEx.Id,
        optional: true
    }
});

Albums.attachSchema(Albums.schema);

Albums.helpers({
    owner() {
        return Meteor.users.findOne(this.ownerId);
    },
    preview(fetch = false) {
        return this.previewId ? Photos.collection.findOne(this.previewId) : this.photos(1, fetch);
    },
    photos(limit = 0, fetch = false) {
        const cursor = Photos.collection.find({
            "meta.albumId": this._id,
            "meta.deletedAt": {
                $exists: false
            }
        }, {
            sort: {
                "meta.uploadedAt": -1
            },
            limit
        });

        return fetch ? cursor.fetch() : cursor;
    },
    hasAccess(userId) {
        return this.ownerId === userId || this.grantedUsersIds.indexOf(userId) >= 0 || Roles.userIsInRole(userId, 'ALBUM');
    }
});
