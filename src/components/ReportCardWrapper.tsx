
import {useEffect, useState} from 'react';
import {ReportCard} from "./ReportCard/ReportCard.tsx";
import StateDistrictSelector from "./ReportCard/ReportForm.tsx";
import {StateReportCard} from "./ReportCard/StateReportCard.tsx";

type ReportState = {
    stateCode: string;
    districtId?: string;
} | null;

export function ReportCardWrapper() {
    const [reportState, setReportState] = useState<ReportState>(null);

    // Initialize state from URL on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const stateCode = urlParams.get('stateCode');
        const districtId = urlParams.get('districtId');

        if (stateCode) {
            setReportState({
                stateCode,
                districtId: districtId || undefined
            });
        }
    }, []);

    // Handle form submission
    const handleFormSubmit = (stateCode: string, districtId: string) => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('stateCode', stateCode);
        newUrl.searchParams.set('districtId', districtId);
        window.history.pushState(null, '', newUrl.toString());

        setReportState({ stateCode, districtId });
    };

    // Render based on current state
    if (reportState) {
        if (reportState.districtId) {
            return <ReportCard stateCode={reportState.stateCode} districtId={reportState.districtId} />;
        } else {
            return <StateReportCard stateCode={reportState.stateCode} />;
        }
    }

    // No valid data - show the selection form
    return (
        <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
                Select State and District for Report
            </h2>
            <StateDistrictSelector onSubmit={handleFormSubmit} />
        </div>
    );
}