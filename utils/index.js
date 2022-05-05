const User = require('../models/userModel');

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
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
};

exports.formatEventDateTime = (event) => ({
  ...event,
  date: new Date(event.start_time).toLocaleDateString(),
  start_time: formatTime(event.start_time),
  end_time: formatTime(event.end_time),
});

exports.formatInviteeDateTime = (invitee) => ({
  ...invitee,
  scheduled_at: new Date(new Date(invitee.created_at).getTime()).toLocaleString('en-US'),
  updated_at: formatTime(invitee.updated_at)
})
