import React, { useState, useEffect, useRef } from 'react';
import Popup from './popup';
import Select from 'react-select';
import { Link } from 'react-router-dom';

export default () => {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({});
  const [popupOpen, setPopupOpen] = useState(false);
  const [eventUri, setEventUri] = useState(null);
  const [reasonInput, setReasonInput] = useState('');
  const [selectedOption, setSelectedOption] = useState('all-events');
  const [nextPageToken, setNextPageToken] = useState(null);
  //const [currentDate, setCurrentDate] = useState('');

  //console.log('date=', currentDate);
  const currentDate = useRef(new Date().toISOString());
  const currentDateMillisec = Date.now();

  const options = [
    { value: 'all-events', label: 'All Events' },
    { value: 'active-events', label: 'Active Events' },
    { value: 'canceled-events', label: 'Canceled Events' },
    { value: 'past-events', label: 'Past Events' },
    { value: 'future-events', label: 'Future Events' },
  ];

  const fetchData = async () => {
    let nextPageQueryParams = '?';

    if (nextPageToken) nextPageQueryParams += `&page_token=${nextPageToken}`;

    if (selectedOption === 'active-events') {
      console.log('filtering to active events');

      nextPageQueryParams += '&status=active';

      console.log('nextPageQueryParams=', nextPageQueryParams);

      const result = await fetch(
        `/api/scheduled_events${nextPageQueryParams}`
      ).then((res) => res.json());

      setEvents([...events, ...result.events]);
      setPagination(result.pagination);
      return;
    }

    if (selectedOption === 'canceled-events') {
      console.log('filtering to canceleed events');

      nextPageQueryParams += '&status=canceled';
      console.log('nextPageQueryParams=', nextPageQueryParams);

      const result = await fetch(
        `/api/scheduled_events${nextPageQueryParams}`
      ).then((res) => res.json());

      setEvents([...events, ...result.events]);
      setPagination(result.pagination);
      return;
    }

    if (selectedOption === 'past-events') {
      console.log('filtering to past events');
      nextPageQueryParams += `&max_start_time=${currentDate.current}`;
      console.log('nextPageQueryParams=', nextPageQueryParams);

      const result = await fetch(
        `/api/scheduled_events${nextPageQueryParams}`
      ).then((res) => res.json());

      setEvents([...events, ...result.events]);
      setPagination(result.pagination);
      return;
    }

    if (selectedOption === 'future-events') {
      console.log('filtering to future events');

      nextPageQueryParams += `&min_start_time=${currentDate.current}`;
      console.log('nextPageQueryParams=', nextPageQueryParams);

      const result = await fetch(
        `/api/scheduled_events${nextPageQueryParams}`
      ).then((res) => res.json());

      setEvents([...events, ...result.events]);
      setPagination(result.pagination);
    } else {
      console.log('filtering to all events via ELSE statement');
      console.log('nextPageQueryParams=', nextPageQueryParams);
      const result = await fetch(
        `/api/scheduled_events${nextPageQueryParams}`
      ).then((res) => res.json());

      setEvents([...events, ...result.events]);
      setPagination(result.pagination);
    }
  };

  console.log('selectedOption=', selectedOption);
  console.log('events=', events);

  const handleCancellation = async (event) => {
    event.preventDefault();

    const uuid = event.target.value.split('/')[4];

    const body = await JSON.stringify({ reason: reasonInput });

    await fetch(`/api/cancel_event/${uuid}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    }).then((res) => res.json());

    window.location.reload();
  };

  const togglePopup = (event) => {
    setPopupOpen(!popupOpen);
    setEventUri(event.target.value);
    setReasonInput('');
  };

  const handleSelectedOptionChange = (value) => {
    setNextPageToken(false);
    setSelectedOption(value);
    setEvents([]);
  };

  useEffect(() => {
    fetchData();
  }, [selectedOption, nextPageToken]);

  return (
    <div className="container" style={{ marginTop: '50px' }}>
      <div style={{ alignSelf: 'center', textAlign: 'center' }}>
        <Select
          defaultValue={selectedOption}
          options={options}
          placeholder="Choose Filter"
          onChange={(event) => handleSelectedOptionChange(event.value)}
        />
      </div>
      <div className="row">
        <table className="striped centered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.uri}>
                <td>
                  <Link to={`/events/${event.uri.split('/')[4]}`}>
                    {event.name}
                  </Link>
                </td>
                <td>{event.date}</td>
                <td>{event.start_time_formatted}</td>
                <td>{event.end_time_formatted}</td>
                <td>{event.status && event.status.toUpperCase()}</td>
                {currentDateMillisec < Date.parse(event.start_time) &&
                  event.status === 'active' && (
                    <td>
                      <button value={event.uri} onClick={togglePopup}>
                        Cancel Event
                      </button>
                    </td>
                  )}

                {popupOpen && event.uri === eventUri && (
                  <Popup
                    content={
                      <form>
                        <label>
                          <h5>Cancel Event</h5>
                          <h6>"{event.name}"</h6>
                          <h6>{event.date}</h6>
                          <h6>
                            {event.start_time_formatted}-
                            {event.end_time_formatted}
                          </h6>
                          Reason:
                          <textarea
                            type="text"
                            value={reasonInput}
                            onChange={(event) =>
                              setReasonInput(event.target.value)
                            }
                          />
                        </label>
                        <button value={event.uri} onClick={handleCancellation}>
                          Yes, cancel
                        </button>
                      </form>
                    }
                    handleClose={togglePopup}
                  />
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination.next_page_token && (
        <div className="center-align">
          <button
            className="waves-effect waves-light btn-small"
            onClick={() => setNextPageToken(pagination.next_page_token)}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};
