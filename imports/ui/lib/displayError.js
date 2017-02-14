import {_} from 'lodash';

import {NotificationService} from '../../startup/services';

export default (error, callback) => {
    if (error) {
        NotificationService.error(error.reason || error.toString());
    }
    if (callback && _.isFunction(callback)) {
        callback.apply();
    }
}
