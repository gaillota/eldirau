import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const AlbumForm = new SimpleSchema({
    name: {
        type: String,
        label: "Name your album",
        max: 60
    },
    description: {
        type: String,
        label: 'Description (optional)',
        max: 255,
        optional: true
    }
});