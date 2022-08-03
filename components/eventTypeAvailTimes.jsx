import React, { useState, useEffect, useContext } from 'react';
import { UriContext } from './eventType'
import { useSearchParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';

export default () => {
    const [date, setDate] = useState(new Date());
    const eventUri = useContext(UriContext)
    console.log('eventUri from event type avail component=', eventUri)
    //const eventUri = useContext(UriContext);
//   const [eventTypesSlots, seEventTypesSlots] = useState([]);
//   const [eventType, setEventType] = useState([]);
const [startTime, setStartTime] = useState();
const [endTime, setEndTime] = useState();
//const [eventUri, setEventUri] = useState();

//   const { uuid } = useParams();

const fetchEventTypeSlotsData = async (startTime, endTime, eventUri) => {
    //event.preventDefault()
    let queryParams = `?start_time=${startTime}&end_time=${endTime}&event_uri=${eventType.uri}`;
    let path = `/event_type_avail_times${queryParams}`
    const result = await fetch(
      `/api/event_type_available_times${queryParams}`
    ).then((res) => console.log(res));
    navigate(path)
    //console.log('eventUri=', eventType.uri);

    //seEventTypesSlots(result.collection);
  };

//   const fetchEventTypeData = async () => {
//     const result = await fetch(`/api/event_types/${uuid}`).then((res) =>
//       res.json()
//     );

//     setEventType(result.eventType);
//   };

//   const fetchEventTypeSlotsData = async () => {
//     const result = await fetch('/api/event_type_avail_times').then((res) => res.json())

//     seEventTypesSlots(result.collection)
//   }

  return (
    <div>{`The event uri is ${eventUri}`}</div>
  )

};

// console.log('eventType=', eventType)
// console.log('eventTypeSlots=', eventTypesSlots)
