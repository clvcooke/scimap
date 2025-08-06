import {useMemo, useState} from 'react';
import {ReportCard} from "./ReportCard/ReportCard.tsx";
import StateDistrictSelector from "./ReportCard/ReportForm.tsx";

// Define parameter configuration with getters
const REQUIRED_PARAMS = {
    stateCode: (params: URLSearchParams) => params.get('stateCode'),
    districtId: (params: URLSearchParams) => params.get('districtId'),
} as const;

export function ReportCardWrapper() {
    const [formSubmittedData, setFormSubmittedData] = useState<{stateCode: string, districtId: string} | null>(null);

    const reportData = useMemo(() => {
        const urlParams = new URLSearchParams(window.location.search);

        // Check for missing parameters and extract values
        const extractedParams: Record<string, string> = {};
        const missingParams: string[] = [];

        for (const [paramName, getter] of Object.entries(REQUIRED_PARAMS)) {
            const value = getter(urlParams);
            if (!value) {
                missingParams.push(paramName);
            } else {
                extractedParams[paramName] = value;
            }
        }

        if (missingParams.length > 0) {
            return { missingParams };
        }

        return {
            stateCode: extractedParams.stateCode,
            districtId: extractedParams.districtId,
        };
    }, []);

    // Handle form submission
    const handleFormSubmit = (stateCode: string, districtId: string) => {
        // Update URL parameters
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('stateCode', stateCode);
        newUrl.searchParams.set('districtId', districtId);

        // Update the browser URL without refreshing the page
        window.history.pushState(null, '', newUrl.toString());

        // Set the form data to trigger re-render with the report
        setFormSubmittedData({
            stateCode,
            districtId
        });
    };

    // If we have form submitted data, use that instead of URL params
    const finalReportData = formSubmittedData || ('stateCode' in reportData ? reportData : null);

    // Show form if parameters are missing and no form data has been submitted
    if (!finalReportData?.districtId || !finalReportData?.stateCode) {
        return (
            <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
                    Select State and District for Report
                </h2>
                <StateDistrictSelector onSubmit={handleFormSubmit} />
            </div>
        );
    }

    return (
        <ReportCard
            stateCode={finalReportData.stateCode}
            districtId={finalReportData.districtId}
        />
    );
}