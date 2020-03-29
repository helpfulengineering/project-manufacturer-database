import React from 'react';
import { render } from '@testing-library/react';
import DataPage from './index';

import * as auth0 from '.././../auth/react-auth0-spa';
auth0.useAuth0 = () => ({
  isAuthenticated: false
});

test('renders learn react link', () => {
  const { getByText } = render(<DataPage />);
  const tableTabLink = getByText(/table/i);
  expect(tableTabLink).toBeInTheDocument();
});
