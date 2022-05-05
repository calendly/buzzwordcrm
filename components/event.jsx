import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useParams, Link } from 'react-router-dom';
=======
import { useParams } from 'react-router-dom';
>>>>>>> 509227cc7ef474b112541f384e57f01d64ee3ec3

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
            <h5>Details for  <strong>"{event.name}"</strong> scheduled for <strong>{event.date}</strong></h5>
            <p><strong>Start time: </strong> {event.start_time}</p>
            <p><strong>End time: </strong> {event.end_time}</p>
            <p><strong>Location: </strong>{event.location && event.location.location || "No location set"}</p>
            <p><strong>Number of invitees (confirmed/total): </strong> {event.invitees_counter && `${event.invitees_counter.active}/${event.invitees_counter.limit}`}</p>
            <Link to={`/events/${uuid}/invitees`}><p>Click here for invitee details</p></Link>
            <div><strong>Invitee guests: </strong> {event.event_guests && event.event_guests.length > 0 ? event.event_guests.map((guest, i) => (
                <ul key={i}>
                    <li>{i + 1}: {guest.email}</li>
                </ul>
            )) : 'No guests added by invitee'}</div>
        </div>

    )
}
