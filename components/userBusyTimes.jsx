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
  const [monTotalBusy, setMonTotalBusy] = useState(0);
  const [tuesTotalBusy, setTuesTotalBusy] = useState(0);
  const [wedTotalBusy, setWedTotalBusy] = useState(0);
  const [thursTotalBusy, setThursTotalBusy] = useState(0);
  const [friTotalBusy, setFriTotalBusy] = useState(0);
  const [satTotalBusy, setSatTotalBusy] = useState(0);
  const [sunTotalBusy, setSunTotalBusy] = useState(0);
  const [monTotalAvail, setMonTotalAvail] = useState(0);
  const [tuesTotalAvail, setTuesTotalAvail] = useState(0);
  const [wedTotalAvail, setWedTotalAvail] = useState(0);
  const [thursTotalAvail, setThursTotalAvail] = useState(0);
  const [friTotalAvail, setFriTotalAvail] = useState(0);
  const [satTotalAvail, setSatTotalAvail] = useState(0);
  const [sunTotalAvail, setSunTotalAvail] = useState(0);
  const [namedUser, setNamedUser] = useState();

  const busyTimesObj = {};

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

  const scheduledHoursAndAvailTotals = {
    monday: [monTotalBusy, monTotalAvail],
    tuesday: [tuesTotalBusy, tuesTotalAvail],
    wednesday: [wedTotalBusy, wedTotalAvail],
    thursday: [thursTotalBusy, thursTotalAvail],
    friday: [friTotalBusy, friTotalAvail],
    saturday: [satTotalBusy, satTotalAvail],
    sunday: [sunTotalBusy, sunTotalAvail],
  };

  const fetchBusyTimesData = async () => {
    const result = await fetch(
      `/api/user_busy_times?user=${user}${queryParams}`
    ).then((res) => res.json());

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

  const fetchUser = async () => {
    const result = await fetch(
      `/api/users/${user.split('/')[4]}`
    ).then((res) => res.json())

    setNamedUser(result.resource)
  }

  const getDayOfWeek = (date) => {
    return new Date(date)
      .toLocaleDateString('default', { weekday: 'long' })
      .toLocaleLowerCase();
  };

  const convertToHumanReadableTime = (milliseconds) => {
    const hours = (milliseconds / (60 * 60 * 1000)).toFixed(2);
    const splitHours = hours.toString().split('.');
    let humanReadable;

    if(parseInt(splitHours[0]) === 0 && parseInt(splitHours[1]) === 0) {
      return 'N/A'
    }

    if (parseInt(splitHours[0]) > 0) {
      humanReadable = `${parseInt(splitHours[0])} hour(s) and ${Math.floor(
        (60 * parseInt(splitHours[1])) / 100
      )} minutes`;
    } else {
      humanReadable = `${Math.ceil(
        (60 * parseInt(splitHours[1])) / 100
      )} minutes`;
    }

    return humanReadable;
  };

  const setTotalHoursAvailToBook = (scheduledHours, availableHours) => {
    const diff = Math.abs(scheduledHours - availableHours)
    const humanReadable = convertToHumanReadableTime(diff)
    return humanReadable
  }

  if (busyTimes?.length) {
    busyTimes.map((meeting, i) => {
      if (!busyTimesObj[getDayOfWeek(meeting.date)]) {
        busyTimesObj[getDayOfWeek(meeting.date)] = [];
        busyTimesObj[getDayOfWeek(meeting.date)].push(
          `${meeting.date}, ${meeting.start_time_formatted}-${meeting.end_time_formatted}`
        );
      } else {
        busyTimesObj[getDayOfWeek(meeting.date)].push(
          `${meeting.date}, ${meeting.start_time_formatted}-${meeting.end_time_formatted}`
        );
      }
    });
  }

  const setBusyHours = () => {
    let monTotal = 0;
    let tuesTotal = 0;
    let wedTotal = 0;
    let thursTotal = 0;
    let friTotal = 0;
    let satTotal = 0;
    let sunTotal = 0;

    if (busyTimes?.length) {
      busyTimes.map((timeRangeObj) => {
        if (getDayOfWeek(timeRangeObj.start_time) === 'monday') {
          const startTime = moment(
            new Date(timeRangeObj.start_time),
            'HH:mm:ss a'
          );
          const endTime = moment(new Date(timeRangeObj.end_time), 'HH:mm:ss a');
          const duration = moment.duration(endTime.diff(startTime));
          setMonTotalBusy((monTotal += duration));
        } else if (getDayOfWeek(timeRangeObj.start_time) === 'tuesday') {
          const startTime = moment(
            new Date(timeRangeObj.start_time),
            'HH:mm:ss a'
          );
          const endTime = moment(new Date(timeRangeObj.end_time), 'HH:mm:ss a');
          const duration = moment.duration(endTime.diff(startTime));
          setTuesTotalBusy((tuesTotal += duration));
        } else if (getDayOfWeek(timeRangeObj.start_time) === 'wednesday') {
          const startTime = moment(
            new Date(timeRangeObj.start_time),
            'HH:mm:ss a'
          );
          const endTime = moment(new Date(timeRangeObj.end_time), 'HH:mm:ss a');
          const duration = moment.duration(endTime.diff(startTime));
          setWedTotalBusy((wedTotal += duration));
        } else if (getDayOfWeek(timeRangeObj.start_time) === 'thursday') {
          const startTime = moment(
            new Date(timeRangeObj.start_time),
            'HH:mm:ss a'
          );
          const endTime = moment(new Date(timeRangeObj.end_time), 'HH:mm:ss a');
          const duration = moment.duration(endTime.diff(startTime));
          setThursTotalBusy((thursTotal += duration));
        } else if (getDayOfWeek(timeRangeObj.start_time) === 'friday') {
          const startTime = moment(
            new Date(timeRangeObj.start_time),
            'HH:mm:ss a'
          );
          const endTime = moment(new Date(timeRangeObj.end_time), 'HH:mm:ss a');
          const duration = moment.duration(endTime.diff(startTime));
          setFriTotalBusy((friTotal += duration));
        } else if (getDayOfWeek(timeRangeObj.start_time) === 'saturday') {
          const startTime = moment(
            new Date(timeRangeObj.start_time),
            'HH:mm:ss a'
          );
          const endTime = moment(new Date(timeRangeObj.end_time), 'HH:mm:ss a');
          const duration = moment.duration(endTime.diff(startTime));
          setSatTotalBusy((satTotal += duration));
        } else if (getDayOfWeek(timeRangeObj.start_time) === 'sunday') {
          const startTime = moment(
            new Date(timeRangeObj.start_time),
            'HH:mm:ss a'
          );
          const endTime = moment(new Date(timeRangeObj.end_time), 'HH:mm:ss a');
          const duration = moment.duration(endTime.diff(startTime));
          setSunTotalBusy((sunTotal += duration));
        }
      });
    }
  };

  setAvailHours = () => {
    let monTotal = 0;
    let tuesTotal = 0;
    let wedTotal = 0;
    let thursTotal = 0;
    let friTotal = 0;
    let satTotal = 0;
    let sunTotal = 0;

    if (schedule?.length) {
      //Below appears repetitive, but the conditionals are quite precise and different states are set accordingly
      schedule.map((availability) => {
        availability.rules.map((rule) => {
          const milliseconds = new Date(rule.date).getTime();
          const endCheck = new Date(endTime).getTime();
          if (rule.type === 'wday' && rule.intervals.length) {
            if (rule.wday === 'monday') {
              rule.intervals.map((range) => {
                const fromTime = moment(range.from, 'HH:mm:ss a');
                const toTime = moment(range.to, 'HH:mm:ss a');
                const duration = moment.duration(toTime.diff(fromTime));
                setMonTotalAvail((monTotal += duration));
              });
            } else if (rule.wday === 'tuesday') {
              rule.intervals.map((range) => {
                const fromTime = moment(range.from, 'HH:mm:ss a');
                const toTime = moment(range.to, 'HH:mm:ss a');
                const duration = moment.duration(toTime.diff(fromTime));
                setTuesTotalAvail((tuesTotal += duration));
              });
            } else if (rule.wday === 'wednesday') {
              rule.intervals.map((range) => {
                const fromTime = moment(range.from, 'HH:mm:ss a');
                const toTime = moment(range.to, 'HH:mm:ss a');
                const duration = moment.duration(toTime.diff(fromTime));
                setWedTotalAvail((wedTotal += duration));
              });
            } else if (rule.wday === 'thursday') {
              rule.intervals.map((range) => {
                const fromTime = moment(range.from, 'HH:mm:ss a');
                const toTime = moment(range.to, 'HH:mm:ss a');
                const duration = moment.duration(toTime.diff(fromTime));
                setThursTotalAvail((thursTotal += duration));
              });
            } else if (rule.wday === 'friday') {
              rule.intervals.map((range) => {
                const fromTime = moment(range.from, 'HH:mm:ss a');
                const toTime = moment(range.to, 'HH:mm:ss a');
                const duration = moment.duration(toTime.diff(fromTime));
                setFriTotalAvail((friTotal += duration));
              });
            } else if (rule.wday === 'saturday') {
              rule.intervals.map((range) => {
                const fromTime = moment(range.from, 'HH:mm:ss a');
                const toTime = moment(range.to, 'HH:mm:ss a');
                const duration = moment.duration(toTime.diff(fromTime));
                setSatTotalAvail((satTotal += duration));
              });
            } else if (rule.wday === 'sunday') {
              rule.intervals.map((range) => {
                const fromTime = moment(range.from, 'HH:mm:ss a');
                const toTime = moment(range.to, 'HH:mm:ss a');
                const duration = moment.duration(toTime.diff(fromTime));
                setSunTotalAvail((sunTotal += duration));
              });
            }
          }
          if (
            rule.type === 'date' &&
            milliseconds <= endCheck &&
            milliseconds >= date &&
            rule.intervals.length
          ) {
            if (
              //The date is the the format yyyy-mm-dd, which doesn't work with the Date constructor
              getDayOfWeek(rule.date.split('-').join('/')) === 'monday'
            ) {
              rule.intervals.map((range) => {
                const fromTime = moment(range.from, 'HH:mm:ss a');
                const toTime = moment(range.to, 'HH:mm:ss a');
                const duration = moment.duration(toTime.diff(fromTime));
                setMonTotalAvail((monTotal += duration));
              });
            } else if (
              getDayOfWeek(rule.date.split('-').join('/')) === 'tuesday'
            ) {
              rule.intervals.map((range) => {
                const fromTime = moment(range.from, 'HH:mm:ss a');
                const toTime = moment(range.to, 'HH:mm:ss a');
                const duration = moment.duration(toTime.diff(fromTime));
                setTuesTotalAvail((tuesTotal += duration));
              });
            } else if (
              getDayOfWeek(rule.date.split('-').join('/')) === 'wednesday'
            ) {
              rule.intervals.map((range) => {
                const fromTime = moment(range.from, 'HH:mm:ss a');
                const toTime = moment(range.to, 'HH:mm:ss a');
                const duration = moment.duration(toTime.diff(fromTime));
                setWedTotalAvail((wedTotal += duration));
              });
            } else if (
              getDayOfWeek(rule.date.split('-').join('/')) === 'thursday'
            ) {
              rule.intervals.map((range) => {
                const fromTime = moment(range.from, 'HH:mm:ss a');
                const toTime = moment(range.to, 'HH:mm:ss a');
                const duration = moment.duration(toTime.diff(fromTime));
                setThursTotalAvail((thursTotal += duration));
              });
            } else if (
              getDayOfWeek(rule.date.split('-').join('/')) === 'friday'
            ) {
              rule.intervals.map((range) => {
                const fromTime = moment(range.from, 'HH:mm:ss a');
                const toTime = moment(range.to, 'HH:mm:ss a');
                const duration = moment.duration(toTime.diff(fromTime));
                setFriTotalAvail((friTotal += duration));
              });
            } else if (
              getDayOfWeek(rule.date.split('-').join('/')) === 'saturday'
            ) {
              rule.intervals.map((range) => {
                const fromTime = moment(range.from, 'HH:mm:ss a');
                const toTime = moment(range.to, 'HH:mm:ss a');
                const duration = moment.duration(toTime.diff(fromTime));
                setSatTotalAvail((satTotal += duration));
              });
            } else if (
              getDayOfWeek(rule.date.split('-').join('/')) === 'sunday'
            ) {
              rule.intervals.map((range) => {
                const fromTime = moment(range.from, 'HH:mm:ss a');
                const toTime = moment(range.to, 'HH:mm:ss a');
                const duration = moment.duration(toTime.diff(fromTime));
                setSunTotalAvail((sunTotal += duration));
              });
            }
          }
        });
      });
    }
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
    setAvailHours();
  });

  useEffect(() => {
    setTotalHoursAvailToBook()
  })

  useEffect(() => {
    fetchUser();
  }, [])

  return (
    <div className="event-avail-selection-box">
      <h5>{`${namedUser?.name.split(' ')[0] || ''}'s Availability`}</h5>
      <h6 className="event-avail-header">
        Choose a start DATE/TIME below, then click SUBMIT
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
      {/* With regards to setting keys in mapping, only Calendly meetings have a unique identifier. */}
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
                  <th>Total Available Hours To Book</th>
                </tr>
              </thead>
              <tbody>
                {weekDays.map((day, i) => (
                  <tr key={i}>
                    <td>{`${day.toLocaleUpperCase()}`}</td>
                    <td>
                      {!weekdayAvailability[day].every((array) => !array.length)
                        ? weekdayAvailability[day].map((range, i) => {
                            if (range.length) {
                              return <p key={i}>{`${range}`}</p>;
                            }
                          })
                        : 'Unavailable'}
                      {!weekdayAvailability[day].every((array) => !array.length)
                        ? weekdayAvailability['dates'].map((array, i) => {
                            if (array.includes(day) && array[2].length) {
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
                          })
                        : ''}
                    </td>
                    <td>
                      {Object.keys(busyTimesObj).length && busyTimesObj[day]
                        ? busyTimesObj[day].map((range, i) => (
                            <p key={i}>{`${range}`}</p>
                          ))
                        : 'N/A'}
                    </td>
                    <td>
                      {convertToHumanReadableTime(scheduledHoursAndAvailTotals[day][0])}
                    </td>
                    <td>
                      {setTotalHoursAvailToBook(scheduledHoursAndAvailTotals[day][0], scheduledHoursAndAvailTotals[day][1])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
