import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default () => {
  const [invitees, setInvitees] = useState([]);
  const [pagination, setPagination] = useState({});
  const [event, setEvent] = useState([]);

  const { uuid } = useParams();

  const fetchData = async () => {
    const nextPageQueryParams = pagination.next_page
      ? pagination.next_page.slice(pagination.next_page.indexOf('?'))
      : '';

    const result = await fetch(
      `/api/events/${uuid}/invitees${nextPageQueryParams}`
    ).then((res) => res.json());

    setInvitees([...result.invitees]);
    setPagination(result.pagination);
  };

  const handleNoShowClick = async (event) => {
    event.preventDefault();

    const body = await JSON.stringify({ invitee: event.target.value });

    await fetch('/api/no_shows', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    });

    fetchData();
  };

  const undoNoShowClick = async (invitee) => {
    await fetch(`/api/no_shows/${invitee.no_show.uri.split('/')[4]}`, {
      method: 'DELETE',
    });

    fetchData();
  };

  const fetchEventData = async () => {
    const result = await fetch(`/api/events/${uuid}`).then((res) => res.json());

    setEvent(result.event);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchEventData();
  }, []);

  const currentDate = Date.now();
  const eventDate = Date.parse(event.start_time);

  return (
    <div>
      <table className="striped centered">
        <thead>
          <tr>
            <th>Name</th>
            <th>E-mail</th>
            <th>Date/time at scheduling</th>
            <th>Questions + Answers</th>
            <th>Rescheduled</th>
            <th>Timezone</th>
          </tr>
        </thead>
        <tbody>
          {invitees.map((invitee) => (
            <tr key={invitee.uri}>
              <td>{invitee.name}</td>
              <td>{invitee.email}</td>
              <td>{invitee.scheduled_at}</td>
              <td>
                {invitee.questions_and_answers &&
                invitee.questions_and_answers.length
                  ? invitee.questions_and_answers.map((questAns) => (
                      <ul key={questAns.position}>
                        <li>
                          {questAns.position + 1}. <strong>Question: </strong>{' '}
                          {questAns.question} <br />
                          <strong>Answer: </strong> {questAns.answer}
                        </li>
                      </ul>
                    ))
                  : 'N/A'}
              </td>
              <td>{invitee.rescheduled === false ? 'No' : 'Yes'}</td>
              <td>{invitee.timezone}</td>
              <td>
                {invitee.no_show === null && currentDate > eventDate && (
                  <button value={invitee.uri} onClick={handleNoShowClick}>
                    Mark As No-Show
                  </button>
                )}

                {invitee.no_show && invitee.no_show.uri && (
                  <button
                    value={invitee.uri}
                    onClick={() => undoNoShowClick(invitee)}
                  >
                    Undo No-Show
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pagination.next_page && (
        <div className="center-align">
          <button
            className="waves-effect waves-light btn-small"
            onClick={fetchData}
          >
            Load Next
          </button>
        </div>
      )}
    </div>
  );
};
