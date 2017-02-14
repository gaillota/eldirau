import {Meteor} from 'meteor/meteor';
import {Random} from 'meteor/random';
import {FilesCollection} from 'meteor/ostrio:files';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import _extend from 'lodash/extend';

import {Albums} from '../albums/albums';

export const Photos = new FilesCollection({
    collectionName: 'photos',
    allowClientCode: false,
    storagePath: '/cdn/storage/photos',
    downloadCallback: function (fileObj) {
        return this.userId && (fileObj.userId === this.userId || Albums.findOne(fileObj.meta.albumId).grantedUsersIds.indexOf(this.userId) >= 0);
    },
    onBeforeUpload: function (file) {
        // Allow upload files under 10MB, and only in png/jpg/jpeg formats
        if (file.size <= 10485760 && isImage(file)) {
            return true;
        }
        return 'Please upload an image, with size equal or less than 10MB';
    },
    onAfterUpload: function (fileRef) {
        // TODO: Create thumbnail using gm in case of insanely big photos
    }
});

const isImage = file => file.type.indexOf("image") === 0 && /png|jpg|jpeg|gif/i.test(file.extension);

if (Meteor.isServer) {
    Photos.deny({
        insert: function () {
            return true;
        },
        update: function () {
            return true;
        },
        remove: function () {
            return true;
        }
    });
}

export const CommentSchema = new SimpleSchema({
    commentId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue: function () {
            if (this.isUpdate && !this.isSet) {
                console.log('returning random id');
                return Random.id();
            }
        }
    },
    userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    text: {
        type: String
    },
    postedAt: {
        type: Date,
        autoValue: function () {
            if (this.isUpdate && !this.isSet) {
                return new Date();
            }
        }
    },
    updatedAt: {
        type: Date,
        autoValue: function () {
            return new Date();
        },
        optional: true
    },
    deletedAt: {
        type: Date,
        optional: true
    }
});

const schema = _extend(Photos.schema, {
    // Overriding meta property
    meta: {
        type: Object,
        blackbox: false,
        optional: false
    },
    "meta.albumId": {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        denyUpdate: true
    },
    "meta.uploadedAt": {
        type: Date,
        autoValue: function () {
            if (this.isInsert && !this.isSet) {
                return new Date();
            }
        },
        denyUpdate: true
    },
    "meta.name": {
        type: String,
        max: 60,
        optional: true
    },
    "meta.description": {
        type: String,
        max: 255,
        optional: true
    },
    "meta.deletedAt": {
        type: Date,
        optional: true
    },
    "meta.likes": {
        type: [String],
        regEx: SimpleSchema.RegEx.Id,
        autoValue: function () {
            if (this.isInsert && !this.isSet) {
                return [];
            }
        },
    },
    "meta.comments": {
        type: [CommentSchema],
        autoValue: function () {
            if (this.isInsert && !this.isSet) {
                return [];
            }
        },
    }
});

Photos.collection.attachSchema(new SimpleSchema(schema));
