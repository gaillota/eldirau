import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

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
    title: {
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
        }
    },
    updatedAt: {
        type: Date,
        optional: true
    }
});

Albums.attachSchema(Albums.schema);

Albums.helpers({
    owner() {
        return Meteor.users.findOne(this.ownerId);
    },
    photos() {
        return Photos.find({
            albumId: this._id
        }).cursor;
    }
});