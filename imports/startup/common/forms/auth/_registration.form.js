import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export const form = new SimpleSchema({
    firstName: {
        type: String,
        min: 2,
        max: 50,
        autoform: {
            placeholder: 'First name'
        }
    },
    lastName: {
        type: String,
        min: 2,
        max: 60,
        autoform: {
            placeholder: 'Last name'
        }
    },
    email: {
        type: String,
        label: "E-mail address",
        regEx: SimpleSchema.RegEx.Email,
        autoform: {
            type: "email",
            placeholder: 'E-mail address'
        }
    },
    password: {
        type: String,
        label: "Password",
        min: 5,
        autoform: {
            type: "password",
            placeholder: 'Enter a password'
        }
    },
    confirm: {
        type: String,
        label: "Confirm password",
        autoform: {
            type: "password",
            placeholder: 'Confirm your password'
        },
        custom: function () {
            if (this.value !== this.field('password').value) {
                return 'passwordMismatch';
            }
        }
    }
});