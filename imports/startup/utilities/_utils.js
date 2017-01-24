import {Roles} from 'meteor/alanning:roles';

export const hasRole = (role, userId = Meteor.userId()) => Roles.userIsInRole(userId, role);