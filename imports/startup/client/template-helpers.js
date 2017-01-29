import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {moment} from 'meteor/momentjs:moment';
import {_} from 'lodash';

import {GravatarService} from '../services/gravatar.service';
import {hasRole, formatDate, formatDateRelative} from '../utilities';

const helpers = {
    hasRole,
    formatDate,
    formatDateRelative,
    _(...args) {
        if (!args.length) {
            return;
        }

        const name = args[0];
        args.shift();

        return _[name].apply(_, args);
    },
    fa(icon) {
        return '<i class="fa fa-' + icon + '"></i>';
    },
    toJson(json) {
        if (!_.isObject(json)) {
            return "Not an object";
        }

        return JSON.stringify(json);
    },
    count(cursor, defaultValue) {
        return cursor && _.isFunction(cursor.count) ? cursor.count() : _.isNumber(defaultValue) ? defaultValue : '-1';
    },
    assets(path) {
        return Meteor.absoluteUrl(path);
    },
    userStatus(user) {
        user = user || this;
        if (user.disabled) {
            return {
                type: 'danger',
                icon: 'user-times',
                text: 'Banned'
            }
        } else if (user.emails[0].verified) {
            return {
                type: 'success',
                icon: 'check-square-o',
                text: 'Active'
            }
        } else {
            return {
                type: 'warning',
                icon: 'clock-o',
                text: 'Waiting...'
            }
        }
    },
    // lodash's isEmpty function doesn't work on cursors
    isEmpty(data) {
        if (!data) {
            return true;
        }

        if (_.isString(data) || _.isArray(data)) {
            return !data.length;
        }

        return !data.count();
    },
    pluralize(count = 0, singular, plural) {
        if (count <= 1) {
            return "" + count + " " + singular;
        }

        return "" + count + " " + plural;
    },
    isAdmin(userId = Meteor.userId()) {
        return hasRole('admin', userId);
    },
    myself(userId) {
        return userId === Meteor.userId();
    },
    genderIconName(gender) {
        return gender == 'female' ? 'venus' : 'mars';
    },
    gravatarUrl(email = Meteor.user().emails[0].address) {
        return GravatarService.getUrl(email);
    }
};

_.forEach(helpers, (fct, name) => {
    Template.registerHelper(name, fct);
});