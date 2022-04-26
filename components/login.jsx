import * as React from 'react';

export default () => (
  <main>
    <div className="container">
      <div className="row" style={{ marginTop: '50px' }}>
        <div className="center-align">
          <img src="/images/logo.svg" height="300px" />
        </div>
      </div>
      <div className="row">
        <h1
          className="center-align brand-logo"
          style={{
            color: 'rgba(0,0,0,0.87)',
            fontWeight: 300,
            letterSpacing: '-0.00833em',
          }}
        >
          BuzzwordCRM
        </h1>
      </div>
      <div className="row">
        <h4 className="center-align" style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
          Innovative! Disruptive! Freemium!
        </h4>
      </div>
      <div className="row">
        <div className="center-align">
          <a
            className="waves-effect waves-light btn-large"
            style={{ backgroundColor: '#ee6e73' }}
            href="/oauth"
          >
            Log in with Calendly
          </a>
        </div>
      </div>
    </div>
  </main>
);
