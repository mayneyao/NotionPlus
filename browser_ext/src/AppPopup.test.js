import React from 'react';
import ReactDOM from 'react-dom';
import AppPopup from './AppPopup';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AppPopup />, div);
  ReactDOM.unmountComponentAtNode(div);
});
