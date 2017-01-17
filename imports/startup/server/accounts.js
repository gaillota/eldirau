import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {_} from 'lodash';

/**
 * Accounts urls
 */
Accounts.urls.verifyEmail = function (token) {
    return Meteor.absoluteUrl('verify-email/' + token);
};

Accounts.urls.resetPassword = function (token) {
    return Meteor.absoluteUrl('reset-password/' + token);
};

/**
 * Accounts emails settings
 */
Accounts.emailTemplates.from = "Eldir.au <no-reply@eldirau.com>";

Accounts.emailTemplates.siteName = "Eldir.au";

Accounts.emailTemplates.verifyEmail = {
    subject() {
        return "Activate your Eldir.au account.";
    },
    text(user, url) {
        return "Hi " + user.profile.firstName + ",\n\n"
            + "Welcome on Eldir.au ! :)\n\n"
            + "Before you can begin, we just need you to do one last thing.\n"
            + "Please follow this link in order to verify your e-mail address and complete your registration :\n\n"
            + url + ".\n\n"
            + "If you didn't register on Eldir.au, please ignore this e-mail.\n\n"
            + "Have an amazing day !\n"
            + "The Eldir.au Team.";
    }
};

/**
 * Accounts login validation
 */
Accounts.validateLoginAttempt(function (obj) {
    if (!obj.user) {
        return false;
    }

    const user = obj.user;

    if (user.emails && !user.emails[0].verified) {
        throw new Meteor.Error("not-activated", 'Your must activate your account before you can login. Please follow the instructions sent by e-mail');
    }

    if (user.disabled) {
        throw new Meteor.Error("not-authorized", 'We are sorry, but your account has been disabled.');
    }

    Meteor.users.update(user._id, {
        $set: {
            lastConnectionAt: new Date()
        }
    });

    // Prevent login tokens over-accumulation
    const maxTokens = 2;
    if (_.get(user, 'services resume loginTokens'.split(' '), []).length > maxTokens) {
        Meteor.users.update(user._id, {
            $push: {
                "services.resume.loginTokens": {
                    $each: [],
                    $slice: maxTokens
                }
            }
        });
    }

    return true;
});