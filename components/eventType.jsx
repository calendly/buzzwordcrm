import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';

export default () => {
  const [eventType, setEventType] = useState([]);
  const [date, setDate] = useState(new Date());
  const [eventTypesSlots, seEventTypesSlots] = useState([]);
  const [eventUri, setEventUri] = useState();

  const { uuid } = useParams();

  const fetchData = async () => {
    const result = await fetch(`/api/event_types/${uuid}`).then((res) =>
      res.json()
    );

    setEventType(result.eventType);
    setEventUri(result.eventType.uri);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="event-container">
      <p>{`Last updated ${eventType.last_updated}`}</p>
      <h5>"{eventType.name}"</h5>
      <div className="event-details">
        <p className="event-status">
          <strong>Status: </strong>
          {eventType.active ? 'Active' : 'Deactivated'}
        </p>
        {eventType.active === false && (
          <p>
            <strong>Deleted: </strong>
            {eventType.deleted_at &&
              new Date(new Date(eventType.deleted_at).getTime())}
          </p>
        )}
        <p className="event-type-kind">
          <strong>Type: </strong>
          {eventType.kind && eventType.kind}
        </p>
        <div className="event-type-custom-questions">
          <strong>Custom Questions: </strong>
          {eventType.custom_questions &&
            eventType.custom_questions.map((question) => (
              // It doesn't increment correctly with an ol, so I've done it this way (below) to create a numbered list.
              <p key={question.position}>{`${question.position + 1}. ${
                question.name
              }`}</p>
            ))}
        </div>
        <p className="event-duration">
          <strong>Duration: </strong>
          {`${eventType.duration} minutes`}
        </p>
        <Link to={`/event_type_available_times?event_type=${eventUri}&`}>
          <p className="details-link">
            Click Here to See Availability for this Event Type
          </p>
        </Link>
      </div>
    </div>
  );
};
