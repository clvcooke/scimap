import {useEffect, useState} from "react";
import { Select, Button, Box, Flex, Modal } from '@mantine/core';
import {useDisclosure} from "@mantine/hooks";

const STATE_COORDINATES: { [key: string]: [number, number] } = {
    "Alabama": [-86.8073, 32.3182],
    "Alaska": [-152.4044, 61.3707],
    "Arizona": [-111.4312, 34.0489],
    "Arkansas": [-92.3731, 35.2011],
    "California": [-119.4179, 36.7783],
    "Colorado": [-105.7821, 39.7420],
    "Connecticut": [-72.7575, 41.6032],
    "Delaware": [-75.5267, 39.1556],
    "Florida": [-81.5158, 27.6648],
    "Georgia": [-83.6431, 33.0406],
    "Hawaii": [-157.8577, 21.3069],
    "Idaho": [-116.2206, 44.0682],
    "Illinois": [-89.3985, 40.6331],
    "Indiana": [-86.1580, 39.7684],
    "Iowa": [-93.0977, 41.8780],
    "Kansas": [-98.4842, 39.0119],
    "Kentucky": [-84.6701, 37.8393],
    "Louisiana": [-91.9239, 30.9994],
    "Maine": [-69.4455, 45.2538],
    "Maryland": [-76.6413, 39.0458],
    "Massachusetts": [-71.3824, 42.3141],
    "Michigan": [-85.7523, 44.3148],
    "Minnesota": [-94.6859, 46.7296],
    "Mississippi": [-89.3985, 32.3547],
    "Missouri": [-91.8318, 37.9643],
    "Montana": [-110.3626, 46.8797],
    "Nebraska": [-99.9018, 41.4925],
    "Nevada": [-116.4194, 38.8027],
    "New Hampshire": [-71.5639, 43.1939],
    "New Jersey": [-74.7473, 40.0583],
    "New Mexico": [-106.2485, 34.5199],
    "New York": [-74.0060, 40.7128],
    "North Carolina": [-79.0193, 35.7596],
    "North Dakota": [-101.0020, 47.6505],
    "Ohio": [-82.9071, 39.9612],
    "Oklahoma": [-96.9289, 35.4676],
    "Oregon": [-120.5542, 43.8041],
    "Pennsylvania": [-77.1945, 41.2033],
    "Rhode Island": [-71.4774, 41.5801],
    "South Carolina": [-81.1637, 33.9391],
    "South Dakota": [-99.9018, 43.9695],
    "Tennessee": [-86.5804, 35.5175],
    "Texas": [-99.9018, 31.9686],
    "Utah": [-111.0937, 39.3210],
    "Vermont": [-72.5778, 44.0458],
    "Virginia": [-78.6569, 37.4316],
    "Washington": [-120.7401, 47.7511],
    "West Virginia": [-80.9545, 38.5056],
    "Wisconsin": [-89.6165, 44.2685],
    "Wyoming": [-107.2903, 43.0760]
};

function LocationPrompt({updateUserLocation}: {updateUserLocation: (location: [number, number] | null) => void}) {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    // Function to handle state selection
    // const [selectedState, setSelectedState] = useState<string | null>(null);
    // const handleStateSelect = (state: string) => {
    //     setSelectedState(state);
    //     if (STATE_COORDINATES[state]) {
    //         setUserLocation(STATE_COORDINATES[state]);
    //     } else {
    //         // Location of center of usa
    //         setUserLocation([-98.5795, 39.8283])
    //     }
    // };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    setUserLocation([position.coords.longitude, position.coords.latitude]);
                },
                error => {
                    console.error("Error getting location:", error);
                    alert("Error getting location. Please allow location access or center of USA.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser. Please select a state.");
        }
    };




    // const stateOptions = Object.keys(STATE_COORDINATES)
    //     .sort()
    //     .map((state) => ({ value: state, label: state }));
    //

    useEffect(() => {
        if (userLocation) {
            updateUserLocation(userLocation)
        }
    }, [userLocation, updateUserLocation])


    const [opened, { close }] = useDisclosure(true);

    return (
        <>
            <Modal opened={opened} onClose={close} centered withCloseButton={false}>
                <Flex direction="column" gap="xs">
                    <Button onClick={getLocation}>Use My Location</Button>
                    <Button onClick={() => setUserLocation([-98.5795, 39.8283])}>Use Center of USA</Button>
                </Flex>
            </Modal>
        </>
    );
}


export default LocationPrompt;
