import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { PopupButton } from 'react-calendly';
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

  const weekdayAvailabilityForRender = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
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

    let countDays = 0;
    result.availabilitySchedules.forEach((schedule) => {
      schedule.rules.forEach((rule) => {
        const endCheck = JSON.stringify(new Date(endTime))
          .split('T')[0]
          .slice(1);
        const startCheck = JSON.stringify(new Date(date))
          .split('T')[0]
          .slice(1);

        if (
          rule.date >= startCheck &&
          rule.date <= endCheck &&
          !rule.intervals.length
        ) {
          countDays++;
        }
      });
    });

    //This takes care of when the requested user has no availability across the entire 7-day range.
    //Data is always returned from this endpoint because there is no date param (just a user param), so looping through the data is required.
    //You would think countDays should be 6, but rendering requires multiplying by 2
    //You have to take into account if user chooses a start date that pushes the queried date range to the next day, so subtract by 1 X 2 = 2, thus 10
    if (countDays >= 10) {
      const start = new Date(date).toString().split(' ');
      const end = new Date(endTime).toString().split(' ');
      alert(
        `\nNo availability found between ${start[1]} ${start[2]}, ${start[3]} and ${end[1]} ${end[2]}, ${end[3]}`
      );
      window.location.reload();
    }

    setSchedule(result.availabilitySchedules);
  };

  const fetchUser = async () => {
    const result = await fetch(`/api/users/${user.split('/')[4]}`).then((res) =>
      res.json()
    );

    setNamedUser(result.resource);
  };

  const getDayOfWeek = (date) => {
    return new Date(date)
      .toLocaleDateString('default', { weekday: 'long' })
      .toLocaleLowerCase();
  };

  const convertToHumanReadableTime = (milliseconds) => {
    const hours = (milliseconds / (60 * 60 * 1000)).toFixed(2);
    const splitHours = hours.toString().split('.');
    let humanReadable;

    if (parseInt(splitHours[0]) === 0 && parseInt(splitHours[1]) === 0) {
      return 'N/A';
    }

    if (parseInt(splitHours[0]) > 0) {
      humanReadable = `${parseInt(splitHours[0])} hour(s) and ${Math.round(
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
    if (availableHours < scheduledHours) {
      return 'No availability';
    } else if (availableHours > scheduledHours) {
      const diff = Math.abs(scheduledHours - availableHours);
      const humanReadable = convertToHumanReadableTime(diff);
      return humanReadable;
    } else {
      return 'No Availaility';
    }
  };

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
        const startTime = moment(
          new Date(timeRangeObj.start_time),
          'HH:mm:ss a'
        );
        const endTime = moment(new Date(timeRangeObj.end_time), 'HH:mm:ss a');
        const duration = moment.duration(endTime.diff(startTime));
        if (getDayOfWeek(timeRangeObj.start_time) === 'monday') {
          setMonTotalBusy((monTotal += duration));
        } else if (getDayOfWeek(timeRangeObj.start_time) === 'tuesday') {
          setTuesTotalBusy((tuesTotal += duration));
        } else if (getDayOfWeek(timeRangeObj.start_time) === 'wednesday') {
          setWedTotalBusy((wedTotal += duration));
        } else if (getDayOfWeek(timeRangeObj.start_time) === 'thursday') {
          setThursTotalBusy((thursTotal += duration));
        } else if (getDayOfWeek(timeRangeObj.start_time) === 'friday') {
          setFriTotalBusy((friTotal += duration));
        } else if (getDayOfWeek(timeRangeObj.start_time) === 'saturday') {
          setSatTotalBusy((satTotal += duration));
        } else if (getDayOfWeek(timeRangeObj.start_time) === 'sunday') {
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

    for (const timeRange in weekdayAvailabilityForRender) {
      if (timeRange.length) {
        const flattenedArr = weekdayAvailabilityForRender[timeRange].flat();

        const stringedValues = flattenedArr.map((range) => {
          if(Array.isArray(range)) {
             return range.join()
          } else {
            return range
          }
        })

        stringedValues.forEach((range) => {

          const [start, end] = range.split('-');

            const fromTime = moment(start, 'HH:mm:ss a');
            const toTime = moment(end, 'HH:mm:ss a');
            const duration = moment.duration(toTime.diff(fromTime));

            if (timeRange === 'monday') {
              setMonTotalAvail((monTotal += duration));
            } else if (timeRange === 'tuesday') {
              setTuesTotalAvail((tuesTotal += duration));
            } else if (timeRange === 'wednesday') {
              setWedTotalAvail((wedTotal += duration));
            } else if (timeRange === 'thursday') {
              setThursTotalAvail((thursTotal += duration));
            } else if (timeRange === 'friday') {
              setFriTotalAvail((friTotal += duration));
            } else if (timeRange === 'saturday') {
              setSatTotalAvail((satTotal += duration));
            } else if (timeRange === 'sunday') {
              setSunTotalAvail((sunTotal += duration));
            }
        });
      }
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

  const convertToIndvTimeZone = (isoDate) => {
    const localDate = new Date(isoDate).toString();
    const hourAndMinute = localDate.split(' ')[4].slice(0, 5);

    return hourAndMinute;
  };

  if (schedule?.length) {
    schedule.map((availability, i) =>
      availability.rules.map((rule) => {
        const milliseconds = new Date(rule.date).getTime();
        const chosenEndCheck = new Date(endTime).getTime();
        if (
          rule.type === 'date' &&
          milliseconds <= chosenEndCheck &&
          milliseconds >= date
        ) {
          const weekdayNum = new Date(rule.date).getDay();

          if (rule.intervals.length) {
            rule.intervals.forEach((interval, i) => {
              if (interval.to > convertToIndvTimeZone(date)) {
                weekdayAvailability['dates'].push([
                  weekDays[weekdayNum],
                  rule.date,
                  [interval],
                ]);
              }
            });
          }

          weekdayAvailability[`${weekDays[weekdayNum]}`].sort();
        } else if (rule.type === 'wday') {
          if (rule.intervals.length) {
            rule.intervals.forEach((interval, i) => {
              if (interval.to > convertToIndvTimeZone(date)) {
                weekdayAvailability[`${rule.wday}`].push([interval]);
              }
            });
          }

          weekdayAvailability[`${rule.wday}`].sort();
        }
      })
    );

    formatAvailScheduleTime(weekdayAvailability);
    formatDatesArrTimeRange(weekdayAvailability['dates']);
  }

  if (Object.keys(weekdayAvailability).length) {
    for (const day in weekdayAvailability) {
      if (weekdayAvailabilityForRender[day]) {
        weekdayAvailabilityForRender[day].push(weekdayAvailability[day]);
      } else {
        weekdayAvailability[day].forEach((weekdayData) => {
          weekdayAvailabilityForRender[weekdayData[0]].push(weekdayData[2]);
        });
      }
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
    setTotalHoursAvailToBook();
  });

  useEffect(() => {
    fetchUser();
  }, []);

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
                      {!weekdayAvailabilityForRender[day].every(
                        (array) => !array.length
                      )
                        ? weekdayAvailability[day].map((range, i) => {
                            if (range.length) {
                              return <p key={i}>{`${range}`}</p>;
                            }
                          })
                        : 'Unavailable'}
                      {weekdayAvailability['dates'].map((array, i) => {
                        if (array.includes(day) && array[2].length) {
                          return (
                            <div key={i}>
                              <strong
                                style={{
                                  backgroundColor: 'rgb(238,110,115,0.1)',
                                  borderRadius: 60,
                                  borderWidth: 0,
                                  cursor: 'pointer',
                                  fontWeight: 'bolder',
                                  textDecoration: 'underline',
                                }}
                              >{`${array[1]}`}</strong>
                              {array[2].map((timeRange, i) => (
                                <ul key={i}>
                                  <li>{`${timeRange}`}</li>
                                </ul>
                              ))}
                            </div>
                          );
                        }
                      })}
                    </td>
                    <td>
                      {Object.keys(busyTimesObj).length && busyTimesObj[day]
                        ? busyTimesObj[day].map((range, i) => (
                            <p key={i}>{`${range}`}</p>
                          ))
                        : 'N/A'}
                    </td>
                    <td>
                      {convertToHumanReadableTime(
                        scheduledHoursAndAvailTotals[day][0]
                      )}
                    </td>
                    <td>
                      {!weekdayAvailabilityForRender[day].every(
                        (array) => !array.length
                      )
                        ? setTotalHoursAvailToBook(
                            scheduledHoursAndAvailTotals[day][0],
                            scheduledHoursAndAvailTotals[day][1]
                          )
                        : 'No Availability'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: 'xx-large' }}>
              <PopupButton
                url={namedUser?.scheduling_url}
                rootElement={document.getElementById('root')}
                text={`Book a meeting with ${
                  namedUser?.name.split(' ')[0] || ''
                }`}
                styles={{
                  backgroundColor: 'rgb(238,110,115,0.1)',
                  borderRadius: 60,
                  borderWidth: 0,
                  cursor: 'pointer',
                  fontWeight: 'bolder',
                }}
              />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
