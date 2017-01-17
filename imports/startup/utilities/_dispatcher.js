import {Session} from 'meteor/session';

/**
 * Dispatcher helpers
 */
export const setDispatcherPath = (path) => {
    Session.set('dispatcher.path', path);
};

export const getDispatcherPath = () => {
    return Session.get('dispatcher.path');
};

export const resetDispatcher = () => {
    Session.set('dispatcher.path', undefined);
};