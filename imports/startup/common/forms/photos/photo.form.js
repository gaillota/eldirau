import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const form = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 60,
        optional: true
    },
    description: {
        type: String,
        label: 'Description (optional)',
        max: 255,
        autoform: {
            type: 'textarea'
        },
        optional: true
    }
});
