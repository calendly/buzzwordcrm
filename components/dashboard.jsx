import React, { useState, useEffect } from 'react';
import { PopupButton } from 'react-calendly';
import { Link } from 'react-router-dom';

export default () => {
  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    fetch('/api/event_types')
      .then((res) => res.json())
      .then((result) => {
        setEventTypes(result.eventTypes);
      });
  }, []);

  return (
    <div className="container" style={{ marginTop: '50px' }}>
      <div className="row">
        {eventTypes.map(
          (eventType) =>
            eventType.active === true && (
              <div className="col s6" key={eventType.uri}>
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
              </div>
            )
        )}
      </div>
    </div>
  );
};
