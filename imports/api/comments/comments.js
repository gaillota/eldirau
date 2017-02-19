import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Roles} from 'meteor/alanning:roles';

import commentsCountDenormalizer from './commentsCountDenormalizer';

class CommentsCollection extends Mongo.Collection {
    insert(doc, callback) {
        const result = super.insert(doc, callback);
        commentsCountDenormalizer.afterInsertComment(doc);

        return result;
    }

    update(selector, modifier) {
        const result = super.update(selector, modifier);
        commentsCountDenormalizer.afterUpdateComment(selector, modifier);

        return result;
    }

    // We don't handle remove, because it's already taken care of in the update (soft-deletion)
}

export const Comments = new CommentsCollection("comments");

// Deny all client-side access (management through methods)
Comments.deny({
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

Comments.schema = new SimpleSchema({
    photoId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
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
            if (this.isInsert && !this.isSet) {
                return new Date();
            }
        },
        denyUpdate: true
    },
    updatedAt: {
        type: Date,
        autoValue: function () {
            if (this.isUpdate) {
                return new Date();
            }
        },
        optional: true,
        denyInsert: true
    },
    deletedAt: {
        type: Date,
        optional: true,
        denyInsert: true
    }
});

Comments.attachSchema(Comments.schema);

Comments.helpers({
    author() {
        return Meteor.users.findOne(this.userId);
    },
    editableBy(userId) {
        return this.userId === userId;
    },
});
