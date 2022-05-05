import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../pages/login';

describe('Login', () => {
  it('renders a heading', () => {
    render(<Login />);
    expect(screen.getByText('Welcome Back 👋')).toBeInTheDocument();
  })
})
