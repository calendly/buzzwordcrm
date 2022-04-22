import * as React from 'react';
import { createRoot } from 'react-dom/client';

let App = () => <h1>Hello, world!</h1>;

window.onload = () => {
  const root = createRoot(document.getElementById('root'));

  root.render(<App />);
};
