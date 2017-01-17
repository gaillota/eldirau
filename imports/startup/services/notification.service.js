import {sAlert} from "meteor/juliancwirko:s-alert";

export default NotificationService = (function () {
    let functions = {};

    const computeTimeout = (text) => {
        const wpm = 200;
        const minTime = 3000;

        const words = text.split(' ').length;
        const time = (words / wpm) * 60 * 1000;

        return Math.max(time, minTime);
    };

    _.each('success info warning error'.split(' '), (type) => {
        functions[type] = (message, options = {}) => {
            options.timeout = computeTimeout(message);
            sAlert[type](message, options);
        }
    });

    return functions;
})();