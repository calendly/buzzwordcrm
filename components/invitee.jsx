import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default () => {
  const [invitees, setInvitees] = useState([]);
  const [pagination, setPagination] = useState({});

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

  const undoNoShowClick = async (event) => {
    event.preventDefault();

    const filteredInvitees = invitees.filter(
      (invitee) => invitee.uri === event.target.value
    );

    await fetch(
      `/api/no_shows/${filteredInvitees[0].no_show.uri.split('/')[4]}`,
      {
        method: 'DELETE',
      }
    );

    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          {invitees.map((invitee, i) => (
            <tr key={i}>
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
                {invitee.no_show === null && (
                  <button value={invitee.uri} onClick={handleNoShowClick}>
                    Mark As No-Show
                  </button>
                )}
                
                {invitee.no_show && invitee.no_show.uri && (
                  <button value={invitee.uri} onClick={undoNoShowClick}>
                    Undo No-Show
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
