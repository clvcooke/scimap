type BaseIDCTile = {
    state: string;
    state_code: string;
    grant_funds: number;
    IDC_loss: number;
    econ_loss: number;
    IDC_loss_log: number;
    econ_loss_log: number;
    jobs_loss: number;
}

type BaseGrantTile = {
    state: string;
    state_code: string;
    terminated_loss: number;
    terminated_econ_loss: number;
    terminated_job_loss: number;
    terminated_loss_noself: number;
    terminated_econ_loss_noself: number;
    terminated_jobs_loss_noself: number;
}

type BaseCombinedTile = {
    state: string;
    state_code: string;
    combined_econ_loss: number;
    combined_job_loss: number;
    terminated_econ_loss: number;
    terminated_job_loss: number;
    IDC_econ_loss: number;
    IDC_job_loss: number;
}

export type BaseBudgetTile = {
    state: string;
    state_code: string;
    budg_NIH_cuts: number;
    budg_NIH_cuts_econ_loss: number;
    budg_NIH_cuts_job_loss: number;
    budg_NIA_cuts_econ_loss: number;
    budg_NCI_cuts_econ_loss: number;
    budg_NIAID_cuts_econ_loss: number;
}

export type CountyBudgetTileProperties = BaseBudgetTile & {
    FIPS: number;
    county: string;
}

export type StateBudgetTileProperties = BaseBudgetTile;
export type DistrictBudgetTileProperties = BaseBudgetTile & {
    GEOID: number;
    rep_name: string;
    pol_party: string;
    CD119FP: string;
};

export type CountyIDCTileProperties = BaseIDCTile & {
    FIPS: number;
    county: string;
    pop_2024: number;
    grant_funds_25k: number;
    econ_loss_25k: number;
    IDC_loss_25k: number;
    fiscal_year: number;
};

export type CountyGrantTileProperties = BaseGrantTile & {
    FIPS: number;
    county: string;
}

export type CountyCombinedTileProperties = BaseCombinedTile & {
    FIPS: number;
    county: string;
}

export type DistrictIDCTileProperties = BaseIDCTile & {
    GEOID: number;
    rep_name: string;
    pol_party: string;
    CD119FP: string;
}

export type DistrictGrantTileProperties = BaseGrantTile & {
    GEOID: number;
    rep_name: string;
    pol_party: string;
    CD119FP: string;
}

export type DistrictCombinedTileProperties = BaseCombinedTile & {
    GEOID: number;
    rep_name: string;
    pol_party: string;
    CD119FP: string;
}

export type StateGrantTileProperties = BaseGrantTile;

export type StateIDCTileProperties = BaseIDCTile & {
    pop_2024: number;
    grant_pc: number;
    loss_pc: number;
    econ_loss_pc: number;
    job_loss: number;
}

export type StateCombinedTileProperties = BaseCombinedTile;

export type IDCTileProperties = CountyIDCTileProperties | DistrictIDCTileProperties | StateIDCTileProperties;
export type GrantTileProperties = CountyGrantTileProperties | DistrictGrantTileProperties | StateGrantTileProperties;
export type CombinedTileProperties =
    CountyCombinedTileProperties
    | DistrictCombinedTileProperties
    | StateCombinedTileProperties;

export type HoverInfo = {
    properties: IDCTileProperties | GrantTileProperties | CombinedTileProperties | BaseBudgetTile;
    x: number;
    y: number;
}

export enum HoverDisplayMode {
    IDC_GRANTS,
    TOTAL,
    TERM,
    BUDGET,
}
