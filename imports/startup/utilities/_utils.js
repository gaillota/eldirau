import {Roles} from 'meteor/alanning:roles';

export const hasRole = (role, userId) => Roles.userIsInRole(userId, role);

export const capitalize = (text = '') => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
