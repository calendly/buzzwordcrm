import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';

var endDate;

export default () => {
  const location = useLocation().search;
  const eventUri = new URLSearchParams(location).get('event_type');
  const [eventType, setEventType] = useState([]);
  const [eventTypesSlots, seEventTypesSlots] = useState([]);
  const [date, setDate] = useState(new Date());
  const [queryParams, setQueryParams] = useState();

  const fetchEventTypeData = async () => {
    const uuid = eventUri.split('/')[4]
    const result = await fetch(`/api/event_types/${uuid}`).then((res) => res.json())
    
    setEventType(result.eventType)
  }

  const fetchEventTypeSlotsData = async () => {
    
    const result = await fetch(
      `/api/event_type_available_times${queryParams}`
    ).then((res) => res.json());
   
    seEventTypesSlots(result.collection);
  };

  console.log('eventTypesSlots=', eventTypesSlots)

  useEffect(() => {
    fetchEventTypeData()
  }, [])

  return (
    <div className='event-container'>
        <h5>Check Availability for "{eventType.name}"</h5>
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
              setQueryParams(`?start_time=${date.toISOString()}&end_time=${endDate.toISOString()}&event_type=${eventUri}`);
            }}
          />
        </div>
        <button
          onClick={() => {
            fetchEventTypeSlotsData()
          }
            
          }
        >
          Submit
        </button>
    </div>
  )
};
