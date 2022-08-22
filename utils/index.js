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
  start_time: event.start_time,
  end_time: event.end_time,
  start_time_formatted: formatTime(event.start_time),
  end_time_formatted: formatTime(event.end_time),
});

exports.formatEventTypeDate = (eventType) => ({
  ...eventType,
  last_updated: new Date(eventType.updated_at).toLocaleDateString(),
});

exports.formatInviteeDateTime = (invitee) => ({
  ...invitee,
  scheduled_at: new Date(new Date(invitee.created_at).getTime()).toLocaleString(
    'en-US'
  ),
  updated_at: formatTime(invitee.updated_at),
});

exports.formatEventTypeAvailTime = (eventType) => ({
  ...eventType,
  standard_start_time_hour: formatTime(eventType.start_time),
  date: new Date(eventType.start_time).toLocaleDateString()
});
