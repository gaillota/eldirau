import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Roles} from "meteor/alanning:roles";

import './helpers';

// Prevent client from modifying user collection
Meteor.users.deny({
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

const UserProfile = new SimpleSchema({
    firstName: {
        type: String,
        min: 2,
        max: 50
    },
    lastName: {
        type: String,
        min: 2,
        max: 60
    },
});

// User Simple Schema for server validation
Meteor.users.schema = new SimpleSchema({
    emails: {
        type: Array,
        optional: true
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    profile: {
        type: UserProfile
    },
    createdAt: {
        type: Date
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    roles: {
        type: [String],
        optional: true
    },
    lastConnectionAt: {
        type: Date,
        optional: true
    },
    disabled: {
        type: Boolean,
        optional: true
    },
    status: {
        type: Object,
        optional: true,
        blackbox: true
    },
    heartbeat: {
        type: Date,
        optional: true
    }
});

Meteor.users.attachSchema(Meteor.users.schema);

Meteor.users.publicFields = {
    "profile.firstName": 1,
    "profile.lastName": 1,
    emails: 1,
    lastConnectionAt: 1,
    createdAt: 1,
    status: 1
};