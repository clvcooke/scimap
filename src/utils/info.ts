import {NUMBER_FORMATTER} from "../constants.ts";

export function processRepName(repName: string, party: string): string {
    let rep_name = repName;
    if (party?.startsWith("Republican")) {
        rep_name = `${rep_name} (R)`;
    } else if (party?.startsWith("Democrat")) {
        rep_name = `${rep_name} (D)`;
    } else {
        if (!rep_name?.trim()) {
            rep_name = `Vacant Seat`;
        } else {
            rep_name = `${rep_name} (I)`;
        }
    }
    rep_name = rep_name.replace('""', '"').replace('""', '"');
    return rep_name;
}

export function generateEconLossString(econLoss: number) {
    let econLossString: string;
    if (econLoss < 100) {
        econLossString = "<$100"
    } else {
        econLossString = `$${NUMBER_FORMATTER.format(econLoss)}`;
    }
    return econLossString
}

export function generateJobLossString(jobLoss: number) {
    if (jobLoss < 10) {
        return "<10"
    } else {
        return `${NUMBER_FORMATTER.format(jobLoss)}`;
    }
}