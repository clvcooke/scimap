
import { useState } from 'react';
import { Button, Select, Stack, Group, Text } from '@mantine/core';
import {getAvailableDistricts, getStateNameToCodeMapping} from "../../data/report-card-data.ts";

interface StateDistrictSelectorProps {
    onSubmit: (stateCode: string, district: string) => void;
    disabled?: boolean;
}

interface FormData {
    state: string | null;
    district: string | null;
}

function StateDistrictSelector({ onSubmit, disabled = false }: StateDistrictSelectorProps) {
    const [formData, setFormData] = useState<FormData>({
        state: null,
        district: null,
    });
    const districtsByState = getAvailableDistricts();
    const stateNameToCodeMap = getStateNameToCodeMapping();
    const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

    // Get sorted list of states for the dropdown
    const stateOptions = Object.keys(districtsByState)
        .sort()
        .map(state => ({ value: state, label: state }));

    // Handle state selection
    const handleStateChange = (selectedState: string | null) => {
        setFormData(prev => ({
            ...prev,
            state: selectedState,
            district: null, // Reset district when state changes
        }));

        if (selectedState) {
            const districts = districtsByState[selectedState] || [];
            console.log({districts});
            setAvailableDistricts(districts);

            // Auto-select district if there's only one (at-large)
            if (districts.length === 1) {
                setFormData(prev => ({
                    ...prev,
                    state: selectedState,
                    district: districts[0],
                }));
            }
        } else {
            setAvailableDistricts([]);
        }
    };

    // Handle district selection
    const handleDistrictChange = (selectedDistrict: string | null) => {
        setFormData(prev => ({
            ...prev,
            district: selectedDistrict,
        }));
    };

    // Handle form submission
    const handleSubmit = () => {
        if (formData.state && formData.district) {
            // Convert state name to state code before submitting
            const stateCode = stateNameToCodeMap[formData.state];
            if (stateCode) {
                onSubmit(stateCode, formData.district);
            }
        }
    };

    // Create district options with special handling for single districts
    const districtOptions = availableDistricts.map(district => {
        const label = availableDistricts.length === 1 ? 'At Large' : `District ${district}`;
        return { value: district, label };
    });

    const isSubmitDisabled = !formData.state || !formData.district || disabled;

    return (
        <Stack gap="md">
            <Select
                label="State"
                placeholder="Select a state"
                data={stateOptions}
                value={formData.state}
                onChange={handleStateChange}
                searchable
                clearable
                disabled={disabled}
                size="sm"
            />

            <Select
                label="District"
                placeholder={formData.state ? "Select a district" : "Select a state first"}
                data={districtOptions}
                value={formData.district}
                onChange={handleDistrictChange}
                disabled={!formData.state || disabled}
                clearable={availableDistricts.length > 1} // Don't allow clearing if only one option
                size="sm"
            />

            {/* Show selected values for confirmation */}
            {formData.state && formData.district && (
                <Text size="sm" c="dimmed">
                    Selected: {formData.state} - {availableDistricts.length === 1 ? 'At Large' : `District ${formData.district}`}
                </Text>
            )}

            <Group justify="flex-end">
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitDisabled}
                    size="sm"
                >
                    Submit
                </Button>
            </Group>
        </Stack>
    );
}

export default StateDistrictSelector;