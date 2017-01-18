import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

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