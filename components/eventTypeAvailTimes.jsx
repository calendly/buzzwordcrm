import React, { useState, useEffect } from 'react';
import eventType from './eventType';
import { useDatepicker, useMonth, useDay } from '@datepicker-react/hooks';

export default () => {
  const [eventTypesSlots, seEventTypesSlots] = useState([]);
  const [eventType, setEventType] = useState([]);

  const { uuid } = useParams();

  const fetchEventTypeData = async () => {
    const result = await fetch(`/api/event_types/${uuid}`).then((res) =>
      res.json()
    );

    setEventType(result.eventType);
  };

  const fetchEventTypeSlotsData = async () => {
    const result = await fetch('/api/event_type_avail_times').then((res) => res.json())

    seEventTypesSlots(result.collection)
  }

  return (
    <Datepicker />
  )

};

console.log('eventType=', eventType)
console.log('eventTypeSlots=', eventTypesSlots)
