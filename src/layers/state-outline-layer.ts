import {STATE_LAYER_LINK} from "../constants.ts";
import {MVTLayer} from "@deck.gl/geo-layers";

export function generateStateOutlineLayer() {
    return new MVTLayer({
        id: 'state-outline-mvt',
        data: [STATE_LAYER_LINK],
        binary: true,
        getLineColor: [255, 255, 255, 200],
        lineWidthMinPixels: 2,
        pickable: false,
        maxZoom: 7,
        getFillColor: [0, 0, 0, 0],
    });
}