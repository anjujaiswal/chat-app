const moment = require('moment');
let generateMessage = (from, msg) => {
    return {
        from,
        msg,
        createdAt: moment().valueOf()
        // createdAt: new Date().getTime()
    };
};
let generateLocationMessage = (from, lat, lng) => {
    return {
        from,
        url: `https://www.google.com/maps/@${lat},${lng}`,
        createdAt: moment().valueOf()
        // createdAt: new Date().getTime()
    };
};
module.exports = {generateMessage, generateLocationMessage};