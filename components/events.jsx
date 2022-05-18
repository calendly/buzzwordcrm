import React, { useState, useEffect } from 'react';
import Popup from './popup';
import { Link } from 'react-router-dom';

export default () => {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({});
  const [popupOpen, setPopupOpen] = useState(false);
  const [eventUri, setEventUri] = useState(null);
  const [reasonInput, setReasonInput] = useState('');

  //const sortEvents = (a) => {
  //   if (a.status === 'active') {
  //     return -1
  //   }
  // }

  const fetchData = async () => {
    const nextPageQueryParams = pagination.next_page
      ? pagination.next_page.slice(pagination.next_page.indexOf('?'))
      : '';

    const result = await fetch(
      `/api/scheduled_events${nextPageQueryParams}`
    ).then((res) => res.json());

    // console.log('result.events=', result.events)

    const filteredEvents = result.events.filter(
      (event) => event.status === 'active'
    );

    setEvents([...events, ...filteredEvents]);
    setPagination(result.pagination);
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

    window.location.reload();

    //togglePopup()
  };

  const togglePopup = (event) => {
    setPopupOpen(!popupOpen);
    setEventUri(event.target.value);
  };

  console.log('events=', events);

  useEffect(() => {
    fetchData();
  }, []);

  const currentDate = Date.now();

  return (
    <div className="container" style={{ marginTop: '50px' }}>
      <div className="row">
        <table className="striped centered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
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
                <td>{event.start_time}</td>
                <td>{event.end_time}</td>
                {currentDate <
                  Date.parse(`${event.date}, ${event.start_time}`) && (
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
                            {event.start_time}-{event.end_time}
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
      {pagination.next_page && (
        <div className="center-align">
          <button
            className="waves-effect waves-light btn-small"
            onClick={fetchData}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};
