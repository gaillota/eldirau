import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export const LoginForm = new SimpleSchema({
    email: {
        type: String,
        label: 'E-mail address',
        autoform: {
            autofocus: true,
            placeholder: 'Ex: dumbledore@poudlard.edu'
        }
    },
    password: {
        type: String,
        label: 'Password',
        autoform: {
            type: 'password',
            placeholder: '********'
        }
    }
});