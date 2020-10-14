const User = require('../models/userModel');

const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
};

exports.isUserAuthenticated = async (req, res, next) => {
    if (req.user) {
        const user = await User.findById(req.user.id);

        if (!user) {
            req.session = null;
        } else {
            req.user = user;
            return next();
        }
    }

    res.redirect('/');
};

exports.formatEventDateTime = (event) => ({
    ...event,
    date: new Date(event.start_time).toLocaleDateString(),
    start_time: formatTime(event.start_time),
    end_time: formatTime(event.end_time)
});
