import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';

/**
 * Modal helpers
 */
export const showModal = modal => {
    Session.set(`${modal}.is-active`, true);
};

export const hideModal = modal => {
    Session.set(`${modal}.is-active`, undefined);
};

export const isModalActive = modal => {
    return Session.get(`${modal}.is-active`);
};