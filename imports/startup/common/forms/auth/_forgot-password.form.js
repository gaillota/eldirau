import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const ForgotPasswordForm = new SimpleSchema({
    email: {
        type: String,
        label: "Please enter your email address",
        regEx: SimpleSchema.RegEx.Email
    }
});