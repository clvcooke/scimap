import { useState } from 'react';
import { Map } from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import 'maplibre-gl/dist/maplibre-gl.css';

// In deck.gl 9, MapViewState type might not be directly exported or needed like this
interface ViewState {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch?: number;
    bearing?: number;
}

export default function SCIMap() {
    const [viewState, setViewState] = useState<ViewState>({
        longitude: -98.5795, // Approximate center longitude of the USA
        latitude: 39.8283,   // Approximate center latitude of the USA
        zoom: 3.5            // Adjust the zoom level to fit the continental USA
    });

    return (
        <div className="absolute inset-0 w-full h-full">
            <DeckGL
                viewState={viewState}
                onViewStateChange={({ viewState: newViewState }) => {
                    setViewState(newViewState as ViewState);
                }}
                controller={true}
                layers={[]} // Ready for deck.gl layers
                getCursor={({ isDragging }) => isDragging ? 'grabbing' : 'grab'}
            >
                <Map
                    mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                />
            </DeckGL>
        </div>
    );
}
