import '~/style.css';

import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { Routing } from '~/pages';

function IndexPopup() {
  return (
    <MemoryRouter>
      <Routing />
    </MemoryRouter>
  );
}

export default IndexPopup;
