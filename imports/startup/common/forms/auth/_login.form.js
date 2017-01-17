import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export const form = new SimpleSchema({
    email: {
        type: String,
        label: 'E-mail address',
        autoform: {
            autofocus: true
        }
    },
    password: {
        type: String,
        label: 'Password',
        autoform: {
            type: 'password'
        }
    }
});