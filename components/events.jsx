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
  const [prevPageToken, setPrevPageToken] = useState(null);
  const [paginationCount, setPaginationCount] = useState(0);
  const [user, setUser] = useState();

  const currentDateMillisec = Date.now();

  const options = [
    { value: 'all-events', label: 'All Events' },
    { value: 'active-events', label: 'Active Events' },
    { value: 'canceled-events', label: 'Canceled Events' },
  ];

  const fetchData = async () => {
    let nextPageQueryParams = '?';

    if (nextPageToken === pagination.next_page_token)
      nextPageQueryParams += `&page_token=${nextPageToken}`;

    if (prevPageToken === pagination.previous_page_token) {
      nextPageQueryParams = '?';
      nextPageQueryParams += `&page_token=${prevPageToken}`;
    }

    if (selectedOption === 'active-events') {
      nextPageQueryParams += '&status=active';

      const result = await fetch(
        `/api/scheduled_events${nextPageQueryParams}`
      ).then((res) => res.json());

      setEvents([...result.events]);
      setPagination(result.pagination);
      return;
    }

    if (selectedOption === 'canceled-events') {
      nextPageQueryParams += '&status=canceled';

      const result = await fetch(
        `/api/scheduled_events${nextPageQueryParams}`
      ).then((res) => res.json());

      setEvents([...result.events]);
      setPagination(result.pagination);
      return;
    } else {
      const result = await fetch(
        `/api/scheduled_events${nextPageQueryParams}`
      ).then((res) => res.json());

      setEvents([...result.events]);
      setPagination(result.pagination);
    }
  };

  const fetchUser = async () => {
    const result = await fetch(
      `/api/users/${events[0].event_memberships[0].user.split('/')[4]}`
    ).then((res) => res.json());

    setUser(result.resource);
  };

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

    const deletedEvent = events.filter((event) => event.uri.includes(uuid));

    window.alert(
      `You have successfully canceled the following event: "${deletedEvent[0].name}" on ${deletedEvent[0].date} at ${deletedEvent[0].start_time_formatted}!`
    );
    window.location.reload();
  };

  const togglePopup = (event) => {
    setPopupOpen(!popupOpen);
    setEventUri(event.target.value);
    setReasonInput('');
  };

  const handleSelectedOptionChange = (value) => {
    setPaginationCount(0);
    setNextPageToken(false);
    setPrevPageToken(false);
    setSelectedOption(value);
    setEvents([]);
  };

  useEffect(() => {
    fetchData();
  }, [selectedOption, nextPageToken, prevPageToken]);

  useEffect(() => {
    fetchUser();
  }, [events]);

  return (
    <div className="container" style={{ marginTop: '50px' }}>
      <div style={{ textAlign: 'center' }}>
        <Link to={`/user_busy_times?user=${user?.uri}`}>
          {`Click here to see ${user?.name.split(' ')[0] || ''}'s Availability`}
        </Link>
      </div>
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
                      <button
                        className="toggle-btn"
                        value={event.uri}
                        onClick={togglePopup}
                      >
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
      {pagination?.next_page_token && (
        <div className="next-back-btns">
          <button
            className="waves-effect waves-light btn-small"
            onClick={() => {
              setPaginationCount(paginationCount + 1);
              setNextPageToken(pagination.next_page_token);
              setPrevPageToken(false);
            }}
          >
            Show Next
          </button>
        </div>
      )}
      {paginationCount > 0 && !popupOpen && (
        <div className="next-back-btns">
          <button
            className="waves-effect waves-light btn-small"
            onClick={() => {
              setPaginationCount(paginationCount - 1);
              setPrevPageToken(pagination.previous_page_token);
            }}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};
