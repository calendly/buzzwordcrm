import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { PopupButton } from 'react-calendly';

export default () => {
  const location = useLocation().search;
  const eventUri = new URLSearchParams(location).get('event_type');
  const [eventType, setEventType] = useState([]);
  const [eventTypesSlots, seEventTypesSlots] = useState([]);
  const [date, setDate] = useState('');
  const [queryParams, setQueryParams] = useState();
  const [showTime, setShowTIme] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [finalDateMillisec, setFinalDateMillisec] = useState();

  const fetchEventTypeData = async () => {
    const uuid = eventUri.split('/')[4];
    const result = await fetch(`/api/event_types/${uuid}`).then((res) =>
      res.json()
    );

    setEventType(result.eventType);
  };

  const fetchEventTypeSlotsData = async () => {
    const result = await fetch(
      `/api/event_type_available_times${queryParams}`
    ).then((res) => res.json());

    if (result.availableSlots.length === 0) {
      //This takes care of if a user sets a certain date range when an event type can be scheduled, or how far in advance the event type can be scheduled.
      const start = new Date(queryParams.split('=')[1].substring(0, 24))
        .toString()
        .split(' ');
      const end = new Date(queryParams.split('=')[2].substring(0, 24))
        .toString()
        .split(' ');

      alert(
        `\nNo available slots found\n\n\Either those times are blocked off from ${start[1]} ${start[2]}, ${start[3]} to ${end[1]} ${end[2]}, ${end[3]} or this event cannot be scheduled so far in advance.`
      );
    }

    seEventTypesSlots(result.availableSlots);
  };

  useEffect(() => {
    fetchEventTypeData();
  }, []);

  useEffect(() => {
    fetchEventTypeSlotsData();
  }, []);

  return (
    <div className="event-avail-selection-box">
      <h5>"{eventType.name}"</h5>
      <h6 className="event-avail-header">
        Click below to see availability for this event type by start date
      </h6>
      <div>
        <strong>
          **Selected date/time must be in future. (Time range will be 7 days from
          your chosen start date.)**
        </strong>
      </div>
      <div className="date-and-time-pickers">
        <div className="date-picker">
          <DatePicker
            selected={date}
            placeholderText="CHOOSE DATE"
            minDate={new Date()}
            dateFormat="MMMM d, yyyy"
            onChange={(date) => {
              setDate(date);
              setShowTIme(true);
              const copyDate = new Date(date);
              const endDate = new Date(
                copyDate.setTime(copyDate.getTime() + 7 * 24 * 3600 * 1000)
              );
              setFinalDateMillisec(new Date(date).getTime());
              setQueryParams(
                `?start_time=${date.toISOString()}&end_time=${endDate.toISOString()}&event_type=${eventUri}`
              );
            }}
          />
        </div>
        {showTime && (
          <div className="time-picker">
            <input
              type="time"
              id="selected-time"
              name="selected-time"
              defaultValue="        --:--        "
              step="900"
              onChange={(event) => {
                let dateToModify = date.toString().split(' ');
                const time = event.target.value;
                dateToModify[4] = time;
                const dateWithTime = new Date(dateToModify.join(' '));
                setDate(dateWithTime);
                const copyDate = new Date(dateWithTime);
                const endDate = new Date(
                  copyDate.setTime(copyDate.getTime() + 7 * 24 * 3600 * 1000)
                );
                setShowSubmit(true);
                setFinalDateMillisec(new Date(dateWithTime).getTime());
                setQueryParams(
                  `?start_time=${dateWithTime.toISOString()}&end_time=${endDate.toISOString()}&event_type=${eventUri}`
                );
              }}
            ></input>
          </div>
        )}
      </div>
      {showSubmit && finalDateMillisec > new Date().getTime() && (
        <button
          onClick={() => {
            if (finalDateMillisec > new Date().getTime()) {
              fetchEventTypeSlotsData();
            } else {
              alert('Date/time selection must be in the future.');
            }
          }}
        >
          Submit
        </button>
      )}
      <div className="event-type-and-user-availability">
        {eventTypesSlots && eventTypesSlots.length ? (
          <div className="row">
            <table className="striped centered">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>Invitees Remaining</th>
                  <th>Status</th>
                  <th>Scheduling Link</th>
                </tr>
              </thead>
              {eventTypesSlots && (
                <tbody>
                  {eventTypesSlots.map((slot) => (
                    <tr key={slot.scheduling_url}>
                      <td>{`${
                        new Date(slot.start_time).toString().split(' ')[0]
                      }, ${slot.date}`}</td>
                      {slot.standard_start_time_hour.substring(0, 1) === '0' ? (
                        <td>{slot.standard_start_time_hour.substring(1)}</td>
                      ) : (
                        <td>{slot.standard_start_time_hour}</td>
                      )}
                      <td>{slot.invitees_remaining}</td>
                      <td>{`${slot.status
                        .substring(0, 1)
                        .toUpperCase()}${slot.status.substring(1)}`}</td>
                      <td className='card-action'>
                        <PopupButton
                          url={slot.scheduling_url}
                          rootElement={document.getElementById('root')}
                          text="Book this time slot"
                          styles={{
                            backgroundColor: 'rgb(238,110,115,0.1)',
                            borderRadius: 60,
                            borderWidth: 0,
                            cursor: 'pointer',
                            fontWeight: 'bolder',
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
