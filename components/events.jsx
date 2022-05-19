import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Link } from 'react-router-dom';

export default () => {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({});
  const [selectedOption, setSelectedOption] = useState('all-events');

  const options = [
    { value: 'all-events', label: 'All Events' },
    { value: 'active-events', label: 'Active Events' },
    { value: 'canceled-events', label: 'Canceled Events' },
    { value: 'past-events', label: 'Past Events' },
  ];

  const fetchData = async () => {
    const nextPageQueryParams = pagination.next_page
      ? pagination.next_page.slice(pagination.next_page.indexOf('?'))
      : '';

    const result = await fetch(
      `/api/scheduled_events${nextPageQueryParams}`
    ).then((res) => res.json());

    setEvents([...events, ...result.events]);
    setPagination(result.pagination);
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const currentDate = Date.now();

  return (
    <div className="container" style={{ marginTop: '50px' }}>
      <div style={{ alignSelf: 'center', textAlign: 'center' }}>
        <Select
          defaultValue={selectedOption}
          options={options}
          placeholder="Choose Filter"
          onChange={(event) => setSelectedOption(event.value)}
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
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.uri}>
                {selectedOption === 'all-events' && (
                  <React.Fragment>
                    <td>
                      <Link to={`/events/${event.uri.split('/')[4]}`}>
                        {event.name}
                      </Link>
                    </td>
                    <td>{event.date}</td>
                    <td>{event.start_time}</td>
                    <td>{event.end_time}</td>
                  </React.Fragment>
                )}

                {selectedOption === 'active-events' &&
                  event.status === 'active' && (
                    <React.Fragment>
                      <td>
                        <Link to={`/events/${event.uri.split('/')[4]}`}>
                          {event.name}
                        </Link>
                      </td>
                      <td>{event.date}</td>
                      <td>{event.start_time}</td>
                      <td>{event.end_time}</td>
                    </React.Fragment>
                  )}

                {selectedOption === 'canceled-events' &&
                  event.status === 'canceled' && (
                    <React.Fragment>
                      <td>
                        <Link to={`/events/${event.uri.split('/')[4]}`}>
                          {event.name}
                        </Link>
                      </td>
                      <td>{event.date}</td>
                      <td>{event.start_time}</td>
                      <td>{event.end_time}</td>
                    </React.Fragment>
                  )}

                {selectedOption === 'past-events' &&
                  Date.parse(`${event.date}, ${event.start_time}`) <
                    currentDate && (
                    <React.Fragment>
                      <td>
                        <Link to={`/events/${event.uri.split('/')[4]}`}>
                          {event.name}
                        </Link>
                      </td>
                      <td>{event.date}</td>
                      <td>{event.start_time}</td>
                      <td>{event.end_time}</td>
                    </React.Fragment>
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
