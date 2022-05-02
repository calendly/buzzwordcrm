import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default () => {

    const [eventType, setEventType] = useState([]);

    const { uuid } = useParams();

    const fetchData = async () => {
        const result = await fetch(
            `/api/event_types/${uuid}`
        ).then((res) => res.json());

        setEventType(result.event)
    }
    useEffect(() => {
        fetchData()
    }, []);

    return (
        <div style={{ textAlign: 'center' }}>
            <p>{`Last updated ${eventType.last_updated}`}</p>
            <p>{eventType.name}</p>
            <p>***This page will allow user to edit the event type***</p>
        </div>
    )
}
