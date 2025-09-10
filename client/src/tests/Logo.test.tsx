import { render, screen } from '@testing-library/react';
import Logo from '../components/Logo';

describe('Logo', () => {
  it('should render the logo image with the correct alt text', () => {
    render(<Logo />);
    const logoImage = screen.getByAltText('Jobify');
    expect(logoImage).toBeInTheDocument();
  });
});
