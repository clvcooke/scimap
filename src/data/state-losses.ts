export const STATE_LOSSES: {
    [key: string]: {
        loss: number,
        state_code: string,
        jobs_loss: number,
    }
} = {
    "Alaska": {"loss": 3235759.36, "state_code": "AK", "jobs_loss": 13.9757265974468},
    "Alabama": {"loss": 135686294.912, "state_code": "AL", "jobs_loss": 586.049316322042},
    "Arkansas": {"loss": 43694625.152, "state_code": "AR", "jobs_loss": 188.723593741617},
    "Arizona": {"loss": 135069378.688, "state_code": "AZ", "jobs_loss": 583.384763269446},
    "California": {"loss": 2277192597.88801, "state_code": "CA", "jobs_loss": 9835.53398662262},
    "Colorado": {"loss": 221764435.328, "state_code": "CO", "jobs_loss": 957.833624927319},
    "Connecticut": {"loss": 429176890.752, "state_code": "CT", "jobs_loss": 1853.67891112034},
    "District of Columbia": {"loss": 79717299.2000001, "state_code": "DC", "jobs_loss": 344.310888034042},
    "Delaware": {"loss": 31819240.448, "state_code": "DE", "jobs_loss": 137.432038530723},
    "Florida": {"loss": 356128949.12, "state_code": "FL", "jobs_loss": 1538.17397173106},
    "Georgia": {"loss": 328348035.328, "state_code": "GA", "jobs_loss": 1418.18406748051},
    "Hawaii": {"loss": 30119730.304, "state_code": "HI", "jobs_loss": 130.091601100255},
    "Iowa": {"loss": 101003881.856, "state_code": "IA", "jobs_loss": 436.250808867405},
    "Idaho": {"loss": 7519560.448, "state_code": "ID", "jobs_loss": 32.4781015094468},
    "Illinois": {"loss": 574105046.784, "state_code": "IL", "jobs_loss": 2479.64520206707},
    "Indiana": {"loss": 192535388.928, "state_code": "IN", "jobs_loss": 831.589020263489},
    "Kansas": {"loss": 59061368.064, "state_code": "KS", "jobs_loss": 255.094845042383},
    "Kentucky": {"loss": 111156823.424, "state_code": "KY", "jobs_loss": 480.10287563983},
    "Louisiana": {"loss": 79281722.88, "state_code": "LA", "jobs_loss": 342.429569034894},
    "Massachusetts": {"loss": 1554297708.16, "state_code": "MA", "jobs_loss": 6713.24329269107},
    "Maryland": {"loss": 551710175.103998, "state_code": "MD", "jobs_loss": 2382.91841587472},
    "Maine": {"loss": 69165616.64, "state_code": "ME", "jobs_loss": 298.736599530213},
    "Michigan": {"loss": 460207199.488, "state_code": "MI", "jobs_loss": 1987.70343608647},
    "Minnesota": {"loss": 335459799.168, "state_code": "MN", "jobs_loss": 1448.90083470434},
    "Missouri": {"loss": 369255449.984, "state_code": "MO", "jobs_loss": 1594.86928397345},
    "Mississippi": {"loss": 22579741.44, "state_code": "MS", "jobs_loss": 97.5252662195745},
    "Montana": {"loss": 12659969.92, "state_code": "MT", "jobs_loss": 54.6802956119149},
    "North Carolina": {"loss": 667762838.272001, "state_code": "NC", "jobs_loss": 2884.16715253651},
    "North Dakota": {"loss": 8960219.136, "state_code": "ND", "jobs_loss": 38.7005209491064},
    "Nebraska": {"loss": 66681977.088, "state_code": "NE", "jobs_loss": 288.009390401362},
    "New Hampshire": {"loss": 68472561.792, "state_code": "NH", "jobs_loss": 295.743192420766},
    "New Jersey": {"loss": 177624791.68, "state_code": "NJ", "jobs_loss": 767.187930022128},
    "New Mexico": {"loss": 53584028.032, "state_code": "NM", "jobs_loss": 231.437397670128},
    "Nevada": {"loss": 11698956.544, "state_code": "NV", "jobs_loss": 50.5295357113191},
    "New York": {"loss": 1770096564.992, "state_code": "NY", "jobs_loss": 7645.31069560375},
    "Ohio": {"loss": 480197286.4, "state_code": "OH", "jobs_loss": 2074.04359870639},
    "Oklahoma": {"loss": 67423811.84, "state_code": "OK", "jobs_loss": 291.213485181277},
    "Oregon": {"loss": 154078091.776, "state_code": "OR", "jobs_loss": 665.486226181447},
    "Pennsylvania": {"loss": 1024019859.84, "state_code": "PA", "jobs_loss": 4422.89428824511},
    "Puerto Rico": {"loss": 17055364.224, "state_code": "PR", "jobs_loss": 73.6646582440851},
    "Rhode Island": {"loss": 97070837.76, "state_code": "RI", "jobs_loss": 419.263405644256},
    "South Carolina": {"loss": 98454625.4080001, "state_code": "SC", "jobs_loss": 425.240190592},
    "South Dakota": {"loss": 12387844.736, "state_code": "SD", "jobs_loss": 53.5049464129362},
    "Tennessee": {"loss": 381027025.664, "state_code": "TN", "jobs_loss": 1645.71247254876},
    "Texas": {"loss": 856110556.799999, "state_code": "TX", "jobs_loss": 3697.66900064682},
    "Utah": {"loss": 127967657.984, "state_code": "UT", "jobs_loss": 552.711373845787},
    "Virginia": {"loss": 205560498.176, "state_code": "VA", "jobs_loss": 887.84640701549},
    "Vermont": {"loss": 23495058.944, "state_code": "VT", "jobs_loss": 101.478658843234},
    "Washington": {"loss": 525898862.72, "state_code": "WA", "jobs_loss": 2271.43551345021},
    "Wisconsin": {"loss": 247275556.736, "state_code": "WI", "jobs_loss": 1068.01995781719},
    "West Virginia": {"loss": 19758398.976, "state_code": "WV", "jobs_loss": 85.339467917617},
    "Wyoming": {"loss": 4955253.632, "state_code": "WY", "jobs_loss": 21.4024784531064}
};

export const TOTAL_JOB_LOSS = Object.values(STATE_LOSSES).reduce((acc, state) => acc + state.jobs_loss, 0);
export const TOTAL_LOSS = Object.values(STATE_LOSSES).reduce((acc, state) => acc + state.loss, 0);

export const STATE_LOSS_ARRAY = Object.keys(STATE_LOSSES).map(stateName => ({
    "Name": stateName,
    "Loss": STATE_LOSSES[stateName].loss as number,
    "State Code": STATE_LOSSES[stateName].state_code as string,
}));

export const STATE_ARRAY = Object.keys(STATE_LOSSES);