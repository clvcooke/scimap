// Helper function to calculate viewport from bounds using Deck.GL's fitBounds
import {MapViewState, WebMercatorViewport} from "@deck.gl/core";

export function getViewStateFromBounds(
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number,
    width: number,
    height: number,
    padding: number = 50
): MapViewState {
    const viewport = new WebMercatorViewport({width, height});

    const {longitude, latitude, zoom} = viewport.fitBounds([
        [minLon, minLat],
        [maxLon, maxLat]
    ], {
        padding
    });

    return {
        longitude,
        latitude,
        zoom
    };
}