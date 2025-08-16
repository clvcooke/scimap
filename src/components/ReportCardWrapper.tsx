import {useMemo, useState} from 'react';
import {ReportCard} from "./ReportCard/ReportCard.tsx";
import StateDistrictSelector from "./ReportCard/ReportForm.tsx";
import {StateReportCard} from "./ReportCard/StateReportCard.tsx";

// Define parameter configuration with getters
const PARAMS_CONFIG = {
    stateCode: (params: URLSearchParams) => params.get('stateCode'),
    districtId: (params: URLSearchParams) => params.get('districtId'),
} as const;

export function ReportCardWrapper() {
    const [formSubmittedData, setFormSubmittedData] = useState<{stateCode: string, districtId?: string} | null>(null);

    const reportData = useMemo(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const stateCode = PARAMS_CONFIG.stateCode(urlParams);
        const districtId = PARAMS_CONFIG.districtId(urlParams);

        if (stateCode && districtId) {
            return { stateCode, districtId, view: 'district' };
        } else if (stateCode) {
            return { stateCode, view: 'state' };
        } else {
            return { missingParams: ['stateCode'] };
        }
    }, []);

    // Handle form submission for district report
    const handleDistrictFormSubmit = (stateCode: string, districtId: string) => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('stateCode', stateCode);
        newUrl.searchParams.set('districtId', districtId);
        window.history.pushState(null, '', newUrl.toString());
        setFormSubmittedData({ stateCode, districtId });
    };

    // Combine form data and URL data
    const finalReportData = formSubmittedData || reportData;

    // Based on the view, render the appropriate component
    if ('view' in finalReportData) {
        if (finalReportData.view === 'district' && finalReportData.districtId) {
            return <ReportCard stateCode={finalReportData.stateCode} districtId={finalReportData.districtId} />;
        } else if (finalReportData.view === 'state') {
            return <StateReportCard stateCode={finalReportData.stateCode} />;
        }
    }

    // If no valid data, show the selection form
    return (
        <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
                Select State and District for Report
            </h2>
            <StateDistrictSelector onSubmit={handleDistrictFormSubmit} />
        </div>
    );
}