import {moment} from 'meteor/momentjs:moment';

/**
 * Date helpers
 */
export const formatDate = (date) => {
    if (!date) {
        return '-1';
    }

    date = moment(date);
    return date.isSame(new Date(), 'day') ? date.format('HH:mm') : date.isSame(new Date(), 'year') ? date.format('MMMM Do') : date.format('MMMM Do YYYY');
};

export const formatDateRelative = (date) => {
    if (!date) {
        return '-1';
    }

    return moment(date).fromNow();
};