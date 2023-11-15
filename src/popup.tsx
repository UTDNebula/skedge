import { MemoryRouter } from 'react-router-dom';

import { Routing } from '~/pages';

import '~/style.css';

function IndexPopup() {
  return (
    <MemoryRouter>
      <Routing />
    </MemoryRouter>
  );
}

export default IndexPopup;
