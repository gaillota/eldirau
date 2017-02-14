import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Roles} from 'meteor/alanning:roles';
import {_} from 'lodash';

import {RegistrationForm, ForgotPasswordForm} from '../../startup/common/forms/auth';

// export * from './admin-methods';

const mixins = ValidatedMethod.mixins;

export const bootstrap = new ValidatedMethod({
    name: 'users.bootstrap',
    mixins: [mixins.provide],
    validate: null,
    provide: function() {
        return Meteor.users.findOne({}, {
            sort: {
                createdAt: 1
            }
        });
    },
    run({}, user) {
        if (Roles.getUsersInRole('ADMIN').count()) {
            throw new Meteor.Error("not-authorized", "A user is already admin");
        }

        Roles.addUsersToRoles(user, 'ADMIN');

        return 'First registered user set as ADMIN';
    }
});

export const register = new ValidatedMethod({
    name: 'users.register',
    mixins: [mixins.checkSchema],
    schema: [RegistrationForm],
    run(doc) {
        let options = _.pick(doc, 'email password'.split(' '));
        options.profile = {};
        options.profile.firstName = doc.firstName.toLowerCase();
        options.profile.lastName = doc.lastName.toLowerCase();

        // Create new user
        const newUserId = Accounts.createUser(options);

        // Send verification e-mail
        if (!this.isSimulation) {
            Accounts.sendVerificationEmail(newUserId);
        }

        return newUserId;
    }
});

export const forgot = new ValidatedMethod({
    name: 'users.forgot',
    mixins: [mixins.checkSchema, mixins.provide],
    schema: [ForgotPasswordForm],
    provide: function({email}) {
        return Accounts.findUserByEmail(email);
    },
    run({email}, user) {
        // Specifying email in case of multiple emails situation
        Accounts.sendResetPasswordEmail(user._id, email);
    }
});

// export const edit = new ValidatedMethod({
//     name: 'users.profile.edit',
//     mixins: [mixins.isLoggedIn, mixins.checkSchema],
//     schema: UpdateProfileForm,
//     run(profile) {
//         const user = Meteor.users.findOne(this.userId);
//
//         _.merge(user.profile, profile);
//
//         return Meteor.users.update(this.userId, {
//             $set: {
//                 "profile": profile
//             }
//         });
//     }
// });

export const harakiri = new ValidatedMethod({
    name: 'users.harakiri',
    mixins: [mixins.isLoggedIn, mixins.checkSchema],
    schema: {
        digest: {
            type: String
        }
    },
    run({digest}) {
        if (this.isSimulation) {
            return;
        }

        const user = Meteor.user();
        const password = {
            algorithm: "sha-256",
            digest: digest
        };
        const result = Accounts._checkPassword(user, password);
        if (result.error) {
            throw result.error;
        }

        return Meteor.users.remove(this.userId);
    }
});

export const updateRoles = new ValidatedMethod({
    name: 'admin.users.roles',
    mixins: [mixins.isLoggedIn, mixins.isAdmin, mixins.checkSchema],
    schema: {
        userId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        },
        roles: {
            type: [String],
            optional: true
        }
    },
    run({userId, roles}) {
        return Roles.setUserRoles(userId, roles);
    }
});
