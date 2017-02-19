import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const ChangePasswordForm = new SimpleSchema({
    oldPassword: {
        type: String,
        label: "Current password",
        min: 5,
        autoform: {
            type: "password"
        }
    },
    newPassword: {
        type: String,
        label: "New password",
        min: 5,
        autoform: {
            type: "password"
        }
    },
    confirmPassword: {
        type: String,
        label: "Confirm password",
        autoform: {
            type: "password"
        },
        custom: function () {
            if (this.value !== this.field('newPassword').value) {
                return 'passwordMismatch';
            }
        }
    }
});
