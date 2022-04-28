import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

export default () => {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({});

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
                <td><Link to={`/events/${event.uri.split('/')[4]}`}>{event.name}</Link></td>
                <td>{event.date}</td>
                <td>{event.start_time}</td>
                <td>{event.end_time}</td>
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
