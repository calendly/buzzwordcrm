import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export default () => {
  const location = useLocation().search;
  const user = new URLSearchParams(location).get('user');
  const [busyTimes, setBusyTimes] = useState([]);
  const [date, setDate] = useState('');
  const [queryParams, setQueryParams] = useState();
  const [showTime, setShowTIme] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [finalDateMillisec, setFinalDateMillisec] = useState();
  const [schedule, setSchedule] = useState([]);
  const [endTime, setEndTime] = useState();
  const [availUser, setAvailUser] = useState();
  const [showAlert, setShowAlert] = useState(true);

  const weekDays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  const weekdayAvailability = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
    dates: [],
  };

  const fetchData = async () => {
    const result = await fetch(
      `/api/user_busy_times?user=${user}${queryParams}`
    ).then((res) => res.json());

    if (result.busyTimes.length === 0) {
      //This takes care of if a user sets a certain date range when an event type can be scheduled, or how far in advance the event type can be scheduled.
      const start = new Date(queryParams.split('=')[1].substring(0, 24))
        .toString()
        .split(' ');
      const end = new Date(queryParams.split('=')[2].substring(0, 24))
        .toString()
        .split(' ');

      alert(
        `\nNo availability found between ${start[1]} ${start[2]}, ${start[3]} and ${end[1]} ${end[2]}, ${end[3]} or this event cannot be scheduled so far in advance.`
      );
    }

    setBusyTimes(result.busyTimes);
  };

  const fetchUserAvailabilityData = async () => {
    //This is to avoid nested mapping through the schedules array at first render
    setAvailUser(new URLSearchParams(location).get('user'));
    const result = await fetch(
      `/api/user_availability_schedules?user=${availUser}`
    ).then((res) => res.json());

    setSchedule(result.availabilitySchedules);
  };

  formatAvailScheduleTime = (availability) => {
    for (const range in availability) {
      let formattedRange;

      availability[range].map((timeRanges, i) => {
        let finalRange = [];
        timeRanges.map((timeRangeObj) => {
          console.log('time data type= ', typeof timeRangeObj);
          if (timeRanges.length && typeof timeRangeObj === 'object') {
            formattedRange = `${moment(timeRangeObj.from, 'HH:mm').format(
              'hh:mm A'
            )}-${moment(timeRangeObj.to, 'HH:mm').format('hh:mm A')}`;
            finalRange.push(formattedRange);
            if (finalRange.length) availability[range][i] = finalRange;
          }
        });
      });
    }
  };

  if (schedule?.length) {
    schedule.map((availability) =>
      availability.rules.map((rule) => {
        console.log('rule= ', rule);
        const milliseconds = new Date(rule.date).getTime();
        const endCheck = new Date(endTime).getTime();
        if (
          rule.type === 'date' &&
          milliseconds <= endCheck &&
          milliseconds >= date
        ) {
          const weekdayNum = new Date(rule.date).getDay();

          weekdayAvailability['dates'].push(rule.intervals, [
            weekDays[weekdayNum],
          ]);
        } else if (rule.type === 'wday') {
          weekdayAvailability[`${rule.wday}`].push(rule.intervals);
        }
      })
    );
    formatAvailScheduleTime(weekdayAvailability);
  }

  if (weekdayAvailability.dates.length && showAlert) {
    //This checks if each day of the week is empty; thus, the user is unavailable for the 7-day period
    const sevenDaysCheck = weekdayAvailability.dates.filter(
      (date) => !date.length
    );
    if (sevenDaysCheck.length >= 7) {
      
      const start = new Date(queryParams.split('=')[1].substring(0, 24))
        .toString()
        .split(' ');
      const end = new Date(queryParams.split('=')[2].substring(0, 24))
        .toString()
        .split(' ');

      alert(
        `\nNo availability found between ${start[1]} ${start[2]}, ${start[3]} and ${end[1]} ${end[2]}, ${end[3]}`
      );
      setShowAlert(!showAlert);
      window.location.reload();
    }
  }

  console.log('avail schedule= ', weekdayAvailability)

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchUserAvailabilityData();
  }, []);

  return (
    <div className="event-avail-selection-box">
      <h6 className="event-avail-header">
        Click below to see **Rasheeda's** availability for by start date
      </h6>
      <div>
        <strong>
          **Selected date/time must be in future. (Time range will be 7 days
          from your chosen start date.)**
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
              setEndTime(endDate);
              setFinalDateMillisec(new Date(date).getTime());
              setQueryParams(
                `&start_time=${date.toISOString()}&end_time=${endDate.toISOString()}`
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
                setEndTime(endDate);
                setShowSubmit(true);
                setFinalDateMillisec(new Date(dateWithTime).getTime());
                setQueryParams(
                  `&start_time=${dateWithTime.toISOString()}&end_time=${endDate.toISOString()}`
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
              {
                fetchData();
                fetchUserAvailabilityData();
              }
            } else {
              alert('Date/time selection must be in the future.');
            }
          }}
        >
          Submit
        </button>
      )}
      <div className="event-type-and-user-availability">
        {busyTimes?.length && schedule?.length ? (
          <div className="row">
            <table className="striped centered">
              <thead>
                <tr>
                  <th>Day of Week</th>
                  <th>Availability Range(s)</th>
                  <th>Unavailable Times</th>
                  <th>Total Scheduled Hours</th>
                  <th>Total Available Hours</th>
                </tr>
              </thead>
              {busyTimes && (
                <tbody>
                  {busyTimes.map((meeting, i) => (
                    //Only Calendly meetings have the event property. External events don't have a unique identifier.
                    <tr key={meeting.event?.uri ? meeting.event.uri : i}>
                      <td>
                        {new Date(meeting.start_time).toLocaleDateString(
                          'default',
                          { weekday: 'long' }
                        )}
                      </td>
                      <td>Nothing yet</td>
                      <td>{`${meeting.date}, ${meeting.start_time_formatted}-${meeting.end_time_formatted}`}</td>
                      <td>Nothing yet</td>
                      <td>Nothing yet</td>
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
      <div style={{ color: 'black' }}>{JSON.stringify(busyTimes)}</div>
      <div style={{ color: 'black' }}>{JSON.stringify(schedule)}</div>
    </div>
  );
};
