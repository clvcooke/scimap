import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TitleHeader } from './TitleHeader';
import { MantineProvider } from '@mantine/core';

const renderWithMantine = (component: React.ReactNode) => {
    return render(<MantineProvider>{component}</MantineProvider>);
};

describe('TitleHeader', () => {
    it('renders the default text when no props are provided', () => {
        renderWithMantine(<TitleHeader />);
        expect(screen.getByText(/National Impact per year:/i)).toBeInTheDocument();
    });

    it('renders IDC only text when baseLayer is "IDC"', () => {
        renderWithMantine(<TitleHeader baseLayer="IDC" />);
        expect(screen.getByText(/Future Economic Loss:/i)).toBeInTheDocument();
    });

    it('renders IDC and grants text when baseLayer is "IDC" and overlay is "GRANTS"', () => {
        renderWithMantine(<TitleHeader baseLayer="IDC" overlay="GRANTS" />);
        expect(screen.getByText(/Current Economic Loss:/i)).toBeInTheDocument();
        expect(screen.getByText(/Future Economic Loss:/i)).toBeInTheDocument();
    });

    it('renders terminated grants text when baseLayer is "TERM" and overlay is "GRANTS"', () => {
        renderWithMantine(<TitleHeader baseLayer="TERM" overlay="GRANTS" />);
        expect(screen.getByText(/Current Economic Loss:/i)).toBeInTheDocument();
    });

    it('renders total only text when baseLayer is "TOTAL"', () => {
        renderWithMantine(<TitleHeader baseLayer="TOTAL" />);
        expect(screen.getByText(/Current \+ Future Economic Loss:/i)).toBeInTheDocument();
    });
});
