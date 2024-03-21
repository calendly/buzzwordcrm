import React, { useState, useEffect } from 'react';
import { PopupButton } from 'react-calendly';
import { Link } from 'react-router-dom';

export default () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [pagination, setPagination] = useState({});
  const [nextPageToken, setNextPageToken] = useState(null);
  const [prevPageToken, setPrevPageToken] = useState(null);
  const [paginationCount, setPaginationCount] = useState(0);

  const fetchData = async () => {
    let nextPageQueryParams = '?';

    if (nextPageToken === pagination.next_page_token)
      nextPageQueryParams += `&page_token=${nextPageToken}`;

    if (prevPageToken === pagination.previous_page_token) {
      nextPageQueryParams = '?';
      nextPageQueryParams += `&page_token=${prevPageToken}`;
    }

    const result = await fetch(`/api/event_types${nextPageQueryParams}`).then(
      (res) => res.json()
    );

    setEventTypes([...result.eventTypes]);
    setPagination(result.pagination);
  };

  useEffect(() => {
    fetchData();
  }, [nextPageToken, prevPageToken]);

  return (
    <div className="container" style={{ marginTop: '50px' }}>
      <div className="row">
        {eventTypes.map((eventType) => (
          <div className="col s6" key={eventType.uri}>
            {eventType.active === true ? (
              <Link to={`/event_types/${eventType.uri.split('/')[4]}`}>
                <div className="card">
                  <div
                    style={{
                      backgroundColor: eventType.color,
                      height: 50,
                      width: '100%',
                    }}
                  ></div>
                  <div className="card-content" style={{ color: 'black' }}>
                    <p>{eventType.name}</p>
                    <p style={{ fontSize: 'small' }}>
                      Description:{' '}
                      {eventType.description_plain || 'No description'}
                    </p>
                  </div>
                  <div className="card-action">
                    <PopupButton
                      url={eventType.scheduling_url}
                      rootElement={document.getElementById('root')}
                      text="View Availability"
                      styles={{
                        borderWidth: 0,
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="card">
                <div
                  style={{
                    backgroundColor: eventType.color,
                    height: 50,
                    width: '100%',
                  }}
                ></div>
                <div className="card-content" style={{ color: 'black' }}>
                  <p>{eventType.name}</p>
                  <p style={{ fontSize: 'small' }}>
                    Description:{' '}
                    {eventType.description_plain || 'No description'}
                  </p>
                </div>
                <div className="card-action">
                  <PopupButton
                    url={eventType.scheduling_url}
                    rootElement={document.getElementById('root')}
                    text="INACTIVE EVENT TYPE"
                    styles={{
                      borderWidth: 0,
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      color: 'red',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {pagination?.next_page && (
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
      {paginationCount > 0 && (
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
