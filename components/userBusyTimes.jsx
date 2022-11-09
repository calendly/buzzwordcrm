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
  const [totalScheduledHours, setTotalScheduledHours] = useState(0);
  const [totalScheduledHoursMilli, setTotalScheduledHoursMilli] = useState(0);
  const [totalAvailHoursMilli, setTotalAvailHoursMilli] = useState(0);
  const [totalAvailToBook, settotalAvailToBook] = useState(0);

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

  const fetchBusyTimesData = async () => {
    const result = await fetch(
      `/api/user_busy_times?user=${user}${queryParams}`
    ).then((res) => res.json());

    setBusyTimes(result.busyTimes);
  };

  const setBusyHours = () => {
    let total = 0;

    if (busyTimes?.length) {
      busyTimes.map((timeRangeObj) => {
        const startTime = moment(
          new Date(timeRangeObj.start_time),
          'HH:mm:ss a'
        );
        const endTime = moment(new Date(timeRangeObj.end_time), 'HH:mm:ss a');
        const duration = moment.duration(endTime.diff(startTime));
        total += duration
      });
    }
    total = (total/(60 * 60 * 1000)).toFixed(2)
    const splitTotal = total.toString().split('.')
    const humanReadableTotal = `${parseInt(splitTotal[0])} hours and ${Math.floor((60 * ((parseInt(splitTotal[1]))))/100)} minutes`
    
    setTotalScheduledHours(humanReadableTotal)
    setTotalScheduledHoursMilli(total)
  };

  setAvailHours = () => {
    const availSchedArr = []
    let total = 0
    if (schedule?.length) {
      schedule.map((availability, i) =>
        availability.rules.map((rule) => {
          const milliseconds = new Date(rule.date).getTime();
          const endCheck = new Date(endTime).getTime();
          if (
            rule.type === 'date' &&
            milliseconds <= endCheck &&
            milliseconds >= date &&
            rule.intervals.length
          ) {
            availSchedArr.push(rule.intervals)
          } else if (rule.type === 'wday' && rule.intervals.length) {
            availSchedArr.push(rule.intervals);
          }
        })
      );
    }
    availSchedArr.map((timeArr) => {
      timeArr.map((range) => {
        const fromTime = moment(
        range.from,
        'HH:mm:ss a'
      );
      const toTime = moment(range.to, 'HH:mm:ss a');
      const duration = moment.duration(toTime.diff(fromTime));
      total += duration
      })
      
    });
    total = (total/(60 * 60 * 1000)).toFixed(2)
    setTotalAvailHoursMilli(total)
    const availHoursToBook = Math.abs(totalAvailHoursMilli - totalScheduledHoursMilli)
    const splitTotal = availHoursToBook.toString().split('.')
    const humanReadableTotal = `${parseInt(splitTotal[0])} hours and ${Math.floor((60 * ((parseInt(splitTotal[1]))))/100)} minutes`
    settotalAvailToBook(humanReadableTotal)
  }

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
      if (weekDays.includes(range)) {
        availability[range].map((timeRanges, i) => {
          const finalRange = [];
          timeRanges.map((timeRangeObj) => {
            if (timeRanges.length && typeof timeRangeObj === 'object') {
              formattedRange = `${moment(timeRangeObj.from, 'H:mm').format(
                'h:mm A'
              )}-${moment(timeRangeObj.to, 'H:mm').format('h:mm A')}`;
              finalRange.push(formattedRange);
              if (finalRange.length) availability[range][i] = finalRange;
            }
          });
        });
      }
    }
  };

  formatDatesArrTimeRange = (datesArray) => {
    let formattedRange;
    datesArray.map((weekDayArr) => {
      const finalRange = [];
      weekDayArr[2].map((range, i) => {
        formattedRange = `${moment(range.from, 'H:mm').format(
          'h:mm A'
        )}-${moment(range.to, 'H:mm').format('h:mm A')}`;
        finalRange.push(formattedRange);
        weekDayArr[2] = finalRange;
      });
    });
  };

  if (schedule?.length) {
    schedule.map((availability, i) =>
      availability.rules.map((rule) => {
        const milliseconds = new Date(rule.date).getTime();
        const endCheck = new Date(endTime).getTime();
        if (
          rule.type === 'date' &&
          milliseconds <= endCheck &&
          milliseconds >= date
        ) {
          const weekdayNum = new Date(rule.date).getDay();

          weekdayAvailability['dates'].push([
            weekDays[weekdayNum],
            rule.date,
            rule.intervals,
          ]);

          weekdayAvailability[`${weekDays[weekdayNum]}`].sort();
        } else if (rule.type === 'wday') {
          weekdayAvailability[`${rule.wday}`].push(rule.intervals);
          weekdayAvailability[`${rule.wday}`].sort();
        }
      })
    );

    formatAvailScheduleTime(weekdayAvailability);
    formatDatesArrTimeRange(weekdayAvailability['dates']);
  }

  if (weekdayAvailability.dates.length && showAlert) {
    //This checks if each day of the week is empty; thus, the user is unavailable for the 7-day period
    const sevenDaysCheck = weekdayAvailability.dates.filter(
      (date) => !date[2].length
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

  useEffect(() => {
    fetchBusyTimesData();
  }, []);

  useEffect(() => {
    fetchUserAvailabilityData();
  }, []);

  useEffect(() => {
    setBusyHours();
  });

  useEffect(() => {
    setAvailHours()
  })

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
                fetchBusyTimesData();
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
                  <th>Availability Range(s)</th>
                </tr>
              </thead>
              {weekdayAvailability && (
                <tbody>
                  <tr>
                    <td>
                      <ul>
                        <li>
                          <strong>Monday: </strong>
                          {/* This is to check if there is no availability on this date since all of the arrays can be empty.
                          I want to avoid going into the mapping, if the arrays are all empty.  */}
                          {!weekdayAvailability['monday'].every(array => !array.length) ?  weekdayAvailability['monday'].map((range, i) => {
                            if (range.length) {
                              return <p key={i}>{`${range}`}</p>;
                            }
                          }): 'Unavailable'}
                          {!weekdayAvailability['monday'].every(array => !array.length) ?  weekdayAvailability['dates'].map((array, i) => {
                            if (array.includes('monday')) {
                              return (
                                <div key={i}>
                                  <strong>{`${array[1]}`}</strong>
                                  {array[2].map((timeRange, i) => (
                                    <ul key={i}>
                                      <li>{`${timeRange}`}</li>
                                    </ul>
                                  ))}
                                </div>
                              );
                            }
                          }): ''}
                        </li>
                        <li>
                          <strong>Tuesday: </strong>
                          {!weekdayAvailability['tuesday'].every(array => !array.length) ?  weekdayAvailability['tuesday'].map((range, i) => {
                            if (range.length) {
                              return <p key={i}>{`${range}`}</p>;
                            }
                          }): 'Unavailable'}
                          {!weekdayAvailability['tuesday'].every(array => !array.length) ? weekdayAvailability['dates'].map((array, i) => {
                            if (array.includes('tuesday')) {
                              return (
                                <div key={i}>
                                  <strong>{`${array[1]}`}</strong>
                                  {array[2].map((timeRange, i) => (
                                    <ul key={i}>
                                      <li>{`${timeRange}`}</li>
                                    </ul>
                                  ))}
                                </div>
                              );
                            }
                          }): ''}
                        </li>
                        <li>
                          <strong>Wednesday: </strong>
                          {!weekdayAvailability['wednesday'].every(array => !array.length) ? weekdayAvailability['wednesday'].map((range, i) => {
                            if (range.length) {
                              return <p key={i}>{`${range}`}</p>;
                            }
                          }): 'Unavailable'}
                          {!weekdayAvailability['wednesday'].every(array => !array.length) ? weekdayAvailability['dates'].map((array, i) => {
                            if (array.includes('wednesday')) {
                              return (
                                <div key={i}>
                                  <strong>{`${array[1]}`}</strong>
                                  {array[2].map((timeRange, i) => (
                                    <ul key={i}>
                                      <li>{`${timeRange}`}</li>
                                    </ul>
                                  ))}
                                </div>
                              );
                            }
                          }): ''}
                        </li>
                        <li>
                          <strong>Thursday: </strong>
                          {!weekdayAvailability['thursday'].every(array => !array.length) ? weekdayAvailability['thursday'].map((range, i) => {
                            if (range.length) {
                              return <p key={i}>{`${range}`}</p>;
                            }
                          }): 'Unavailable'}
                          {!weekdayAvailability['thursday'].every(array => !array.length) ? weekdayAvailability['dates'].map((array, i) => {
                            if (array.includes('thursday')) {
                              return (
                                <div key={i}>
                                  <strong>{`${array[1]}`}</strong>
                                  {array[2].map((timeRange, i) => (
                                    <ul key={i}>
                                      <li>{`${timeRange}`}</li>
                                    </ul>
                                  ))}
                                </div>
                              );
                            }
                          }): ''}
                        </li>
                        <li>
                          <strong>Friday: </strong>
                          {!weekdayAvailability['friday'].every(array => !array.length) ? weekdayAvailability['friday'].map((range, i) => {
                            if (range.length) {
                              return <p key={i}>{`${range}`}</p>;
                            }
                          }): 'Unavailable'}
                          {!weekdayAvailability['friday'].every(array => !array.length) ? weekdayAvailability['dates'].map((array, i) => {
                            if (array.includes('friday')) {
                              return (
                                <div key={i}>
                                  <strong>{`${array[1]}`}</strong>
                                  {array[2].map((timeRange, i) => (
                                    <ul key={i}>
                                      <li>{`${timeRange}`}</li>
                                    </ul>
                                  ))}
                                </div>
                              );
                            }
                          }): ''}
                        </li>
                        <li>
                          <strong>Saturday: </strong>
                          {/* {weekdayAvailability['saturday'].every(array => !array.length) && <p>Unavailable</p>} */}
                          {!weekdayAvailability['saturday'].every(array => !array.length) ? weekdayAvailability['saturday'].map((range, i) => {
                            if (range.length) {
                              return <p key={i}>{`${range}`}</p>;
                            }
                          }): 'Unavailable'}
                          {!weekdayAvailability['saturday'].every(array => !array.length) ?  weekdayAvailability['dates'].map((array, i) => {
                            if (array.includes('saturday')) {
                              return (
                                <div key={i}>
                                  <strong>{`${array[1]}`}</strong>
                                  {array[2].map((timeRange, i) => (
                                    <ul key={i}>
                                      <li>{`${timeRange}`}</li>
                                    </ul>
                                  ))}
                                </div>
                              );
                            }
                          }): ''}
                        </li>
                        <li>
                          <strong>Sunday: </strong>

                          {!weekdayAvailability['sunday'].every(array => !array.length) ?  weekdayAvailability['sunday'].map((range, i) => {
                            if (range.length) {
                              return <p key={i}>{`${range}`}</p>;
                            }
                          }): 'Unavailable'}
                          {!weekdayAvailability['sunday'].every(array => !array.length) ?  weekdayAvailability['dates'].map((array, i) => {
                            if (array.includes('sunday')) {
                              return (
                                <div key={i}>
                                  <strong>{`${array[1]}`}</strong>
                                  {array[2].map((timeRange, i) => (
                                    <ul key={i}>
                                      <li>{`${timeRange}`}</li>
                                    </ul>
                                  ))}
                                </div>
                              );
                            }
                          }): ''}
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
            <table className="striped centered">
              <thead>
                <tr>
                  <th>Day of Week</th>
                  <th>Unavailable Times</th>
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
                      <td>{`${meeting.date}, ${meeting.start_time_formatted}-${meeting.end_time_formatted}`}</td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
            <table className="striped centered">
              <thead>
                <tr>
                  <th>Total Scheduled Hours</th>
                  <th>Total Available Hours To Book</th>
                </tr>
              </thead>
              {totalScheduledHours && (
                <tbody>
                    <tr>
                      <td>{totalScheduledHours}</td>
                      <td>{totalAvailToBook}</td>
                    </tr>
                  
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
