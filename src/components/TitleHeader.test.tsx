import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TitleHeader } from './TitleHeader';
import { MantineProvider } from '@mantine/core';
import '@testing-library/jest-dom';

const renderWithMantine = (component: React.ReactNode) => {
    return render(<MantineProvider>{component}</MantineProvider>);
};

describe('TitleHeader', () => {
    it('renders the default text when no props are provided', () => {
        const { getByText } = renderWithMantine(<TitleHeader />);
        expect(getByText(/National Impact per year:/i)).toBeInTheDocument();
    });

    it('renders IDC only text when baseLayer is "IDC"', () => {
        const { getByText } = renderWithMantine(<TitleHeader baseLayer="IDC" />);
        expect(getByText(/Future Economic Loss:/i)).toBeInTheDocument();
    });

    it('renders IDC and grants text when baseLayer is "IDC" and overlay is "GRANTS"', () => {
        const { getByText } = renderWithMantine(<TitleHeader baseLayer="IDC" overlay="GRANTS" />);
        expect(getByText(/Current Economic Loss:/i)).toBeInTheDocument();
        expect(getByText(/Future Economic Loss:/i)).toBeInTheDocument();
    });

    it('renders terminated grants text when baseLayer is "TERM" and overlay is "GRANTS"', () => {
        const { getByText } = renderWithMantine(<TitleHeader baseLayer="TERM" overlay="GRANTS" />);
        expect(getByText(/Current Economic Loss:/i)).toBeInTheDocument();
    });

    it('renders total only text when baseLayer is "TOTAL"', () => {
        const { getByText } = renderWithMantine(<TitleHeader baseLayer="TOTAL" />);
        expect(getByText(/Current \+ Future Economic Loss:/i)).toBeInTheDocument();
    });
});