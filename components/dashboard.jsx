import React, {useState, useEffect} from 'react';
import { PopupButton } from 'react-calendly';

export default () => {
  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    fetch('/api/event_types')
      .then(res => res.json())
      .then(
        (result) => {
          setEventTypes(result.eventTypes)
        }
      )
  }, [])

  return (
    <div className="container" style={{marginTop: '50px'}}>
      <div className="row">
        {eventTypes.map((eventType) =>
          <div className="col s6" key={eventType.uri}>
            <div className="card">
              <div style={{backgroundColor: eventType.color, height: 50, width: '100%'}}>
              </div>
              <div className="card-content">
                <p>{eventType.name}</p>
                <p>{eventType.description_plain}</p>
              </div>
              <div className="card-action">
                <PopupButton
                  url={eventType.scheduling_url}
                  rootElement={document.getElementById('root')}
                  text='View Availbility'
                  styles={{borderWidth: 0, backgroundColor: '#fff', cursor: 'pointer'}}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
};
