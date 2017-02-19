import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const AddEmailForm = new SimpleSchema({
    address: {
        type: String,
        label: "Add e-mail address",
        regEx: SimpleSchema.RegEx.Email
    },
});
