import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {LoggedInMixin} from 'meteor/tunifight:loggedin-mixin';
import {simpleSchemaMixin} from 'meteor/rlivingston:simple-schema-mixin';
import {RestrictMixin} from 'meteor/ziarno:restrict-mixin';
import {ProvideMixin} from 'meteor/ziarno:provide-mixin';

ValidatedMethod.mixins = {};

ValidatedMethod.mixins.isLoggedIn = function (options) {
    options.checkLoggedInError = {
        error: 'notLogged',
        message: 'You need to be logged in to call this method',//Optional
        reason: 'You need to login' //Optional
    };

    return LoggedInMixin(options);
};

ValidatedMethod.mixins.isAdmin = function (options) {
    options.checkRoles = {
        roles: ['ADMIN'],
        rolesError: {
            error: 'not-allowed',
            message: 'You are not allowed to call this method',//Optional
            reason: 'You are not allowed to call this method' //Optional
        }
    };

    return ValidatedMethod.mixins.isLoggedIn(options);
};

ValidatedMethod.mixins.checkSchema = function (options) {
    return simpleSchemaMixin(options);
};

ValidatedMethod.mixins.isServer = function (options) {
    const r = options.run;

    options.run = function (args) {
        if (this.isSimulation) {
            return;
        }

        return r.call(this, args);
    };

    return options;
};

ValidatedMethod.mixins.restrict = RestrictMixin;
ValidatedMethod.mixins.provide = ProvideMixin;
