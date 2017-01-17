import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const form = new SimpleSchema({
    email: {
        type: String,
        label: "Please enter your email address",
        regEx: SimpleSchema.RegEx.Email
    }
});