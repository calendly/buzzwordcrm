import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default () => {
  const [invitees, setInvitees] = useState([]);
  const [pagination, setPagination] = useState({});
  const [noShow, setNoShow] = useState(false);
  const [inviteeUri, setInviteeUri] = useState(null);
  //const [noShowMarked, setNoShowMarked] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [showFirstUndo, setShowFirstUndo] = useState(null);
  const [ firstUndoClicked, setFirstUndoClicked ] = useState(false);

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

    // if(invitees.length) {
    //   if (!invitees[0].no_show) {
    //   setShowFirstUndo(false)
    // }
    // } else {
    //   console.log('Else statement of initial fetch')
    //   setShowFirstUndo(true)
    // }

    // if (invitees.length) {
    //     const noShowData = await fetch(
    //     `/api/no_shows/${invitees[0].no_show.uri.split('/')[4]}`
    // )
    // if(noShowData) {
    //     setNoShowMarked(true)
    //     console.log('noShowMarked=', noShowMarked)
    // }
    //}
  };

  const setInitialUndoButton = () => {
    if (invitees.length) {
      console.log('First IF statement of initial fetch');
      if (!invitees[0].no_show) {
        console.log('Second IF statement of initial fetch');
        setShowFirstUndo(false);
      } else {
        console.log('Else statement of initial fetch');
        setShowFirstUndo(true);
      }
    }
  };
  //   const handleNoShowClickGet = async () => {
  //     const markedUser = await fetch(`/api/no_shows/${inviteeUri}`).then((res) =>
  //     res.json()
  //   );
  //   setNoShowMarked(markedUser);
  //   }
  console.log('invitees=', invitees);

  //   const fetchNoShow = async (uuid) => {
  //     // const uuid = invitees[0].no_show.uri.split('/')[4]
  //       const result = await fetch(
  //         `/api/no_shows/${uuid}`
  //       ).then((res) => res.json());

  //       if (result) {
  //         setNoShowMarked(true);
  //         console.log('noShowMarked as true?=', noShowMarked);
  //       } else {
  //         setNoShowMarked(!noShowMarked);
  //         console.log('noShowMarked as false?=', noShowMarked);
  //       }

  //   };

  const handleNoShowClick = async (event) => {
    console.log('handling no-show clicked')
    //try {
    event.preventDefault();
    //console.log(event);

    //     const markedUser = await fetch(`/api/no_shows/${inviteeUri}`).then((res) =>
    //     res.json()
    //   );
    //   setNoShowMarked(markedUser);
    // };
    // if (invitees[0].no_show === null) {
    const body = await JSON.stringify({ invitee: event.target.value });

    const result = await fetch('/api/no_shows', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
    });

    console.log('result=', result)
    const capturedResult = await result.json();
    console.log('right before parsing the capturedResult')
    const parsedResult = JSON.parse(JSON.stringify(capturedResult));
    setParsedData(parsedResult.resource);
    console.log('parsedData=', parsedData)

    //console.log('parsedResult=', parsedResult)
    // if(!parsedResult.resource) {
    //   window.alert('This invitee has already been marked as no-show')
    // }

    setNoShow(!noShow);
    // setNoShowMarked(true)
    setInviteeUri(parsedResult.resource.uri.split('/')[4]);
    //   console.log('IF in handleNoShowClick noShowMarked=', noShowMarked)
    //}

    // else if (!inviteeUri) {

    //   window.alert('This user has already been marked as a no-show.');
    //   setNoShowMarked(true);
    //   console.log('else in handleNoShowClick noShowMarked=', noShowMarked)
    //   setInviteeUri(null);
    // } else {
    //     return
    // }

    //     const result2 = await fetch(`/api/no_shows/${inviteeUri}`).then((res) =>
    //     res.json()
    //   );
    //   setNoShowMarked(result2.resource);

    //}

    // catch (error) {
    //   setNoShowMarked(true);
    //   window.alert('This user has already been marked as a no-show');
    // }

    // const markedUser = await fetch(`/api/no_shows/${inviteeUri}`).then((res) =>
    //   res.json()
    // );
    // setNoShowMarked(markedUser);
  };
  console.log('SHOWFIRSTUNFO=', showFirstUndo);
  console.log('NOSHOW=', noShow)
  console.log('FIRSTUNDOCLICKED=', firstUndoClicked)

  const undoNoShowClick = async (event) => {
    event.preventDefault();
    // if (!inviteeUri) {
    //      await fetch(`/api/no_shows/${invitees[0].no_show.uri.split('/')[4]}`, { method: 'DELETE' });
    // //     setNoShowMarked(false)
    // setNoShow(!noShow);
    //      setInviteeUri(null)
    // //     setNoShowMarked(!noShowMarked);
    // }
    //if (inviteeUri) {
    await fetch(`/api/no_shows/${inviteeUri}`, { method: 'DELETE' });
    setNoShow(!noShow);
    setInviteeUri(null);
    // setNoShowMarked(!noShowMarked);
    // console.log('undoNoShowClick noShowMarked=', noShowMarked)
    //}

     
  };

  const undoFirstNoShowClick = async (event) => {
    event.preventDefault();
    //console.log('event target value=', event.target.value)
    await fetch(`/api/no_shows/${invitees[0].no_show.uri.split('/')[4]}`, {
      method: 'DELETE',
    });
    //setNoShowMarked(false)
    setInviteeUri(null);
    setShowFirstUndo(false);
    setFirstUndoClicked(true)
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setInitialUndoButton();
  });

  //   useEffect(() => {
  //     fetchNoShow(invitees[0].no_show.uri.split('/')[4]);
  //   }, [invitees]);

  //   console.log('value of noShow then noShowMarked='), noShow, noShowMarked;

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
                { !noShow && !showFirstUndo && !firstUndoClicked || !noShow && showFirstUndo && firstUndoClicked ? (
                  <button
                    //disabled={inviteeUri}
                    value={invitee.uri}
                    onClick={handleNoShowClick}
                  >
                    Mark As No-Show
                  </button>
                ) : (
                  ''
                )}
                </td>
                <td>
                  { noShow && !showFirstUndo && !firstUndoClicked || noShow && showFirstUndo && firstUndoClicked ? (
                    <button value={invitee.uri} onClick={undoNoShowClick}>
                      Undo
                    </button>
                  ) : (
                    ''
                  )}
                </td>
              <td>
                {!parsedData && showFirstUndo && !firstUndoClicked && noShow || !parsedData && showFirstUndo && !noShow && !firstUndoClicked ? (
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
