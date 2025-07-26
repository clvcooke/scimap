import {useMemo} from 'react';
import {ReportCard} from "./ReportCard/ReportCard.tsx";

// Define parameter configuration with getters
const REQUIRED_PARAMS = {
    stateCode: (params: URLSearchParams) => params.get('stateCode'),
    districtId: (params: URLSearchParams) => params.get('districtId'),
} as const;

export function ReportCardWrapper() {
    const reportData = useMemo(() => {
        const urlParams = new URLSearchParams(window.location.search);

        // Check for missing parameters and extract values
        const extractedParams: Record<string, string> = {};

        for (const [paramName, getter] of Object.entries(REQUIRED_PARAMS)) {
            const value = getter(urlParams);
            if (!value) {
                return { error: `Parameter ${paramName} is missing` };
            }
            extractedParams[paramName] = value;
        }

        return {
            stateCode: extractedParams.stateCode,
            districtId: extractedParams.districtId,

        };
    }, []);

    // Handle error state
    if ('error' in reportData) {
        return <div style={{ padding: '20px', color: 'red', fontSize: '18px' }}>{reportData.error}</div>;
    }

    return (
        <ReportCard
            stateCode={reportData.stateCode}
            districtId={reportData.districtId}
        />
    );
}