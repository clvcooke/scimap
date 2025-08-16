import { describe, it, expect } from 'vitest';
import { processPoliticianName, generateEconLossString, generateJobLossString } from './info';

describe('info utils', () => {
    describe('processPoliticianName', () => {
        it('should return "Vacant Seat" if no name is provided', () => {
            expect(processPoliticianName()).toBe('Vacant Seat');
        });

        it('should format a Republican politician\'s name', () => {
            expect(processPoliticianName('John Doe', 'Republican')).toBe('John Doe (R)');
        });

        it('should format a Democratic politician\'s name', () => {
            expect(processPoliticianName('Jane Doe', 'Democrat')).toBe('Jane Doe (D)');
        });

        it('should format an Independent politician\'s name', () => {
            expect(processPoliticianName('Sam Smith', 'Independent')).toBe('Sam Smith (I)');
        });

        it('should handle names with extra quotes', () => {
            expect(processPoliticianName('"John Doe"', 'Republican')).toBe('"John Doe" (R)');
        });
    });

    describe('generateEconLossString', () => {
        it('should return "<$100" for losses less than 100', () => {
            expect(generateEconLossString(99)).toBe('<$100');
        });

        it('should format large numbers with compact notation', () => {
            expect(generateEconLossString(1000000)).toBe('$1M');
        });
    });

    describe('generateJobLossString', () => {
        it('should return "<10" for job losses less than 10', () => {
            expect(generateJobLossString(9)).toBe('<10');
        });

        it('should format large numbers with compact notation', () => {
            expect(generateJobLossString(10000)).toBe('10K');
        });
    });
});
