import {moment} from 'meteor/momentjs:moment';
import {_} from 'lodash';

/**
 * Date helpers
 */
export const formatDate = (date, format) => {
    if (!date) {
        return '-1';
    }

    date = moment(date);
    return format && _.isString(format) ? date.format(format) : date.isSame(new Date(), 'day') ? date.format('HH:mm') : date.isSame(new Date(), 'year') ? date.format('MMMM Do') : date.format('MMMM Do YYYY');
};

export const formatDateRelative = (date) => {
    if (!date) {
        return '-1';
    }

    return moment(date).fromNow();
};