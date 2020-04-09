import React from 'react';
import { render } from '@testing-library/react';
import * as auth0 from '.././../auth/react-auth0-spa';
import DataPage from './index';
import { useQuery } from "urql";
jest.mock('urql', () => {
  return {
    useQuery: jest.fn()
  };
});

auth0.useAuth0 = () => ({
  isAuthenticated: false
});
beforeEach(() => {
  useQuery.mockReturnValue([{
    data: [],
    fetching: false,
  }]);
});
test('renders learn react link', () => {
  const { getByText } = render(<DataPage />);
  const tableTabLink = getByText(/table/i);
  expect(tableTabLink).toBeInTheDocument();
});
