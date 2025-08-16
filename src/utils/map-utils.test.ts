import { describe, it, expect } from 'vitest';
import { getViewStateFromBounds } from './map-utils';

describe('map-utils', () => {
    describe('getViewStateFromBounds', () => {
        it('should calculate the correct view state from bounds', () => {
            const viewState = getViewStateFromBounds(-90, 90, -180, 180, 800, 600);
            expect(viewState).toHaveProperty('longitude');
            expect(viewState).toHaveProperty('latitude');
            expect(viewState).toHaveProperty('zoom');

            // A very basic check. A more robust test would involve a snapshot
            // or more precise expected values if the projection logic was well-known.
            expect(viewState.zoom).toBeGreaterThan(-1);
        });
    });
});
