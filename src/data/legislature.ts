import legislatureData from "./legislators.json";

interface Rep {
    name: string,
    party: string,
}

interface Senators {
    junior: {
        name: string,
        party: string,
    }
    senior: {
        name: string,
        party: string,
    }
}

export function getHouseRep(district: string): Rep | null {
    // @ts-expect-error: parsing dynamic JSON data
    return legislatureData["reps"][district] as Rep;
}

export function getSenators(stateCode: string): Senators {
    // @ts-expect-error: parsing dynamic JSON data
    return legislatureData["sens"][stateCode] as Senators;
}

export function getSenatorsList(stateCode: string): {
    name: string,
     party: string} [] {
    const senators = getSenators(stateCode);
    if (!senators) return [];
    return [
        senators.junior,
        senators.senior,
    ];
}