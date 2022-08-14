import React from 'react';
import { AuthConsumer } from './auth.jsx';

export default () => {
  const auth = AuthConsumer();

  return (
    <nav>
      <div className="nav-wrapper">
        {auth?.authenticated ? (
          <a href="/" className="brand-logo" style={{ paddingLeft: '15px' }}>
            BuzzwordCRM
          </a>
        ) : (
          <a href="/" className="brand-logo" style={{ paddingLeft: '15px' }}>
            BuzzwordCRM
          </a>
        )}

        {auth?.authenticated && (
        <ul id="nav-mobile" className="right hide-on-med-and-down">
            <>
              <li>
                <a href="/">Dashboard</a>
              </li>
              <li>
                <a href="/events">Events</a>
              </li>
              <li>
                <a href="/logout">Logout</a>
              </li>
            </>
        </ul>
        )}
      </div>
    </nav>
  );
};
