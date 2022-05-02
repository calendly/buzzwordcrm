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

    console.log(eventType)
    useEffect(() => {
        fetchData()
    }, []);

    return (
        <div>
            <p style={{ textAlign: 'center' }}>{`Last updated ${eventType.last_updated}`}</p>
            <h5>{eventType.name}</h5>
            <div><strong>Invitee Questions: </strong>{eventType.custom_questions && eventType.custom_questions.map((question) => (
                // It doesn't increment correctly with an ol, so I've done it this way (below) to create a numbered list.
                <p key={question.position}>{`${question.position + 1}. ${question.name}`}</p>))}
            </div>
            <p><strong>Duration: </strong>{`${eventType.duration} minutes`}</p>
        </div>
    )
}
