import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default () => {
  const [invitees, setInvitees] = useState([]);
  const [pagination, setPagination] = useState({});
  const [noShow, setNoShow] = useState(false);
  const [inviteeUri, setInviteeUri] = useState(null);
  const [parsedData, setParsedData] = useState(false);
  const [showFirstUndo, setShowFirstUndo] = useState(false);

  const { uuid } = useParams();

  const fetchData = async () => {
    const nextPageQueryParams = pagination.next_page
      ? pagination.next_page.slice(pagination.next_page.indexOf('?'))
      : '';

    const result = await fetch(
      `/api/events/${uuid}/invitees${nextPageQueryParams}`
    ).then((res) => res.json());

    setInvitees([...invitees, ...result.invitees]);
    setPagination(result.pagination);
  };

  const setInitialUndoButton = () => {
    if (invitees.length) {
      if (!invitees[0].no_show) {
        setShowFirstUndo(false);
      } else {
        setShowFirstUndo(true);
      }
    }
  };

  const handleNoShowClick = async (event) => {
    event.preventDefault();

    const body = await JSON.stringify({ invitee: event.target.value });

    const result = await fetch('/api/no_shows', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    });

    const capturedResult = await result.json();
    const parsedResult = JSON.parse(JSON.stringify(capturedResult));

    setParsedData(parsedResult.resource);
    setNoShow(true);
    setInviteeUri(parsedResult.resource.uri.split('/')[4]);
    setShowFirstUndo(false);
  };

  const undoNoShowClick = async (event) => {
    event.preventDefault();

    await fetch(`/api/no_shows/${inviteeUri}`, { method: 'DELETE' });

    setParsedData(null);
    setNoShow(false);
    setInviteeUri(null);
    setShowFirstUndo(false);
  };

  const undoFirstNoShowClick = async (event) => {
    event.preventDefault();

    await fetch(`/api/no_shows/${invitees[0].no_show.uri.split('/')[4]}`, {
      method: 'DELETE',
    });

    setParsedData(null);
    setNoShow(false);
    setInviteeUri(null);
    setShowFirstUndo(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setInitialUndoButton();
  });

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
                {(!noShow && !showFirstUndo) || parsedData === null ? (
                  <button value={invitee.uri} onClick={handleNoShowClick}>
                    Mark As No-Show
                  </button>
                ) : (
                  ''
                )}
              </td>
              <td>
                {parsedData ? (
                  <button value={invitee.uri} onClick={undoNoShowClick}>
                    Undo
                  </button>
                ) : (
                  ''
                )}
              </td>
              <td>
                {parsedData === false && showFirstUndo ? (
                  <button value={invitee.uri} onClick={undoFirstNoShowClick}>
                    Undo No-Show
                  </button>
                ) : (
                  ''
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
