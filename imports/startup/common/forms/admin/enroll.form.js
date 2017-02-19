import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const EnrollForm = new SimpleSchema({
    firstName: {
        type: String,
        min: 2,
        max: 50,
        autoform: {
            autofocus: true
        }
    },
    lastName: {
        type: String,
        min: 2,
        max: 60,
    },
    email: {
        type: String,
        label: "E-mail address",
        regEx: SimpleSchema.RegEx.Email
    },
});
