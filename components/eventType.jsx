import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import EventTypeAvailTimes from './eventTypeAvailTimes';

var endDate;

export const UriContext = React.createContext()

export default () => {
  const [eventType, setEventType] = useState([]);
  const [date, setDate] = useState(new Date());
  const [eventTypesSlots, seEventTypesSlots] = useState([]);
  const [eventUri, setEventUri] = useState();

  const { uuid } = useParams();
  // const value = eventType.uri
  //console.log('UriContext=', UriContext)

  const fetchData = async () => {
    const result = await fetch(`/api/event_types/${uuid}`).then((res) =>
      res.json()
    );

    setEventType(result.eventType);
    setEventUri(result.eventType.uri)
  };

  const fetchEventTypeSlotsData = async (startTime, endTime) => {
    //event.preventDefault()
    let queryParams = `?start_time=${startTime}&end_time=${endTime}&event_uri=${eventType.uri}`;
  
    const result = await fetch(
      `/api/event_type_available_times${queryParams}`
    ).then((res) => console.log(res));
   
    //console.log('eventUri=', eventType.uri);

    //seEventTypesSlots(result.collection);
  };


  //console.log('eventTypesSlots=', eventTypesSlots);

  // const handleDateChange = () => {
  //   setDate(new Date(date));
  //   setCopyDate(new Date(date.getTime()));
  //   console.log('copyDate=', copyDate);
  //   let dayDiff = date.getDay() - copyDate.getDay();
  //   setEndDate(new Date(copyDate.setDate(copyDate.getDate() + 7 + dayDiff)));
  //   console.log('entered date=', date);
  //   console.log('END DATE=', endDate);
  // };

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   handleDateChange()
  // }, [date])
//let value = eventUri
//console.log('value=', value)
  return (
    <React.Fragment>
    <UriContext.Provider value={eventUri}>
        <EventTypeAvailTimes style={{opacity: 0.0}}/>
    </UriContext.Provider>
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
        <h6 className="event-type-avail-banner">
          Click below to see availability for this event type by start date
        </h6>
        <div>
          <strong>
            *Note: Time range will be 7 days from your chosen start date
          </strong>
        </div>
        <div className="event-avail-calendar">
          <DatePicker
            selected={date}
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
            onChange={(date) => {
              setDate(new Date(date));
              let copyDate = new Date(date.getTime());
              endDate = new Date(copyDate.setDate(copyDate.getDate() + 7));
            }}
          />
        </div>
        <button
          onClick={() =>
            fetchEventTypeSlotsData(
              date.toISOString(),
              endDate.toISOString(),
              eventType.uri
            )
          }
        >
          Submit
        </button>
        <Link to={'/event_type_avail_times'}>Click Here to See Availability for this Event Type</Link>
        {/* <p>End Date: {enteredDate && }</p> */}
      </div>
    </div>
    </React.Fragment>
  );
};

// const EventTypeAvailTimes = () => {
//   const value = useContext(Context)

//   return (
//     <div>{value}</div>
//   )
// }
