import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
//import TimePicker from 'react-time-picker';
// import DateTimePicker from 'react-datetime-picker'

var endDate;

export default () => {
  const location = useLocation().search;
  const eventUri = new URLSearchParams(location).get('event_type');
  const [eventType, setEventType] = useState([]);
  const [eventTypesSlots, seEventTypesSlots] = useState([]);
  const [date, setDate] = useState('');
  const [queryParams, setQueryParams] = useState();
  const [time, setTime] = useState("09:00")
  const [curretDateTime, setCurrentDateTime] = useState(new Date().getTime())
  const [timeDiff, setTimeDiff] = useState()
  const [value, onChange] = useState();

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

  useEffect(() => {
    fetchEventTypeSlotsData()
  }, [])

  console.log('time after setting=', time)
  
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
            placeholderText="Date and time will auto-correct to the future"
            // timeFormat="HH:mm"
            // timeIntervals={15}
            // timeCaption="time"
            dateFormat="MMMM d, yyyy"
            // dateFormatCalendar=''
            // dateFormat="MMMM dd, yyyy"
            onChange={(date) => {
                // console.log('date before anything=', date)
                // setCurrentDateTime(new Date().getTime())
                // let timeDiff = curretDateTime - date.getTime()
                // console.log('timeDiff=', timeDiff)
                // date = new Date(date.getTime() + timeDiff + 120000)
                setDate(new Date ())
            //   setDate(new Date(date.getTime() + timeDiff + 120000));
            //SLICE AND DICE THE DATE AND CHOSEN TIMES TOGETHER, THEN SEND. TAKE CARE OF PAST DATES WITH ERROR MESSAGE.
              let copyDate = new Date(date.getTime());
              endDate = new Date(copyDate.setDate(copyDate.getDate() + 7));
              const dateToModify = date.toString().split(" ")
              dateToModify[4] = time
              let dateWithTime = new Date(dateToModify.join(" "))
              console.log('date submitted = ', dateWithTime)
              setQueryParams(`?start_time=${dateWithTime.toISOString()}&end_time=${endDate.toISOString()}&event_type=${eventUri}`);
            }}
          />
          {/* <div style={{ position: 'absolute', display: 'bloack', margin: 'auto', blockSize: 'large'}}>
          {date !== '' && <TimePicker onChange={onChange} value={value} />}
          </div> */}
          {/* <input type="time" id="start-time" name="selected-start" min="00:00" max="24:00"/> */}
          {/* <DateTimePicker onChange={onChange} value={value} /> */}
        </div>
        <span><input type="time" defaultValue={"09:00"} step="900" min="07:00" max="18:00" onChange={(event) => {
          setTime(event.target.value)
        }}></input></span>
        {date && time !== '' && <button
          onClick={() => {
            fetchEventTypeSlotsData()
          }
        }
        >
          Submit
        </button>}
    </div>
  )
};
