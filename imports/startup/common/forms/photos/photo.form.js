import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const PhotoForm = new SimpleSchema({
    name: {
        type: String,
        label: 'Name',
        max: 60
    },
    description: {
        type: String,
        label: 'Description (optional)',
        max: 255,
        optional: true
    }
});