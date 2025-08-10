import {NUMBER_FORMATTER} from "../constants.ts";

export function processPoliticianName(name?: string, party?: string): string {
    if (!name) {
        return "Vacant Seat"
    }
    let formatted_name = name;

    if (party?.startsWith("Republican")) {
        formatted_name = `${formatted_name} (R)`;
    } else if (party?.startsWith("Democrat")) {
        formatted_name = `${formatted_name} (D)`;
    } else {
        if (!formatted_name?.trim()) {
            formatted_name = `Vacant Seat`;
        } else {
            formatted_name = `${formatted_name} (I)`;
        }
    }
    formatted_name = formatted_name.replace('""', '"').replace('""', '"');
    return formatted_name;
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