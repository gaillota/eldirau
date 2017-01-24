import {FilesCollection} from 'meteor/ostrio:files';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import _extend from 'lodash/extend';

export const Photos = new FilesCollection({
    collectionName: 'photos',
    allowClientCode: false,
    storagePath: 'assets/uploads/photos',
    onBeforeUpload: function (file) {
        // Allow upload files under 10MB, and only in png/jpg/jpeg formats
        if (file.size <= 10485760 && isImage(file)) {
            return true;
        }
        return 'Please upload an image, with size equal or less than 10MB';
    },
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

const schema = _extend(Photos.schema, {
    "meta.albumId": {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    "meta.description": {
        type: String,
        max: 255,
        optional: true
    },
    "meta.deletedAt": {
        type: Date,
        optional: true
    }
});

Photos.collection.attachSchema(new SimpleSchema(schema));