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

exports.formatISOExtended = (dateObj) => {
  // Get individual date components
  const date = new Date(dateObj);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  // Get milliseconds and extend to six fractional digits
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
  const extendedFractional = milliseconds + '000'; // Pad to six digits

  // Construct the extended ISO string
  const extendedISO = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${extendedFractional}Z`;

  return extendedISO;
}

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
