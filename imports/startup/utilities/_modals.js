import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';

/**
 * Modal helpers
 */
export const triggerModal = (modal, active) => Session.set(`${modal}.is-active`, active || !isModalActive(modal));

export const isModalActive = modal => Session.get(`${modal}.is-active`);