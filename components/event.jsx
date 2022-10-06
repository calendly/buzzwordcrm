import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default () => {
  const [event, setEvent] = useState([]);

  const { uuid } = useParams();

  const fetchData = async () => {
    const result = await fetch(`/api/events/${uuid}`).then((res) => res.json());

    setEvent(result.event);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="event-container">
      <h5 className="scheduled-event-header">
        <p>"{event.name}"</p>
        <p>on</p>
        <p>{event.date}</p>
      </h5>
      <div className="event-details">
        <p className="event-status">
          <strong>Status: </strong> {event.status && event.status.toUpperCase()}
        </p>
        <p>
          <strong>Start time: </strong> {event.start_time_formatted}
        </p>
        <p>
          <strong>End time: </strong> {event.end_time_formatted}
        </p>
        <p>
          <strong>Location: </strong>
          {(event.location && event.location.location) || 'No location set'}
        </p>
        <p>
          <strong>Number of invitees (confirmed/total): </strong>{' '}
          {event.invitees_counter &&
            `${event.invitees_counter.active}/${event.invitees_counter.limit}`}
        </p>
        <Link to={`/events/${uuid}/invitees`}>
          <p className="details-link">Click here for invitee details</p>
        </Link>
        <div>
          <strong>Invitee guests: </strong>{' '}
          {event.event_guests && event.event_guests.length > 0
            ? event.event_guests.map((guest, i) => (
                // There is no uri for event guests, so I have to set each guest's key equal to its array index.
                <ul key={i}>
                  <li>
                    {i + 1}: {guest.email}
                  </li>
                </ul>
              ))
            : 'No guests added by invitee'}
        </div>
      </div>
    </div>
  );
};
