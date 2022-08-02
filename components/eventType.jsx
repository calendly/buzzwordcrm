import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { useForm, Controller } from 'react-hook-form';

export default () => {
  const [eventType, setEventType] = useState([]);
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState();
  const [copyDate, setCopyDate] = useState(date);
  const [eventUri, setEventUri] = useState();

  const { uuid } = useParams();

  const fetchData = async () => {
    const result = await fetch(`/api/event_types/${uuid}`).then((res) =>
      res.json()
    );

    setEventType(result.eventType);
  };

  const fetchEventTypeSlotsData = async (startTime, endTime) => {
    let queryParams = `?start_time=${startTime}&end_time=${endTime}&event_uri=${eventType.uri}`
    const result = await fetch(`/api/event_type_avail_times${queryParams}`).then((res) => res.json())

    seEventTypesSlots(result.collection)
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setEndDate(copyDate)
  })

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
        <p>
          <strong>Duration: </strong>
          {`${eventType.duration} minutes`}
        </p>
        {/* <form onSubmit={fetchEventTypeSlotsData(date, endDate)}> */}
        <div className="event-avail-calendar">
          <DatePicker
            selected={date}
            onChange={(date) => {
              setDate(new Date(date));
              //setEndDate(new Date(date))
              setCopyDate(new Date(date.getTime()))
              // setCopyDate(copy)
              // console.log('copyDate=', copyDate)
              setEndDate(new Date(copyDate.setDate(copyDate.getDate() + 7)))
              //console.log('end=', end)
              //setEndDate(end)
              console.log('entered date=', date);
              console.log('END DATE=', endDate)
            }}
          />
        </div>
        <input type="submit" />
        {/* </form> */}
        {/* <p>End Date: {enteredDate && }</p> */}
      </div>
    </div>
  );
};
