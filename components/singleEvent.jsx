import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default () => {

    const [event, setEvent] = useState([]);

    const { uuid } = useParams()

    const fetchData = async () => {
        const result = await fetch(
            `/api/events/${uuid}`
        ).then((res) => res.json());

        setEvent(result.event)

    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <div>
            <h5>Details for  <b>"{event.name}"</b> scheduled for <b>{event.date}</b></h5>
            <p><b>Start time: </b> {event.start_time}</p>
            <p><b>End time: </b> {event.end_time}</p>
            <p><b>Location: </b>{event.location && event.location.location || "No location set"}</p>
            <p><b>Number of invitees (confirmed/total): </b> {event.invitees_counter && `${event.invitees_counter.active}/${event.invitees_counter.limit}`}</p>
        </div>

    )
}
