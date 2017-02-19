import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Roles} from 'meteor/alanning:roles';
import {_} from 'lodash';

import {RegistrationForm, ForgotPasswordForm} from '../../startup/common/forms/auth';
import {AddEmailForm} from '../../startup/common/forms/profile';
import {EnrollForm} from '../../startup/common/forms/admin/enroll.form';

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

export const email = new ValidatedMethod({
    name: 'users.email',
    mixins: [mixins.isLoggedIn, mixins.checkSchema, mixins.isServer],
    schema: AddEmailForm,
    run({address}) {
        Accounts.addEmail(this.userId, address);
        Accounts.sendVerificationEmail(this.userId, address);
    }
});

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

export const activate = new ValidatedMethod({
    name: 'users.activate',
    mixins: [mixins.isAdmin, mixins.checkSchema],
    schema: {
        userId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id
        }
    },
    run({userId}) {
        return Meteor.users.update(userId, {
            $set: {
                "emails.0.verified": true
            }
        });
    }
});

export const updateRoles = new ValidatedMethod({
    name: 'users.roles',
    mixins: [mixins.isAdmin, mixins.checkSchema],
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

export const enroll = new ValidatedMethod({
    name: 'users.enroll',
    mixins: [mixins.isLoggedIn, mixins.isAdmin, mixins.checkSchema],
    schema: EnrollForm,
    run({firstName, lastName, email}) {
        const password = Math.random().toString(16).slice(2);
        const userId = Accounts.createUser({
            email,
            password,
            options: {
                firstName: firstName.toLowerCase(),
                lastName: lastName.toLowerCase()
            }
        });

        return Accounts.sendEnrollmentEmail(userId, email);
    }
});
