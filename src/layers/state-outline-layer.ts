import {DISTRICT_LAYER_LINK, STATE_LAYER_LINK} from "../constants.ts";
import {MVTLayer} from "@deck.gl/geo-layers";

export function generateStateOutlineLayer(targetProperty?: string, targetValue?: string | number) {
    return new MVTLayer({
        id: 'state-outline-mvt',
        data: [STATE_LAYER_LINK],
        binary: true,
        getLineColor: (feature: {properties: any}) => {
            let alpha = 200;
            console.log({
                targetProperty,
                targetValue,
                feature
            })
            if (targetProperty && targetValue) {
                if (feature.properties[targetProperty] !== targetValue) {
                    alpha = 10;
                }
            }
            return [255, 255, 255, alpha]
        },
        lineWidthMinPixels: 2,
        pickable: false,
        maxZoom: 7,
        getFillColor: [0, 0, 0, 0],
    });
}

export function generateDistrictOutlineLayer(targetProperty?: string, targetValue?: string | number, targetColor?: [number, number, number], lineWidth?: number) {
    return new MVTLayer({
        id: 'district-outline-mvt',
        data: [DISTRICT_LAYER_LINK],
        binary: true,
        getLineColor: (feature: {properties: any}) => {
            let alpha = 200;
            if (targetProperty && targetValue) {
                if (feature.properties[targetProperty] !== targetValue) {
                    alpha = 0;
                }
            }
            if (targetColor) {
                return [...targetColor, alpha]
            }
            return [255, 255, 255, alpha]
        },
        lineWidthMinPixels: lineWidth ?? 2,
        pickable: false,
        maxZoom: 7,
        getFillColor: [0, 0, 0, 0],
    });
}