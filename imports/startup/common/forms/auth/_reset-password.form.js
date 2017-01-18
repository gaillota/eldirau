import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const ResetPasswordForm = new SimpleSchema({
    newPassword: {
        type: String,
        label: "New password",
        min: 5,
        max: 50,
        autoform: {
            type: "password"
        }
    },
    newPasswordConfirm: {
        type: String,
        label: "Confirm new password",
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