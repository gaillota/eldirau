import {Session} from 'meteor/session';

/**
 * Modal helpers
 */
export const toggleModal = (modal, data) => Session.set(`${modal}.is-active`, data || !getModalData(modal));

export const getModalData = modal => Session.get(`${modal}.is-active`);