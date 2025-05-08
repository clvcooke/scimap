export type GrantTermination = {
    FIPS: number;
    reporter_url: string;
    award_remaining: number | null;
    termination_date: string | null;
    org_name: string;
    project_title: string;
    cancellation_source: string;
    lat: number;
    lon: number;
}

const grant_losses: GrantTermination[] = [{
    "FIPS": 1073,
    "reporter_url": "https://reporter.nih.gov/project-details/10975992",
    "award_remaining": 232153.26,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF ALABAMA AT BIRMINGHAM",
    "project_title": "ADVANCE SGM Health for Research Diversity",
    "cancellation_source": "Self and HHS reported",
    "lat": 33.50591,
    "lon": -86.799772
}, {
    "FIPS": 1081,
    "reporter_url": "https://reporter.nih.gov/project-details/10867142",
    "award_remaining": 768284.79,
    "termination_date": "2025-03-21",
    "org_name": "AUBURN UNIVERSITY AT AUBURN",
    "project_title": "Targeting Minority Stressors to Improve Eating Disorder Symptoms in Sexual Minority Individuals with Eating Disorders",
    "cancellation_source": "Self and HHS reported",
    "lat": 32.602139,
    "lon": -85.508496
}, {
    "FIPS": 1073,
    "reporter_url": "https://reporter.nih.gov/project-details/10909015",
    "award_remaining": 580259.6800000001,
    "termination_date": "2025-04-01",
    "org_name": "UNIVERSITY OF ALABAMA AT BIRMINGHAM",
    "project_title": "Improving COVID-19 Vaccine Uptake Among Racial and Ethnic Minority Groupswith Rheumatic Diseases",
    "cancellation_source": "HHS reported",
    "lat": 33.50591,
    "lon": -86.799772
}, {
    "FIPS": 1073,
    "reporter_url": "https://reporter.nih.gov/project-details/10888419",
    "award_remaining": 528490.13,
    "termination_date": "2025-03-12",
    "org_name": "UNIVERSITY OF ALABAMA AT BIRMINGHAM",
    "project_title": "Sex, Hormones and Identity affect Nociceptive Expression (SHINE)",
    "cancellation_source": "HHS reported",
    "lat": 33.50591,
    "lon": -86.799772
}, {
    "FIPS": 1073,
    "reporter_url": "https://reporter.nih.gov/project-details/10689869",
    "award_remaining": 12048.4300000001,
    "termination_date": "2025-03-03",
    "org_name": "UNIVERSITY OF ALABAMA AT BIRMINGHAM",
    "project_title": "Mitochondrial-based Determinants of Sex Differences in Acute Kidney Injury",
    "cancellation_source": "HHS reported",
    "lat": 33.50591,
    "lon": -86.799772
}, {
    "FIPS": 1073,
    "reporter_url": "https://reporter.nih.gov/project-details/10688349",
    "award_remaining": 1109151.53,
    "termination_date": "2025-03-24",
    "org_name": "UNIVERSITY OF ALABAMA AT BIRMINGHAM",
    "project_title": "Adaptive Immunity and Persistent SARS-CoV-2 Replication",
    "cancellation_source": "HHS reported",
    "lat": 33.50591,
    "lon": -86.799772
}, {
    "FIPS": 1073,
    "reporter_url": "https://reporter.nih.gov/project-details/10927340",
    "award_remaining": 7912709.6900000004,
    "termination_date": "2025-04-08",
    "org_name": "UNIVERSITY OF ALABAMA AT BIRMINGHAM",
    "project_title": "UAB/Tuskegee Faculty Institutional Recruitment for Sustainable Transformation (UAB/TU FIRST) Partnership (NIH U54)",
    "cancellation_source": "HHS reported",
    "lat": 33.50591,
    "lon": -86.799772
}, {
    "FIPS": 2020,
    "reporter_url": "https://reporter.nih.gov/project-details/10917149",
    "award_remaining": 698945.86,
    "termination_date": "2025-03-10",
    "org_name": "SOUTHCENTRAL FOUNDATION",
    "project_title": "Alaska Native Communities Advancing Vaccine Uptake",
    "cancellation_source": "HHS reported",
    "lat": 61.182148,
    "lon": -149.795959
}, {
    "FIPS": 2020,
    "reporter_url": "https://reporter.nih.gov/project-details/10815842",
    "award_remaining": 92557.24,
    "termination_date": "2025-03-27",
    "org_name": "UNIVERSITY OF ALASKA ANCHORAGE",
    "project_title": "U-RISE at University of Alaska Anchorage (\"Biomed U-RISE\")",
    "cancellation_source": "Self reported",
    "lat": 61.190646,
    "lon": -149.818129
}, {
    "FIPS": 4013,
    "reporter_url": "https://reporter.nih.gov/project-details/10876942",
    "award_remaining": 573690.03,
    "termination_date": "2025-03-21",
    "org_name": "ARIZONA STATE UNIVERSITY-TEMPE CAMPUS",
    "project_title": "Training in Genomics Research (TiGeR)",
    "cancellation_source": "HHS reported",
    "lat": 33.423954,
    "lon": -111.940687
}, {
    "FIPS": 4013,
    "reporter_url": "https://reporter.nih.gov/project-details/10647889",
    "award_remaining": 4047166.2200000002,
    "termination_date": "2025-03-21",
    "org_name": "BANNER HEALTH",
    "project_title": "Establishing the science behind Alzheimer's recruitment registries: opportunities for increasing diversity and accelerating enrollment into trials",
    "cancellation_source": "HHS reported",
    "lat": 33.433422,
    "lon": -112.087594
}, {
    "FIPS": 4013,
    "reporter_url": "https://reporter.nih.gov/project-details/10737776",
    "award_remaining": 206808.02,
    "termination_date": "2025-03-10",
    "org_name": "ARIZONA STATE UNIVERSITY-TEMPE CAMPUS",
    "project_title": "Reducing Vaccine Hesitancy among Hispanic Parents of COVID-19 Vaccine-Eligible Children",
    "cancellation_source": "HHS reported",
    "lat": 33.423954,
    "lon": -111.940687
}, {
    "FIPS": 4023,
    "reporter_url": "https://reporter.nih.gov/project-details/10773630",
    "award_remaining": 0,
    "termination_date": "2025-04-07",
    "org_name": "SOUTHEAST ARIZONA AREA HEALTH EDUCATION CENTER",
    "project_title": "Proyecto Juntos",
    "cancellation_source": "HHS reported",
    "lat": 31.340705,
    "lon": -110.960789
}, {
    "FIPS": 4027,
    "reporter_url": "https://reporter.nih.gov/project-details/10777372",
    "award_remaining": 0,
    "termination_date": "2025-04-07",
    "org_name": "CAMPESINOS SIN FRONTERAS",
    "project_title": "Achieving Equity in Farmworker Health Through Community-Led Research",
    "cancellation_source": "HHS reported",
    "lat": 32.596322,
    "lon": -114.712699
}, {
    "FIPS": 4019,
    "reporter_url": "https://reporter.nih.gov/project-details/10941131",
    "award_remaining": 456912.86,
    "termination_date": "2025-03-03",
    "org_name": "UNIVERSITY OF ARIZONA",
    "project_title": "Mental Health Risk and Resilience among Latinx SGM Adolescents and their Parents",
    "cancellation_source": "Self reported",
    "lat": 32.232844,
    "lon": -110.959467
}, {
    "FIPS": 5119,
    "reporter_url": "https://reporter.nih.gov/project-details/10774318",
    "award_remaining": 1056356.8300000001,
    "termination_date": "2025-03-14",
    "org_name": "UNIV OF ARKANSAS FOR MED SCIS",
    "project_title": "Universal basic income and structural racism in the US South: Differences in health service utilization between older African American men with and without experiences of recent incarceration",
    "cancellation_source": "HHS reported",
    "lat": 34.749005,
    "lon": -92.320097
}, {
    "FIPS": 5119,
    "reporter_url": "https://reporter.nih.gov/project-details/10780817",
    "award_remaining": 0,
    "termination_date": "2025-04-07",
    "org_name": "ARKANSAS CANCER COALITION",
    "project_title": "Cancer in Your Community: Strategies to Reduce Cancer and Chronic Disease in the Arkansas Delta",
    "cancellation_source": "HHS reported",
    "lat": 34.759836,
    "lon": -92.340415
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/10928801",
    "award_remaining": 2084541.29,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CALIFORNIA, SAN FRANCISCO",
    "project_title": "Increasing financial and health equity among low income black youth and young adults",
    "cancellation_source": "Self and HHS reported",
    "lat": 37.767442,
    "lon": -122.413937
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/10890669",
    "award_remaining": 4774757.54,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CALIFORNIA, SAN FRANCISCO",
    "project_title": "Research Coordinating Center to Reduce Disparities in Multiple Chronic Diseases (RCC RD-MCD)",
    "cancellation_source": "Self and HHS reported",
    "lat": 37.767442,
    "lon": -122.413937
}, {
    "FIPS": 6073,
    "reporter_url": "https://reporter.nih.gov/project-details/10850788",
    "award_remaining": 1222606.0800000001,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF CALIFORNIA, SAN DIEGO",
    "project_title": "NEXUS: A novel social network approach to study the effects of intersectional stigma on HIV prevention among Latino MSM",
    "cancellation_source": "Self and HHS reported",
    "lat": 32.876991,
    "lon": -117.24087
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/10931349",
    "award_remaining": 941414.76,
    "termination_date": "2025-03-21",
    "org_name": "SAN FRANCISCO STATE UNIVERSITY",
    "project_title": "Hermanos de Luna y Sol: A community-based HIV prevention intervention",
    "cancellation_source": "Self and HHS reported",
    "lat": 37.72091,
    "lon": -122.476074
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/10696166",
    "award_remaining": 843199.21,
    "termination_date": "2025-03-20",
    "org_name": "PUBLIC HEALTH FOUNDATION ENTERPRISES",
    "project_title": "Tcher, Take Charge: Increasing PrEP Awareness, Uptake, and Adherence Through Health Care Empowerment and Addressing Social Determinants of Health Among Racially Diverse Trans Women in the Deep South",
    "cancellation_source": "Self and HHS reported",
    "lat": 34.029482,
    "lon": -118.023269
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/10894877",
    "award_remaining": 523785.05,
    "termination_date": "2025-03-21",
    "org_name": "PUBLIC HEALTH FOUNDATION ENTERPRISES",
    "project_title": " SHINE Strong: Building the pipeline of HIV behavioral scientists with expertise in trans population health ",
    "cancellation_source": "Self and HHS reported",
    "lat": 34.029482,
    "lon": -118.023269
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/10930914",
    "award_remaining": 620042.55,
    "termination_date": "2025-03-21",
    "org_name": "LOYOLA MARYMOUNT UNIVERSITY",
    "project_title": "Feasibility and Effectiveness of Gamified Digital Intervention to Prevent Alcohol and Mental Health Risks",
    "cancellation_source": "Self and HHS reported",
    "lat": 33.969677,
    "lon": -118.416139
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/10689996",
    "award_remaining": 732102.78,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF CALIFORNIA, SAN FRANCISCO",
    "project_title": "Substance use and DNA methylation at the intersection of sex and gender",
    "cancellation_source": "Self and HHS reported",
    "lat": 37.767442,
    "lon": -122.413937
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/10951379",
    "award_remaining": 233705.36,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF SOUTHERN CALIFORNIA",
    "project_title": "The Roles of Parental Mental Health and Help-Seeking: Utilizing a Family Systems Approach to Upstream Suicide Prevention for Sexual Minority Youth",
    "cancellation_source": "Self and HHS reported",
    "lat": 34.017282,
    "lon": -118.281254
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/11008853",
    "award_remaining": 1571931.6799999999,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF CALIFORNIA, SAN FRANCISCO",
    "project_title": "The Doxy-PEP Impact Study: a multi-city US longitudinal cohort to evaluate doxy-PEP field effectiveness, investigate associated antimicrobial resistance, and establish doxy-PEP to need ratios",
    "cancellation_source": "Self and HHS reported",
    "lat": 37.767442,
    "lon": -122.413937
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/11006100",
    "award_remaining": 645231.4399999999,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF CALIFORNIA, SAN FRANCISCO",
    "project_title": "Randomized Directly Observed Therapy Study to Interpret Clinical Trials of Doxy-PEP",
    "cancellation_source": "Self and HHS reported",
    "lat": 37.767442,
    "lon": -122.413937
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/10883457",
    "award_remaining": 538719.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CALIFORNIA, SAN FRANCISCO",
    "project_title": "Health and economic consequences of changing federal and state policies on reproductive health.",
    "cancellation_source": "Self and HHS reported",
    "lat": 37.767442,
    "lon": -122.413937
}, {
    "FIPS": 6083,
    "reporter_url": "https://reporter.nih.gov/project-details/10988069",
    "award_remaining": 393198.49,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CALIFORNIA SANTA BARBARA",
    "project_title": "Design of a Lay Health Worker Training Intervention to Promote Mental Health Care Access for Racially Diverse Transgender Youth",
    "cancellation_source": "Self and HHS reported",
    "lat": 34.431306,
    "lon": -119.834277
}, {
    "FIPS": 6001,
    "reporter_url": "https://reporter.nih.gov/project-details/10907272",
    "award_remaining": 46201.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CALIFORNIA BERKELEY",
    "project_title": "SOCIAL MEDICINE CASES FOR HEALTH EQUITY",
    "cancellation_source": "Self and HHS reported",
    "lat": 37.870017,
    "lon": -122.268624
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/10804661",
    "award_remaining": 717565.4,
    "termination_date": "2025-03-10",
    "org_name": "UNIVERSITY OF SAN FRANCISCO",
    "project_title": "Uptake, Safety and Effectiveness of COVID\u201019 Vaccines during Pregnancy",
    "cancellation_source": "HHS reported",
    "lat": 37.775292,
    "lon": -122.451727
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/10912496",
    "award_remaining": 27424.64,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CALIFORNIA, SAN FRANCISCO",
    "project_title": "Examining differential effects of state equality-promoting policies on harmful alcohol use among sexual and gender minority adults in the U.S.: an econometrics approach for causal inference",
    "cancellation_source": "HHS reported",
    "lat": 37.767442,
    "lon": -122.413937
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/11177288",
    "award_remaining": 325591.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CALIFORNIA, SAN FRANCISCO",
    "project_title": "UCSF-Kaiser Department of Research Building Interdisciplinary Research Careers in Women's Health (BIRCWH) Program",
    "cancellation_source": "HHS reported",
    "lat": 37.767442,
    "lon": -122.413937
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/10841001",
    "award_remaining": 934385.16,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CALIFORNIA, SAN FRANCISCO",
    "project_title": "Structural Racism and Discrimination in Older Men's Health Inequities",
    "cancellation_source": "HHS reported",
    "lat": 37.767442,
    "lon": -122.413937
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/10870088",
    "award_remaining": 1724629.1399999999,
    "termination_date": "2025-03-10",
    "org_name": "UNIVERSITY OF CALIFORNIA, SAN FRANCISCO",
    "project_title": "The Impact of the Herpes Zoster Vaccine on Herpes Zoster Ophthalmicus",
    "cancellation_source": "HHS reported",
    "lat": 37.767442,
    "lon": -122.413937
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/10854810",
    "award_remaining": 262861.34,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CALIFORNIA, SAN FRANCISCO",
    "project_title": "Short Trainings on Methods for Recruiting, Sampling, and Counting Hard-to-Reach Populations: The H2R Training Program",
    "cancellation_source": "HHS reported",
    "lat": 37.767442,
    "lon": -122.413937
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/10879144",
    "award_remaining": 311971.04,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CALIFORNIA LOS ANGELES",
    "project_title": "Buddhism and HIV Stigma in Thailand: An Intervention Study",
    "cancellation_source": "HHS reported",
    "lat": 34.070199,
    "lon": -118.45102
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/10873787",
    "award_remaining": 94950.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CALIFORNIA LOS ANGELES",
    "project_title": "Organization for the Study of Sex Differences Annual Meeting",
    "cancellation_source": "HHS reported",
    "lat": 34.070199,
    "lon": -118.45102
}, {
    "FIPS": 6113,
    "reporter_url": "https://reporter.nih.gov/project-details/11174110",
    "award_remaining": 206172.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CALIFORNIA AT DAVIS",
    "project_title": "Building Interdisciplinary Research Careers in Women's Health at UC Davis",
    "cancellation_source": "HHS reported",
    "lat": 38.543366,
    "lon": -121.72946
}, {
    "FIPS": 6085,
    "reporter_url": "https://reporter.nih.gov/project-details/10851015",
    "award_remaining": 467793.76,
    "termination_date": "2025-03-21",
    "org_name": "STANFORD UNIVERSITY",
    "project_title": "Stanford Women's Reproductive Health Research Career Development Program",
    "cancellation_source": "HHS reported",
    "lat": 37.426852,
    "lon": -122.17047
}, {
    "FIPS": 6073,
    "reporter_url": "https://reporter.nih.gov/project-details/10889969",
    "award_remaining": 23477.0,
    "termination_date": "2025-03-21",
    "org_name": "SAN DIEGO STATE UNIVERSITY",
    "project_title": "Minority Stress, Stimulant Use, and HIV among Sexual Minority Men: A Biopsychosocial Approach",
    "cancellation_source": "HHS reported",
    "lat": 32.762178,
    "lon": -117.069156
}, {
    "FIPS": 6073,
    "reporter_url": "https://reporter.nih.gov/project-details/10881752",
    "award_remaining": 668144.23,
    "termination_date": "2025-04-01",
    "org_name": "SAN DIEGO STATE UNIVERSITY",
    "project_title": "Increasing COVID-19 Vaccine Uptake among Latinos through a Targeted Clinical and Community-behavioral Intervention",
    "cancellation_source": "HHS reported",
    "lat": 32.762178,
    "lon": -117.069156
}, {
    "FIPS": 6073,
    "reporter_url": "https://reporter.nih.gov/project-details/10870024",
    "award_remaining": 530314.36,
    "termination_date": "2025-03-12",
    "org_name": "SAN DIEGO STATE UNIVERSITY",
    "project_title": "The Socioecology of Sexual Minority Stigma: Data Harmonization to Address Confounding Bias and Investigate Cross-Level MentalHealth Effects",
    "cancellation_source": "HHS reported",
    "lat": 32.762178,
    "lon": -117.069156
}, {
    "FIPS": 6073,
    "reporter_url": "https://reporter.nih.gov/project-details/10809577",
    "award_remaining": 345729.75,
    "termination_date": "2025-03-21",
    "org_name": "SAN DIEGO STATE UNIVERSITY",
    "project_title": "Suicide Prevention for Sexual and Gender Minority Youth",
    "cancellation_source": "HHS reported",
    "lat": 32.762178,
    "lon": -117.069156
}, {
    "FIPS": 6073,
    "reporter_url": "https://reporter.nih.gov/project-details/10869950",
    "award_remaining": 147226.86,
    "termination_date": "2025-03-21",
    "org_name": "SAN DIEGO STATE UNIVERSITY",
    "project_title": "eSTEP: An integrated mHealth intervention to engage high-risk individuals along the full PrEP care continuum",
    "cancellation_source": "HHS reported",
    "lat": 32.762178,
    "lon": -117.069156
}, {
    "FIPS": 6055,
    "reporter_url": "https://reporter.nih.gov/project-details/10667277",
    "award_remaining": 4438772.2400000002,
    "termination_date": "2025-03-21",
    "org_name": "NEUROVATIONS",
    "project_title": "PURPOSE: Positively Uniting Researchers of Pain to Opine, Synthesize, and Engage",
    "cancellation_source": "HHS reported",
    "lat": 38.325376,
    "lon": -122.291992
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/10874754",
    "award_remaining": 12907805.9900000002,
    "termination_date": "2025-03-21",
    "org_name": "CHILDREN'S HOSPITAL OF LOS ANGELES",
    "project_title": "Using Longitudinal Research to Engage African American and Latinx Sexual- and Gender-Minority Youth in the HIV Prevention and Care Continua and Reduce HIV/AIDS-Related Disparities",
    "cancellation_source": "HHS reported",
    "lat": 34.098065,
    "lon": -118.29069
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/10873811",
    "award_remaining": 0.0,
    "termination_date": "2025-03-21",
    "org_name": "CHARLES R. DREW UNIVERSITY OF MED & SCI",
    "project_title": "Charles R. Drew University of Medicine and Science Research Endowment Program",
    "cancellation_source": "HHS reported",
    "lat": 33.923952,
    "lon": -118.245687
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/11000740",
    "award_remaining": 36623754.9600000009,
    "termination_date": "2025-03-21",
    "org_name": "CHARLES R. DREW UNIVERSITY OF MED & SCI",
    "project_title": "Center for Accelerating Excellence in Translational Science (AXIS)",
    "cancellation_source": "HHS reported",
    "lat": 33.923952,
    "lon": -118.245687
}, {
    "FIPS": 6059,
    "reporter_url": "https://reporter.nih.gov/project-details/10872219",
    "award_remaining": 923557.0,
    "termination_date": "2025-03-21",
    "org_name": "CENTER FOR INNOVATIVE PUBLIC HEALTH RESEARCH",
    "project_title": "Harnessing the power of technology to develop a population-based HIV prevention program for trans girls",
    "cancellation_source": "HHS reported",
    "lat": 33.430039,
    "lon": -117.616549
}, {
    "FIPS": 6059,
    "reporter_url": "https://reporter.nih.gov/project-details/10928822",
    "award_remaining": 883397.0,
    "termination_date": "2025-03-11",
    "org_name": "CENTER FOR INNOVATIVE PUBLIC HEALTH RESEARCH",
    "project_title": "#TranscendentHealth - Adapting an LGB+ inclusive teen pregnancy prevention program for transgender boys",
    "cancellation_source": "HHS reported",
    "lat": 33.430039,
    "lon": -117.616549
}, {
    "FIPS": 6059,
    "reporter_url": "https://reporter.nih.gov/project-details/10816577",
    "award_remaining": 309794.15,
    "termination_date": "2025-03-21",
    "org_name": "CALIFORNIA STATE UNIVERSITY FULLERTON",
    "project_title": "A Multidimensional Aging Science Program: MSTEM Scholars Trained in Aging Research (MSTEM STAR)",
    "cancellation_source": "HHS reported",
    "lat": 33.8781,
    "lon": -117.884245
}, {
    "FIPS": 6077,
    "reporter_url": "https://reporter.nih.gov/project-details/10593926",
    "award_remaining": 441077.13,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF THE PACIFIC-STOCKTON",
    "project_title": "GHB Toxicokinetics: Role of sex hormone dependent monocarboxylate transporter regulation and potential for altered overdose risk in transgender men and women",
    "cancellation_source": "HHS reported",
    "lat": 37.984345,
    "lon": -121.309964
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/10684078",
    "award_remaining": 0.0,
    "termination_date": "2025-03-10",
    "org_name": "UNIVERSITY OF SAN FRANCISCO",
    "project_title": "Evaluating Teen-Parent Dynamics in Adolescent COVID-19 Vaccine Acceptance and Uptake",
    "cancellation_source": "HHS reported",
    "lat": 37.775292,
    "lon": -122.451727
}, {
    "FIPS": 6059,
    "reporter_url": "https://reporter.nih.gov/project-details/10675550",
    "award_remaining": 34539.79,
    "termination_date": "2025-02-28",
    "org_name": "UNIVERSITY OF CALIFORNIA-IRVINE",
    "project_title": "One Ballroom: Understanding Intersectional Stigma to Optimize the HIV Prevention Continuum among Vulnerable Populations in the United States",
    "cancellation_source": "HHS reported",
    "lat": 33.64852,
    "lon": -117.82136
}, {
    "FIPS": 6059,
    "reporter_url": "https://reporter.nih.gov/project-details/11175847",
    "award_remaining": 583335.96,
    "termination_date": "2025-03-24",
    "org_name": "UNIVERSITY OF CALIFORNIA-IRVINE",
    "project_title": "Developing a Multi-epitope Pan-Coronavirus Vaccine",
    "cancellation_source": "HHS reported",
    "lat": 33.64852,
    "lon": -117.82136
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/10647851",
    "award_remaining": 140763.75,
    "termination_date": "2025-03-10",
    "org_name": "UNIVERSITY OF CALIFORNIA, SAN FRANCISCO",
    "project_title": "PROmotion of COVid-19 VA(X)ccination in the Emergency Department - PROCOVAXED",
    "cancellation_source": "HHS reported",
    "lat": 37.767442,
    "lon": -122.413937
}, {
    "FIPS": 6073,
    "reporter_url": "https://reporter.nih.gov/project-details/11000334",
    "award_remaining": 275396.39,
    "termination_date": "2025-03-03",
    "org_name": "UNIVERSITY OF CALIFORNIA, SAN DIEGO",
    "project_title": "Androgen effects on the reproductive neuroendocrine axis",
    "cancellation_source": "HHS reported",
    "lat": 32.876991,
    "lon": -117.24087
}, {
    "FIPS": 6083,
    "reporter_url": "https://reporter.nih.gov/project-details/10694092",
    "award_remaining": 53374.98,
    "termination_date": "2025-02-28",
    "org_name": "UNIVERSITY OF CALIFORNIA SANTA BARBARA",
    "project_title": "Health Effects of Intersectional Stigma among Sexual Minority Women",
    "cancellation_source": "HHS reported",
    "lat": 34.431306,
    "lon": -119.834277
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/10272660",
    "award_remaining": 2163140.25,
    "termination_date": "2025-03-24",
    "org_name": "UNIVERSITY OF CALIFORNIA LOS ANGELES",
    "project_title": "Metabolic and epigenetic reprogramming of vital organs in SARS-CoV-2 induced systemic toxicity",
    "cancellation_source": "HHS reported",
    "lat": 34.070199,
    "lon": -118.45102
}, {
    "FIPS": 6113,
    "reporter_url": "https://reporter.nih.gov/project-details/10929332",
    "award_remaining": 13114107.7599999998,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CALIFORNIA AT DAVIS",
    "project_title": "The Clinical Significance of Incidental White Matter Lesions on MRI Amongst a Diverse Population with Cognitive Complaints (INDEED)",
    "cancellation_source": "HHS reported",
    "lat": 38.543366,
    "lon": -121.72946
}, {
    "FIPS": 6085,
    "reporter_url": "https://reporter.nih.gov/project-details/10479828",
    "award_remaining": 1792133.5,
    "termination_date": "2025-03-20",
    "org_name": "STANFORD UNIVERSITY",
    "project_title": "Sex hormone effects on neurodevelopment: Controlled puberty in transgender adolescents",
    "cancellation_source": "HHS reported",
    "lat": 37.426852,
    "lon": -122.17047
}, {
    "FIPS": 6085,
    "reporter_url": "https://reporter.nih.gov/project-details/10647757",
    "award_remaining": 869638.29,
    "termination_date": "2025-03-12",
    "org_name": "STANFORD UNIVERSITY",
    "project_title": "Genomics Diversity Summer Program (GDSP) at Stanford",
    "cancellation_source": "HHS reported",
    "lat": 37.426852,
    "lon": -122.17047
}, {
    "FIPS": 6085,
    "reporter_url": "https://reporter.nih.gov/project-details/10688360",
    "award_remaining": 1736457.8400000001,
    "termination_date": "2025-03-24",
    "org_name": "STANFORD UNIVERSITY",
    "project_title": "Mechanisms and Duration of Immunity to SARS-CoV-2",
    "cancellation_source": "HHS reported",
    "lat": 37.426852,
    "lon": -122.17047
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/10933552",
    "award_remaining": 617588.66,
    "termination_date": "2025-03-26",
    "org_name": "SAN FRANCISCO STATE UNIVERSITY",
    "project_title": "Examining Anti-Racist Healing in Nature to Protect Telomeres of Transitional Age BIPOC for Health Equity.",
    "cancellation_source": "HHS reported",
    "lat": 37.72091,
    "lon": -122.476074
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/10745974",
    "award_remaining": 1738949.49,
    "termination_date": "2025-03-20",
    "org_name": "RAND CORPORATION",
    "project_title": "Still Climbin': A Randomized Controlled Trial of an Intervention to Improve Coping with Discrimination, Address Medical Mistrust, and Reduce Health Disparities among Black Sexual Minority Men",
    "cancellation_source": "HHS reported",
    "lat": 34.009659,
    "lon": -118.490943
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/11145638",
    "award_remaining": 1151084.4099999999,
    "termination_date": "2025-03-20",
    "org_name": "RAND CORPORATION",
    "project_title": "Examining the Mechanisms and Consequences of Sleep Health Inequities Affecting Black Sexual Minority Men",
    "cancellation_source": "HHS reported",
    "lat": 34.009659,
    "lon": -118.490943
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/10610403",
    "award_remaining": 1394620.0800000001,
    "termination_date": "2025-03-20",
    "org_name": "RAND CORPORATION",
    "project_title": "Promoting Reductions in Intersectional Stigma to Improve HIV Testing and PrEP Use Among Latino Sexual Minority Men",
    "cancellation_source": "HHS reported",
    "lat": 34.009659,
    "lon": -118.490943
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/10598040",
    "award_remaining": 821135.29,
    "termination_date": "2025-03-20",
    "org_name": "PUBLIC HEALTH FOUNDATION ENTERPRISES",
    "project_title": "PrEP-3D: An Integrated Pharmacy Digital Diary and Delivery Strategy to Increase PrEP Use Among MSM",
    "cancellation_source": "HHS reported",
    "lat": 34.029482,
    "lon": -118.023269
}, {
    "FIPS": 6073,
    "reporter_url": "https://reporter.nih.gov/project-details/10688355",
    "award_remaining": 409666.46,
    "termination_date": "2025-03-24",
    "org_name": "LA JOLLA INSTITUTE FOR IMMUNOLOGY",
    "project_title": "SARS-CoV-2-reactive tissue-resident memory T cells in healthy and cancer subjects",
    "cancellation_source": "HHS reported",
    "lat": 32.838775,
    "lon": -117.253243
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/10274223",
    "award_remaining": 1050053.3500000001,
    "termination_date": "2025-03-24",
    "org_name": "KECK GRADUATE INST OF APPLIED LIFE SCIS",
    "project_title": "Rapid response for pandemics: single cell sequencing and deep learning to predict antibody sequences against an emerging antigen",
    "cancellation_source": "HHS reported",
    "lat": 34.092479,
    "lon": -117.722006
}, {
    "FIPS": 6001,
    "reporter_url": "https://reporter.nih.gov/project-details/10273983",
    "award_remaining": 1023959.12,
    "termination_date": "2025-03-24",
    "org_name": "GENENDEAVOR, LLC",
    "project_title": "Development of a handheld rapid air sensing system to monitor and quantify SARS-CoV-2 in aerosols in real-time",
    "cancellation_source": "HHS reported",
    "lat": 37.52099,
    "lon": -121.948289
}, {
    "FIPS": 6059,
    "reporter_url": "https://reporter.nih.gov/project-details/10703231",
    "award_remaining": 1532589.0,
    "termination_date": "2025-03-21",
    "org_name": "CENTER FOR INNOVATIVE PUBLIC HEALTH RESEARCH",
    "project_title": "Harnessing the power of text messaging to reduce HIV incidence in adolescent males across the United States",
    "cancellation_source": "HHS reported",
    "lat": 33.430039,
    "lon": -117.616549
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/10688386",
    "award_remaining": 1572134.71,
    "termination_date": "2025-03-24",
    "org_name": "CEDARS-SINAI MEDICAL CENTER",
    "project_title": "Diversity and Determinants of the Immune-Inflammatory Response to SARS-CoV-2",
    "cancellation_source": "HHS reported",
    "lat": 34.076544,
    "lon": -118.380004
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/10545069",
    "award_remaining": 199252.84,
    "termination_date": "2025-03-24",
    "org_name": "CALIFORNIA STATE UNIVERSITY NORTHRIDGE",
    "project_title": "COVID-19 and Southeast Asian Americans",
    "cancellation_source": "HHS reported",
    "lat": 34.245875,
    "lon": -118.501885
}, {
    "FIPS": 6059,
    "reporter_url": "https://reporter.nih.gov/project-details/10946664",
    "award_remaining": 668653.4399999999,
    "termination_date": "2025-04-01",
    "org_name": "UNIVERSITY OF CALIFORNIA-IRVINE",
    "project_title": "Influence of Social Media, Social Networks, and Misinformation on Vaccine Acceptance Among Black and Latinx Individuals",
    "cancellation_source": "HHS reported",
    "lat": 33.64852,
    "lon": -117.82136
}, {
    "FIPS": 6073,
    "reporter_url": "https://reporter.nih.gov/project-details/11020551",
    "award_remaining": 186333.57,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CALIFORNIA, SAN DIEGO",
    "project_title": "CHAMPION - Combining HIV And Stimulant Prevention and Treatment Interventions Optimized for HIV-Negative MSM",
    "cancellation_source": "HHS reported",
    "lat": 32.876991,
    "lon": -117.24087
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/10986884",
    "award_remaining": 434471.63,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF CALIFORNIA LOS ANGELES",
    "project_title": "Race & Place: The Impacts of Racial Inequality on Substance Use and HIV Outcomes in Los Angeles",
    "cancellation_source": "HHS reported",
    "lat": 34.070199,
    "lon": -118.45102
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/11145431",
    "award_remaining": 924267.39,
    "termination_date": "2025-03-21",
    "org_name": "RAND CORPORATION",
    "project_title": "Social Connectedness, Loneliness, and Health Among Aging Black Sexual Minority Men",
    "cancellation_source": "HHS reported",
    "lat": 34.009659,
    "lon": -118.490943
}, {
    "FIPS": 6001,
    "reporter_url": "https://reporter.nih.gov/project-details/10688354",
    "award_remaining": 1267789.1200000001,
    "termination_date": "2025-03-24",
    "org_name": "KAISER FOUNDATION RESEARCH INSTITUTE",
    "project_title": "SARS-CoV-2 Serological Antibody Testing for Disease Surveillance and Clinical Use",
    "cancellation_source": "HHS reported",
    "lat": 37.805769,
    "lon": -122.265214
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/10900989",
    "award_remaining": 2108893.4700000002,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CALIFORNIA, SAN FRANCISCO",
    "project_title": "Asian Americans & Racism: Individual and Structural Experiences (ARISE)",
    "cancellation_source": "HHS reported",
    "lat": 37.767442,
    "lon": -122.413937
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/10618102",
    "award_remaining": 215395.15,
    "termination_date": "2025-03-21",
    "org_name": "PUBLIC HEALTH FOUNDATION ENTERPRISES",
    "project_title": "MyPrEP Plus: Development and Pilot Testing of Novel Pre-Exposure Prophylaxis Support Tools for Transgender Women",
    "cancellation_source": "HHS reported",
    "lat": 34.029482,
    "lon": -118.023269
}, {
    "FIPS": 6059,
    "reporter_url": "https://reporter.nih.gov/project-details/10869531",
    "award_remaining": null,
    "termination_date": "2025-03-22",
    "org_name": "UNIVERSITY OF CALIFORNIA-IRVINE",
    "project_title": "All of Us Southern California Consortium (AoUSCC): Engagement, Enrollment, and Retention of Diverse Populations",
    "cancellation_source": "Self and HHS reported",
    "lat": 33.64852,
    "lon": -117.82136
}, {
    "FIPS": 6037,
    "reporter_url": "https://reporter.nih.gov/project-details/10782014",
    "award_remaining": null,
    "termination_date": "2025-04-07",
    "org_name": "HOUSING AUTHORITY OF THE CITY OF LOS ANGELES",
    "project_title": "Watts Rising: A Vision for a Healthier Watts",
    "cancellation_source": "Self and HHS reported",
    "lat": 34.060406,
    "lon": -118.281668
}, {
    "FIPS": 6073,
    "reporter_url": "https://reporter.nih.gov/project-details/10926894",
    "award_remaining": 6458390.9800000004,
    "termination_date": "2025-04-08",
    "org_name": "UNIVERSITY OF CALIFORNIA, SAN DIEGO",
    "project_title": "UC San Diego FIRST Program",
    "cancellation_source": "HHS reported",
    "lat": 32.876991,
    "lon": -117.24087
}, {
    "FIPS": 6073,
    "reporter_url": "https://reporter.nih.gov/project-details/10927273",
    "award_remaining": 8283007.5999999996,
    "termination_date": "2025-04-08",
    "org_name": "SAN DIEGO STATE UNIVERSITY",
    "project_title": "SDSU FUERTE: Faculty United towards Excellence in Research and Transformational Engagement",
    "cancellation_source": "HHS reported",
    "lat": 32.762178,
    "lon": -117.069156
}, {
    "FIPS": 6085,
    "reporter_url": "https://reporter.nih.gov/project-details/11131465",
    "award_remaining": null,
    "termination_date": "2025-03-14",
    "org_name": "STANFORD UNIVERSITY",
    "project_title": "PRIDEnet for the All of Us Research Program ",
    "cancellation_source": "HHS reported",
    "lat": 37.426852,
    "lon": -122.17047
}, {
    "FIPS": 6085,
    "reporter_url": "https://reporter.nih.gov/project-details/10939418",
    "award_remaining": 159542.0,
    "termination_date": "2025-03-28",
    "org_name": "STANFORD UNIVERSITY",
    "project_title": "The ADELANTE Trial: Testing a multi-level approach for improving household food insecurity and glycemic control among Latinos with diabetes",
    "cancellation_source": "Self reported",
    "lat": 37.426852,
    "lon": -122.17047
}, {
    "FIPS": 6085,
    "reporter_url": "https://reporter.nih.gov/project-details/10816457",
    "award_remaining": 122994.26,
    "termination_date": "2025-03-27",
    "org_name": "SAN JOSE STATE UNIVERSITY",
    "project_title": "U-RISE Program at San Jose State University",
    "cancellation_source": "Self reported",
    "lat": 37.340938,
    "lon": -121.889413
}, {
    "FIPS": 6079,
    "reporter_url": "https://reporter.nih.gov/project-details/10814901",
    "award_remaining": 167704.38,
    "termination_date": "2025-03-31",
    "org_name": "CALIFORNIA POLY STATE U SAN LUIS OBISPO",
    "project_title": "U-RISE at Cal Poly",
    "cancellation_source": "Self reported",
    "lat": 35.299317,
    "lon": -120.656618
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/10875365",
    "award_remaining": 721616.09,
    "termination_date": "2025-04-11",
    "org_name": "UNIVERSITY OF CALIFORNIA, SAN FRANCISCO",
    "project_title": "Genetic and social determinants of pharmacological health outcomes in ancestrally diverse populations",
    "cancellation_source": "Self reported",
    "lat": 37.767442,
    "lon": -122.413937
}, {
    "FIPS": 6087,
    "reporter_url": "https://reporter.nih.gov/project-details/11018267",
    "award_remaining": 585773.0,
    "termination_date": "2025-04-02",
    "org_name": "UNIVERSITY OF CALIFORNIA SANTA CRUZ",
    "project_title": "UCSC IMSD",
    "cancellation_source": "Self reported",
    "lat": 36.97756,
    "lon": -122.055836
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/10894277",
    "award_remaining": 952369.61,
    "termination_date": "2025-04-02",
    "org_name": "UNIVERSITY OF CALIFORNIA, SAN FRANCISCO",
    "project_title": "Scaling Up Culturally Affirming Pathways to Biomedical Faculty Careers for Native Scholars",
    "cancellation_source": "Self reported",
    "lat": 37.767442,
    "lon": -122.413937
}, {
    "FIPS": 6075,
    "reporter_url": "https://reporter.nih.gov/project-details/11006265",
    "award_remaining": 944472.0,
    "termination_date": null,
    "org_name": "SAN FRANCISCO DEPARTMENT OF PUBLIC HEALTH",
    "project_title": "Midcareer K24 Award for Mentoring and Patient-Oriented Research",
    "cancellation_source": "Self reported",
    "lat": 37.778128,
    "lon": -122.418652
}, {
    "FIPS": 6073,
    "reporter_url": "https://reporter.nih.gov/project-details/10844512",
    "award_remaining": 239574.6,
    "termination_date": "2025-04-02",
    "org_name": "SAN DIEGO STATE UNIVERSITY",
    "project_title": "MARC at San Diego State University",
    "cancellation_source": "Self reported",
    "lat": 32.762178,
    "lon": -117.069156
}, {
    "FIPS": 8001,
    "reporter_url": "https://reporter.nih.gov/project-details/10933397",
    "award_remaining": 227642.8,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF COLORADO DENVER",
    "project_title": "Proud to Quit (P2Q): A Person-centered mobile technology intervention for smoking cessation among transgender adults",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.745098,
    "lon": -104.837605
}, {
    "FIPS": 8001,
    "reporter_url": "https://reporter.nih.gov/project-details/10896991",
    "award_remaining": 177207.56,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF COLORADO DENVER",
    "project_title": "Population-Specific Eating Disorder Risk Factors in Sexual Minority Women",
    "cancellation_source": "HHS reported",
    "lat": 39.745098,
    "lon": -104.837605
}, {
    "FIPS": 8001,
    "reporter_url": "https://reporter.nih.gov/project-details/10839789",
    "award_remaining": 135592.67,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF COLORADO DENVER",
    "project_title": "Formative work to develop differentiated communication tools to facilitate transgender women's recruitment, enrollment, and retention in HIV vaccine trials",
    "cancellation_source": "HHS reported",
    "lat": 39.745098,
    "lon": -104.837605
}, {
    "FIPS": 8031,
    "reporter_url": "https://reporter.nih.gov/project-details/10912686",
    "award_remaining": 138989.95,
    "termination_date": "2025-03-10",
    "org_name": "DENVER HEALTH AND HOSPITAL AUTHORITY",
    "project_title": "Digital Storytelling to Reduce Pediatric Influenza Vaccination Disparities: A Pilot Pragmatic Trial",
    "cancellation_source": "HHS reported",
    "lat": 39.727302,
    "lon": -104.991569
}, {
    "FIPS": 8031,
    "reporter_url": "https://reporter.nih.gov/project-details/10980561",
    "award_remaining": 1038965.79,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF DENVER (COLORADO SEMINARY)",
    "project_title": "Sexual minority couples' health during the transition to marriage",
    "cancellation_source": "HHS reported",
    "lat": 39.676639,
    "lon": -104.959481
}, {
    "FIPS": 8001,
    "reporter_url": "https://reporter.nih.gov/project-details/11023071",
    "award_remaining": 247044.0,
    "termination_date": "2025-03-12",
    "org_name": "UNIVERSITY OF COLORADO DENVER",
    "project_title": "Effect of pubertal hormones on Headache in Transmasculine Adolescents",
    "cancellation_source": "HHS reported",
    "lat": 39.745098,
    "lon": -104.837605
}, {
    "FIPS": 8001,
    "reporter_url": "https://reporter.nih.gov/project-details/10924846",
    "award_remaining": 193076.78,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF COLORADO DENVER",
    "project_title": "Formative work for the development of an intervention to support combined HIV/syphilis self-testing and linkage to prevention and treatment services for transgender women in South Africa",
    "cancellation_source": "HHS reported",
    "lat": 39.745098,
    "lon": -104.837605
}, {
    "FIPS": 8001,
    "reporter_url": "https://reporter.nih.gov/project-details/10949774",
    "award_remaining": 429000.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF COLORADO DENVER",
    "project_title": "Feasibility study for assessing processes and outcomes related to gender affirming care",
    "cancellation_source": "HHS reported",
    "lat": 39.745098,
    "lon": -104.837605
}, {
    "FIPS": 8001,
    "reporter_url": "https://reporter.nih.gov/project-details/11136699",
    "award_remaining": 548139.98,
    "termination_date": "2025-03-24",
    "org_name": "UNIVERSITY OF COLORADO DENVER",
    "project_title": "A Tunable Nanophage Platform for Vaccine Development",
    "cancellation_source": "HHS reported",
    "lat": 39.745098,
    "lon": -104.837605
}, {
    "FIPS": 8041,
    "reporter_url": "https://reporter.nih.gov/project-details/10740591",
    "award_remaining": 470869.92,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF COLORADO",
    "project_title": "An Online Family-based Program to Prevent Alcohol Use and Dating and Sexual Violence among Sexual and Gender Minority Youth",
    "cancellation_source": "HHS reported",
    "lat": 38.891282,
    "lon": -104.800059
}, {
    "FIPS": 9110,
    "reporter_url": "https://reporter.nih.gov/project-details/10884497",
    "award_remaining": 362492.15,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CONNECTICUT STORRS",
    "project_title": "Development and Testing of a Mobile Application to Enhance HIV Prevention Cascade in Malaysian MSM",
    "cancellation_source": "Self and HHS reported",
    "lat": 41.811419,
    "lon": -72.247553
}, {
    "FIPS": 9170,
    "reporter_url": "https://reporter.nih.gov/project-details/11056229",
    "award_remaining": 2384835.4300000002,
    "termination_date": "2025-03-20",
    "org_name": "YALE UNIVERSITY",
    "project_title": "Examining Non-Congregate Shelter Effects on Mental Health Crises through Community Health Partnerships in Connecticut",
    "cancellation_source": "Self and HHS reported",
    "lat": 41.310925,
    "lon": -72.926428
}, {
    "FIPS": 9110,
    "reporter_url": "https://reporter.nih.gov/project-details/11006733",
    "award_remaining": 652676.04,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF CONNECTICUT STORRS",
    "project_title": "Optimizing a Just-in-Time Adaptive Intervention to Increase Uptake of Chemsex Harm Reduction Services in MSM: A Micro-randomized Trial",
    "cancellation_source": "Self and HHS reported",
    "lat": 41.811419,
    "lon": -72.247553
}, {
    "FIPS": 9170,
    "reporter_url": "https://reporter.nih.gov/project-details/11009322",
    "award_remaining": 77908.0,
    "termination_date": "2025-03-18",
    "org_name": "YALE UNIVERSITY",
    "project_title": "Training in Behavioral Design Interventions to Address Stigma among Men Who have Sex with Men",
    "cancellation_source": "Self and HHS reported",
    "lat": 41.310925,
    "lon": -72.926428
}, {
    "FIPS": 9170,
    "reporter_url": "https://reporter.nih.gov/project-details/10757639",
    "award_remaining": 554446.41,
    "termination_date": "2025-03-21",
    "org_name": "YALE UNIVERSITY",
    "project_title": "Malaysian Implementation Science Training (MIST) Program in HIV",
    "cancellation_source": "HHS reported",
    "lat": 41.310925,
    "lon": -72.926428
}, {
    "FIPS": 9170,
    "reporter_url": "https://reporter.nih.gov/project-details/10906247",
    "award_remaining": 915164.67,
    "termination_date": "2025-03-21",
    "org_name": "YALE UNIVERSITY",
    "project_title": "A unified protocol to address sexual minority women's minority stress, mental health and hazardous drinking",
    "cancellation_source": "HHS reported",
    "lat": 41.310925,
    "lon": -72.926428
}, {
    "FIPS": 9170,
    "reporter_url": "https://reporter.nih.gov/project-details/10892987",
    "award_remaining": 403397.4,
    "termination_date": "2025-03-21",
    "org_name": "YALE UNIVERSITY",
    "project_title": "Implementing sustainable evidence-based mental healthcare in low-resource community settings nationwide to advance mental health equity for sexual and gender minority individuals",
    "cancellation_source": "HHS reported",
    "lat": 41.310925,
    "lon": -72.926428
}, {
    "FIPS": 9170,
    "reporter_url": "https://reporter.nih.gov/project-details/10932285",
    "award_remaining": 1.0,
    "termination_date": "2025-03-21",
    "org_name": "YALE UNIVERSITY",
    "project_title": "Enhancing dissemination and career development in sex and gender translational science in alcohol use",
    "cancellation_source": "HHS reported",
    "lat": 41.310925,
    "lon": -72.926428
}, {
    "FIPS": 9170,
    "reporter_url": "https://reporter.nih.gov/project-details/10583450",
    "award_remaining": 1801498.1799999999,
    "termination_date": "2025-03-20",
    "org_name": "YALE UNIVERSITY",
    "project_title": "Biopsychosocial mechanisms underlying internalizing psychopathology in a prospective, population-based cohort of sexual minority young adults",
    "cancellation_source": "HHS reported",
    "lat": 41.310925,
    "lon": -72.926428
}, {
    "FIPS": 9170,
    "reporter_url": "https://reporter.nih.gov/project-details/10675704",
    "award_remaining": 102911.59,
    "termination_date": "2025-03-21",
    "org_name": "YALE UNIVERSITY",
    "project_title": "Cardiometabolic effects of gender-affirming hormone therapy in transgender adolescents",
    "cancellation_source": "HHS reported",
    "lat": 41.310925,
    "lon": -72.926428
}, {
    "FIPS": 9170,
    "reporter_url": "https://reporter.nih.gov/project-details/10650426",
    "award_remaining": 39117.61,
    "termination_date": "2025-03-21",
    "org_name": "YALE UNIVERSITY",
    "project_title": "Strengthening the HIV care continuum for transgender women living with HIV in Malaysia",
    "cancellation_source": "HHS reported",
    "lat": 41.310925,
    "lon": -72.926428
}, {
    "FIPS": 9170,
    "reporter_url": "https://reporter.nih.gov/project-details/10680624",
    "award_remaining": 436799.16,
    "termination_date": "2025-03-24",
    "org_name": "YALE UNIVERSITY",
    "project_title": "Immuno-Serological Assays for Monitoring COVID19 in Patients with Hematologic Malignancies",
    "cancellation_source": "HHS reported",
    "lat": 41.310925,
    "lon": -72.926428
}, {
    "FIPS": 9170,
    "reporter_url": "https://reporter.nih.gov/project-details/10999798",
    "award_remaining": 995044.79,
    "termination_date": "2025-03-12",
    "org_name": "YALE UNIVERSITY",
    "project_title": "Theoretically Informed Behavioral Intervention to Enhance QOL and Prevent HIV-related Comorbidities in Ethnic and Racial Sexual Minority Men",
    "cancellation_source": "HHS reported",
    "lat": 41.310925,
    "lon": -72.926428
}, {
    "FIPS": 9170,
    "reporter_url": "https://reporter.nih.gov/project-details/11009836",
    "award_remaining": 640246.08,
    "termination_date": "2025-03-21",
    "org_name": "YALE UNIVERSITY",
    "project_title": "A Multi-Level Integrated Strategy to Optimize PrEP Adherence for Black MSM and Accelerate Implementation at Scale",
    "cancellation_source": "HHS reported",
    "lat": 41.310925,
    "lon": -72.926428
}, {
    "FIPS": 9170,
    "reporter_url": "https://reporter.nih.gov/project-details/10745886",
    "award_remaining": 1931845.46,
    "termination_date": "2025-03-24",
    "org_name": "YALE UNIVERSITY",
    "project_title": "RADx-Rad Discoveries & Data: Consortium Coordination Center Program Organization",
    "cancellation_source": "HHS reported",
    "lat": 41.310925,
    "lon": -72.926428
}, {
    "FIPS": 9170,
    "reporter_url": "https://reporter.nih.gov/project-details/10741051",
    "award_remaining": 207986.07,
    "termination_date": "2025-03-21",
    "org_name": "YALE UNIVERSITY",
    "project_title": "Development and Initial Trial of Brief Interventions to Help Parents of Stigmatized Youth Reduce Distress and Strengthen Attachment",
    "cancellation_source": "HHS reported",
    "lat": 41.310925,
    "lon": -72.926428
}, {
    "FIPS": 9170,
    "reporter_url": "https://reporter.nih.gov/project-details/10976885",
    "award_remaining": 696270.21,
    "termination_date": "2025-04-07",
    "org_name": "YALE UNIVERSITY",
    "project_title": "ComPASS Health Equity Research Hub at Yale",
    "cancellation_source": "HHS reported",
    "lat": 41.310925,
    "lon": -72.926428
}, {
    "FIPS": 9170,
    "reporter_url": "https://reporter.nih.gov/project-details/10784594",
    "award_remaining": 3389.62,
    "termination_date": "2025-03-10",
    "org_name": "YALE UNIVERSITY",
    "project_title": "Enhancing K-12 School Safety During a Respiratory Viral Pandemic",
    "cancellation_source": "HHS reported",
    "lat": 41.310925,
    "lon": -72.926428
}, {
    "FIPS": 9170,
    "reporter_url": "https://reporter.nih.gov/project-details/11100245",
    "award_remaining": 161239.0,
    "termination_date": "2025-03-28",
    "org_name": "YALE UNIVERSITY",
    "project_title": "Recovery Finance: Financial health and mental health after incarceration",
    "cancellation_source": "Self reported",
    "lat": 41.310925,
    "lon": -72.926428
}, {
    "FIPS": 11001,
    "reporter_url": "https://reporter.nih.gov/project-details/11085454",
    "award_remaining": 48974.0,
    "termination_date": "2025-03-18",
    "org_name": "GEORGE WASHINGTON UNIVERSITY",
    "project_title": "HIV risk messaging and medical mistrust in the era of Undetectable=Untransmittable: Psychosocial and Behavioral Implications among Black, Latino/a/e/x, and Multiracial Sexual and Gender Minorities",
    "cancellation_source": "Self and HHS reported",
    "lat": 38.898075,
    "lon": -77.043933
}, {
    "FIPS": 11001,
    "reporter_url": "https://reporter.nih.gov/project-details/10930105",
    "award_remaining": 185832.42,
    "termination_date": "2025-03-21",
    "org_name": "WHITMAN-WALKER INSTITUTE, INC.",
    "project_title": "Intersectional discrimination and linkage to HIV prevention and care in transgender women in Ecuador",
    "cancellation_source": "HHS reported",
    "lat": 38.9127,
    "lon": -77.031423
}, {
    "FIPS": 11001,
    "reporter_url": "https://reporter.nih.gov/project-details/10898868",
    "award_remaining": 189194.0,
    "termination_date": "2025-03-12",
    "org_name": "US HELPING US, PEOPLE INTO LIVING, INC.",
    "project_title": "Multilevel Racism & Discrimination and PrEP Outcomes Among Black SMM in the Southeastern U.S.",
    "cancellation_source": "HHS reported",
    "lat": 38.935098,
    "lon": -77.024402
}, {
    "FIPS": 11001,
    "reporter_url": "https://reporter.nih.gov/project-details/10890869",
    "award_remaining": 1043970.63,
    "termination_date": "2025-03-21",
    "org_name": "GERONTOLOGICAL SOCIETY OF AMERICA",
    "project_title": "Resource Centers for Minority Aging Research National Coordinating Center (RCMARs NCC)",
    "cancellation_source": "HHS reported",
    "lat": 38.903389,
    "lon": -77.029146
}, {
    "FIPS": 11001,
    "reporter_url": "https://reporter.nih.gov/project-details/10885159",
    "award_remaining": 906272.1800000001,
    "termination_date": "2025-03-21",
    "org_name": "GEORGE WASHINGTON UNIVERSITY",
    "project_title": "Identifying socioecological profiles that impact changes in care outcomes among Black Sexual minority men living with HIV",
    "cancellation_source": "HHS reported",
    "lat": 38.898075,
    "lon": -77.043933
}, {
    "FIPS": 11001,
    "reporter_url": "https://reporter.nih.gov/project-details/11032166",
    "award_remaining": 970928.23,
    "termination_date": "2025-03-21",
    "org_name": "GEORGE WASHINGTON UNIVERSITY",
    "project_title": "Multilevel strategies to understand and modify the role of structural and environmental context on HIV inequities for sexual and gender minorities of color",
    "cancellation_source": "HHS reported",
    "lat": 38.898075,
    "lon": -77.043933
}, {
    "FIPS": 11001,
    "reporter_url": "https://reporter.nih.gov/project-details/10935983",
    "award_remaining": 799858.14,
    "termination_date": "2025-03-20",
    "org_name": "CHILDREN'S RESEARCH INSTITUTE",
    "project_title": "Equitable Measurement of Care Disparities and Needs in Intersex Youth/Youth with Variations in Sex Development",
    "cancellation_source": "HHS reported",
    "lat": 38.927274,
    "lon": -77.014396
}, {
    "FIPS": 11001,
    "reporter_url": "https://reporter.nih.gov/project-details/11001714",
    "award_remaining": 613893.4399999999,
    "termination_date": "2025-03-12",
    "org_name": "GEORGE WASHINGTON UNIVERSITY",
    "project_title": "Identifying multilevel facilitators of care outcomes among Positive Deviants to design an intervention for Black sexual minority men living with HIV",
    "cancellation_source": "HHS reported",
    "lat": 38.898075,
    "lon": -77.043933
}, {
    "FIPS": 11001,
    "reporter_url": "https://reporter.nih.gov/project-details/10887202",
    "award_remaining": 73380.23,
    "termination_date": "2025-03-10",
    "org_name": "CHILDREN'S RESEARCH INSTITUTE",
    "project_title": "Caregiver decision making for seasonal respiratory vaccines for children",
    "cancellation_source": "HHS reported",
    "lat": 38.927274,
    "lon": -77.014396
}, {
    "FIPS": 11001,
    "reporter_url": "https://reporter.nih.gov/project-details/10547892",
    "award_remaining": 1417847.6899999999,
    "termination_date": "2025-03-21",
    "org_name": "WHITMAN-WALKER INSTITUTE, INC.",
    "project_title": "Developing a Community-Based Facility to Support Next Generation Biomedical HIV Research",
    "cancellation_source": "HHS reported",
    "lat": 38.9127,
    "lon": -77.031423
}, {
    "FIPS": 11001,
    "reporter_url": "https://reporter.nih.gov/project-details/9496881",
    "award_remaining": 1685233.1299999999,
    "termination_date": "2025-03-20",
    "org_name": "GEORGE WASHINGTON UNIVERSITY",
    "project_title": "Reducing Black Men's Drug Use and Co-Occurring Negative Mental and Physical Health Outcomes: Intersectionality, Social-Structural Stressors, and Protective Factors",
    "cancellation_source": "Self and HHS reported",
    "lat": 38.898075,
    "lon": -77.043933
}, {
    "FIPS": 12086,
    "reporter_url": "https://reporter.nih.gov/project-details/10873293",
    "award_remaining": 26293.35,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MIAMI CORAL GABLES",
    "project_title": "Exploring the Role of Novel Aging-Focused Syndemic Conditions on HIV Risk and Quality of Life among HIV-Negative Older Sexual Minority Men",
    "cancellation_source": "Self and HHS reported",
    "lat": 25.713468,
    "lon": -80.277246
}, {
    "FIPS": 12095,
    "reporter_url": "https://reporter.nih.gov/project-details/10898743",
    "award_remaining": 952865.61,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CENTRAL FLORIDA",
    "project_title": "A Strengths-Based, Intersectional Approach to Suicide Prevention Among Black Sexual and Gender Minority Youth",
    "cancellation_source": "Self and HHS reported",
    "lat": 28.601027,
    "lon": -81.197266
}, {
    "FIPS": 12073,
    "reporter_url": "https://reporter.nih.gov/project-details/10814317",
    "award_remaining": 532028.7,
    "termination_date": "2025-04-01",
    "org_name": "FLORIDA STATE UNIVERSITY",
    "project_title": "A multidimensional Digital Approach to Address Vaccine Hesitancy and Increase COVID-19 Vaccine Uptake among African American Young Adults in the South",
    "cancellation_source": "Self and HHS reported",
    "lat": 30.441455,
    "lon": -84.297889
}, {
    "FIPS": 12086,
    "reporter_url": "https://reporter.nih.gov/project-details/10517510",
    "award_remaining": 183280.78,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF MIAMI SCHOOL OF MEDICINE",
    "project_title": "PrEParados: A Multi-Level Social Network Model to Increase PrEP Enrollment by Latino MSM Self-Identified as Gay, Bisexual",
    "cancellation_source": "Self and HHS reported",
    "lat": 25.713468,
    "lon": -80.277246
}, {
    "FIPS": 12086,
    "reporter_url": "https://reporter.nih.gov/project-details/10900892",
    "award_remaining": 27861.54,
    "termination_date": "2025-03-18",
    "org_name": "UNIVERSITY OF MIAMI CORAL GABLES",
    "project_title": "Intergenerational and Cultural Drivers of Depressive Symptoms in Hispanic Sexual Minority Youth",
    "cancellation_source": "Self and HHS reported",
    "lat": 25.713468,
    "lon": -80.277246
}, {
    "FIPS": 12086,
    "reporter_url": "https://reporter.nih.gov/project-details/11009640",
    "award_remaining": 709453.8,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF MIAMI CORAL GABLES",
    "project_title": "Leveraging a Strategic Alliance of Community-Based Implementers and Researchers to Characterize, Protocolize, and Scale Up Local Implementation Strategies for Ending the HIV Epidemic among Latino MSM",
    "cancellation_source": "Self and HHS reported",
    "lat": 25.713468,
    "lon": -80.277246
}, {
    "FIPS": 12073,
    "reporter_url": "https://reporter.nih.gov/project-details/10986288",
    "award_remaining": 535577.05,
    "termination_date": "2025-03-20",
    "org_name": "FLORIDA STATE UNIVERSITY",
    "project_title": "Characterizing Intersectional Geospatial Stigma and Affirmation Landscapes and Their Influence on Black and Latino Bisexual Men At Risk for Substance Abuse and HIV",
    "cancellation_source": "Self and HHS reported",
    "lat": 30.441455,
    "lon": -84.297889
}, {
    "FIPS": 12095,
    "reporter_url": "https://reporter.nih.gov/project-details/10683578",
    "award_remaining": 2042345.2,
    "termination_date": "2025-03-14",
    "org_name": "UNIVERSITY OF CENTRAL FLORIDA",
    "project_title": "ENTRUST - economic navigation and strengthening to realize unrestricted services for transgender women",
    "cancellation_source": "Self and HHS reported",
    "lat": 28.601027,
    "lon": -81.197266
}, {
    "FIPS": 12086,
    "reporter_url": "https://reporter.nih.gov/project-details/10841041",
    "award_remaining": 233480.13,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF MIAMI SCHOOL OF MEDICINE",
    "project_title": "FINISHING HIV: An EHE model for Latinos Integrating One-Stop-Shop PrEP Services, a Social Network Support Program and a National Pharmacy Chain",
    "cancellation_source": "HHS reported",
    "lat": 25.713468,
    "lon": -80.277246
}, {
    "FIPS": 12086,
    "reporter_url": "https://reporter.nih.gov/project-details/10845547",
    "award_remaining": 688608.55,
    "termination_date": "2025-04-01",
    "org_name": "UNIVERSITY OF MIAMI SCHOOL OF MEDICINE",
    "project_title": "LatiNET, a Multilevel Social Network Model to Examine and Address SARS-CoV-2 Misinformation in Low-Income Latinx Communities.",
    "cancellation_source": "HHS reported",
    "lat": 25.713468,
    "lon": -80.277246
}, {
    "FIPS": 12086,
    "reporter_url": "https://reporter.nih.gov/project-details/10844486",
    "award_remaining": 380227.85,
    "termination_date": "2025-03-12",
    "org_name": "UNIVERSITY OF MIAMI SCHOOL OF MEDICINE",
    "project_title": "Culturally-focused HIV Advancements through the Next Generation for Equity (CHANGE) Training Program",
    "cancellation_source": "HHS reported",
    "lat": 25.713468,
    "lon": -80.277246
}, {
    "FIPS": 12086,
    "reporter_url": "https://reporter.nih.gov/project-details/10774201",
    "award_remaining": 466418.84,
    "termination_date": "2025-03-12",
    "org_name": "UNIVERSITY OF MIAMI CORAL GABLES",
    "project_title": "Monitoring Microaggressions and Adversities to Generate Interventions for Change (MMAGIC) for Black Women Living with HIV",
    "cancellation_source": "HHS reported",
    "lat": 25.713468,
    "lon": -80.277246
}, {
    "FIPS": 12001,
    "reporter_url": "https://reporter.nih.gov/project-details/10472101",
    "award_remaining": 784708.6800000001,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF FLORIDA",
    "project_title": "Transdiagnostic Intervention to Reduce Internalized Health-Related Stigma",
    "cancellation_source": "HHS reported",
    "lat": 29.643443,
    "lon": -82.349637
}, {
    "FIPS": 12095,
    "reporter_url": "https://reporter.nih.gov/project-details/10939431",
    "award_remaining": 237937.95,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CENTRAL FLORIDA",
    "project_title": "Sexually Transmited Infection Testing Risk and Prevention among Trans Women (STRiP-T)",
    "cancellation_source": "HHS reported",
    "lat": 28.601027,
    "lon": -81.197266
}, {
    "FIPS": 12073,
    "reporter_url": "https://reporter.nih.gov/project-details/10854893",
    "award_remaining": 1190121.1699999999,
    "termination_date": "2025-03-20",
    "org_name": "FLORIDA STATE UNIVERSITY",
    "project_title": "Scaling Up Implementation Strategies to Improve the DIAGNOSE and PREVENT Pillars for Young MSM in Florida",
    "cancellation_source": "HHS reported",
    "lat": 30.441455,
    "lon": -84.297889
}, {
    "FIPS": 12073,
    "reporter_url": "https://reporter.nih.gov/project-details/10873927",
    "award_remaining": 295751.54,
    "termination_date": "2025-03-21",
    "org_name": "FLORIDA STATE UNIVERSITY",
    "project_title": "Integration of Electronic SBI(RT) into an HIV Testing Program to Reduce Substance Use and HIV risk Behavior among MSM in Argentina",
    "cancellation_source": "HHS reported",
    "lat": 30.441455,
    "lon": -84.297889
}, {
    "FIPS": 12086,
    "reporter_url": "https://reporter.nih.gov/project-details/10850571",
    "award_remaining": 14777337.0399999991,
    "termination_date": "2025-03-21",
    "org_name": "FLORIDA INTERNATIONAL UNIVERSITY",
    "project_title": "The FIU Research Center in a Minority Institution (FIU-RCMI)",
    "cancellation_source": "HHS reported",
    "lat": 25.761055,
    "lon": -80.376195
}, {
    "FIPS": 12073,
    "reporter_url": "https://reporter.nih.gov/project-details/11001300",
    "award_remaining": 10735906.25,
    "termination_date": "2025-03-21",
    "org_name": "FLORIDA AGRICULTURAL AND MECHANICAL UNIV",
    "project_title": "FAMU Center for Health Disparities Research",
    "cancellation_source": "HHS reported",
    "lat": 30.428914,
    "lon": -84.289766
}, {
    "FIPS": 12086,
    "reporter_url": "https://reporter.nih.gov/project-details/10781877",
    "award_remaining": null,
    "termination_date": "2025-02-28",
    "org_name": "URBAN HEALTH PARTNERSHIPS",
    "project_title": "Leveraging a community-driven approach to address the impact of social determinants of health on structural inequities among Miami-Dade County's intergenerational LGBTQ+ Community",
    "cancellation_source": "HHS reported",
    "lat": 25.758156,
    "lon": -80.199322
}, {
    "FIPS": 12086,
    "reporter_url": "https://reporter.nih.gov/project-details/11009143",
    "award_remaining": 13493.69,
    "termination_date": "2025-03-18",
    "org_name": "UNIVERSITY OF MIAMI SCHOOL OF MEDICINE",
    "project_title": "Exploring Acceptability & Potential Reach of Game-Based & Social Network Strategies for Improving PrEP & HIV Self-Testing Uptake among Latinx Sexual Minority Men Living in an EHE Priority Jurisdiction",
    "cancellation_source": "HHS reported",
    "lat": 25.713468,
    "lon": -80.277246
}, {
    "FIPS": 12086,
    "reporter_url": "https://reporter.nih.gov/project-details/10690482",
    "award_remaining": 1910660.3100000001,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MIAMI SCHOOL OF MEDICINE",
    "project_title": "Reducing Disparities in Dementia and VCID Outcomes in a Multicultural Rural Population",
    "cancellation_source": "HHS reported",
    "lat": 25.713468,
    "lon": -80.277246
}, {
    "FIPS": 12086,
    "reporter_url": "https://reporter.nih.gov/project-details/11207198",
    "award_remaining": 85939.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MIAMI CORAL GABLES",
    "project_title": "Promoting Health and Reducing Risk among Hispanic Sexual Minority Youth and their Families",
    "cancellation_source": "HHS reported",
    "lat": 25.713468,
    "lon": -80.277246
}, {
    "FIPS": 12095,
    "reporter_url": "https://reporter.nih.gov/project-details/10646417",
    "award_remaining": 62207.66,
    "termination_date": "2025-02-28",
    "org_name": "UNIVERSITY OF CENTRAL FLORIDA",
    "project_title": "Facilitators of and barriers to healthcare utilization among racially and ethnically diverse transgender and gender nonbinary young adults",
    "cancellation_source": "HHS reported",
    "lat": 28.601027,
    "lon": -81.197266
}, {
    "FIPS": 12073,
    "reporter_url": "https://reporter.nih.gov/project-details/10831300",
    "award_remaining": 49814.0,
    "termination_date": "2025-03-21",
    "org_name": "FLORIDA STATE UNIVERSITY",
    "project_title": "COVID-19 Administrative Supplement to K01: Adapting, Pilot Testing a Behavioral Intervention to Incorporate Advances in HIV Prevention for Black Young MSM in Alabama",
    "cancellation_source": "HHS reported",
    "lat": 30.441455,
    "lon": -84.297889
}, {
    "FIPS": 12086,
    "reporter_url": "https://reporter.nih.gov/project-details/10948110",
    "award_remaining": 45377.21,
    "termination_date": "2025-03-21",
    "org_name": "FLORIDA INTERNATIONAL UNIVERSITY",
    "project_title": "Identifying preferences for receiving HIV prevention services among GBMSMs and for providing HIV prevention services among HCPs who are active-duty service members",
    "cancellation_source": "HHS reported",
    "lat": 25.761055,
    "lon": -80.376195
}, {
    "FIPS": 12086,
    "reporter_url": "https://reporter.nih.gov/project-details/10662839",
    "award_remaining": 991311.0,
    "termination_date": "2025-03-24",
    "org_name": "FLORIDA INTERNATIONAL UNIVERSITY",
    "project_title": "Community-Engaged Research on COVID-19 Testing Among Underserved and/or Vulnerable Populations",
    "cancellation_source": "HHS reported",
    "lat": 25.761055,
    "lon": -80.376195
}, {
    "FIPS": 12086,
    "reporter_url": "https://reporter.nih.gov/project-details/10835476",
    "award_remaining": 16438.5,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MIAMI SCHOOL OF MEDICINE",
    "project_title": "Employment as prevention: Adapting a structural intervention to achieve HIV equity among immigrant Latino MSM.",
    "cancellation_source": "HHS reported",
    "lat": 25.713468,
    "lon": -80.277246
}, {
    "FIPS": 12073,
    "reporter_url": "https://reporter.nih.gov/project-details/10993606",
    "award_remaining": 16449549.8599999994,
    "termination_date": "2025-03-21",
    "org_name": "FLORIDA STATE UNIVERSITY",
    "project_title": "RP4 LEAP",
    "cancellation_source": "Self and HHS reported",
    "lat": 30.441455,
    "lon": -84.297889
}, {
    "FIPS": 12073,
    "reporter_url": "https://reporter.nih.gov/project-details/10917186",
    "award_remaining": 8203680.1600000001,
    "termination_date": "2025-04-08",
    "org_name": "FLORIDA STATE UNIVERSITY",
    "project_title": "Fostering Institutional Resources for Science Transformation: The FLORIDA-FIRST Health-Science Brigade",
    "cancellation_source": "HHS reported",
    "lat": 30.441455,
    "lon": -84.297889
}, {
    "FIPS": 12086,
    "reporter_url": "https://reporter.nih.gov/project-details/10781719",
    "award_remaining": null,
    "termination_date": "2025-04-07",
    "org_name": "HEALTH CHOICE NETWORK, INC.",
    "project_title": "Addressing Food Insecurity in Underserved Communities",
    "cancellation_source": "HHS reported",
    "lat": 25.784838,
    "lon": -80.341865
}, {
    "FIPS": 12011,
    "reporter_url": "https://reporter.nih.gov/project-details/10811594",
    "award_remaining": 133375.67,
    "termination_date": "2025-03-31",
    "org_name": "NOVA SOUTHEASTERN UNIVERSITY",
    "project_title": "U-RISE at Nova Southeastern University",
    "cancellation_source": "Self reported",
    "lat": 26.07761,
    "lon": -80.242565
}, {
    "FIPS": 12033,
    "reporter_url": "https://reporter.nih.gov/project-details/10847985",
    "award_remaining": 181029.0,
    "termination_date": "2025-03-27",
    "org_name": "UNIVERSITY OF WEST FLORIDA",
    "project_title": "U-RISE at the University of West Florida",
    "cancellation_source": "Self reported",
    "lat": 30.549092,
    "lon": -87.215272
}, {
    "FIPS": 13121,
    "reporter_url": "https://reporter.nih.gov/project-details/10908693",
    "award_remaining": 1688494.1200000001,
    "termination_date": "2025-03-21",
    "org_name": "MOREHOUSE SCHOOL OF MEDICINE",
    "project_title": "Center to Advance Reproductive Justice and Behavioral Health among Black Pregnant/Postpartum Women and Birthing People (CORAL).",
    "cancellation_source": "Self and HHS reported",
    "lat": 33.746607,
    "lon": -84.414781
}, {
    "FIPS": 13121,
    "reporter_url": "https://reporter.nih.gov/project-details/10850638",
    "award_remaining": 467165.77,
    "termination_date": "2025-03-12",
    "org_name": "GEORGIA STATE UNIVERSITY",
    "project_title": "An intersectional approach linking Minority Stressors Experienced by Transgender and Gender Diverse Adults to Alcohol and Drug Use and comorbid Mental and Physical Health Outcomes",
    "cancellation_source": "Self and HHS reported",
    "lat": 33.753531,
    "lon": -84.384483
}, {
    "FIPS": 13089,
    "reporter_url": "https://reporter.nih.gov/project-details/10796999",
    "award_remaining": 573232.39,
    "termination_date": "2025-03-21",
    "org_name": "EMORY UNIVERSITY",
    "project_title": "Structural Influences on Methamphetamine Use among Black Gay and Bisexual Men in Atlanta",
    "cancellation_source": "Self and HHS reported",
    "lat": 33.791247,
    "lon": -84.3249
}, {
    "FIPS": 13089,
    "reporter_url": "https://reporter.nih.gov/project-details/10740848",
    "award_remaining": 159918.99,
    "termination_date": "2025-03-21",
    "org_name": "EMORY UNIVERSITY",
    "project_title": "Brothers building brothers by breaking barriers (B6): A resilience-focused intervention for young Black gay and bisexual men living with HIV",
    "cancellation_source": "Self and HHS reported",
    "lat": 33.791247,
    "lon": -84.3249
}, {
    "FIPS": 13089,
    "reporter_url": "https://reporter.nih.gov/project-details/11000772",
    "award_remaining": 1012863.3100000001,
    "termination_date": "2025-03-20",
    "org_name": "EMORY UNIVERSITY",
    "project_title": "STI Response and Recommendations Under PrEP (STIRRUP)",
    "cancellation_source": "Self and HHS reported",
    "lat": 33.791247,
    "lon": -84.3249
}, {
    "FIPS": 13089,
    "reporter_url": "https://reporter.nih.gov/project-details/10513935",
    "award_remaining": 19397736.2699999996,
    "termination_date": "2025-03-24",
    "org_name": "EMORY UNIVERSITY",
    "project_title": "Antiviral Countermeasures Development Center (AC/DC)",
    "cancellation_source": "Self and HHS reported",
    "lat": 33.791247,
    "lon": -84.3249
}, {
    "FIPS": 13059,
    "reporter_url": "https://reporter.nih.gov/project-details/10772571",
    "award_remaining": 2768181.0899999999,
    "termination_date": "2025-03-12",
    "org_name": "UNIVERSITY OF GEORGIA",
    "project_title": "PREP at University of Georgia",
    "cancellation_source": "HHS reported",
    "lat": 33.931173,
    "lon": -83.378873
}, {
    "FIPS": 13089,
    "reporter_url": "https://reporter.nih.gov/project-details/11012081",
    "award_remaining": 87833.0,
    "termination_date": "2025-03-12",
    "org_name": "EMORY UNIVERSITY",
    "project_title": "Exploring Stigma, Social Support, and Cancer Screenings among Sexual and Gender Diverse People Living with HIV in Georgia",
    "cancellation_source": "HHS reported",
    "lat": 33.791247,
    "lon": -84.3249
}, {
    "FIPS": 13089,
    "reporter_url": "https://reporter.nih.gov/project-details/10928185",
    "award_remaining": 1391835.52,
    "termination_date": "2025-03-20",
    "org_name": "EMORY UNIVERSITY",
    "project_title": "Screening strategies and social determinants of health among people with high risk of anal cancer",
    "cancellation_source": "HHS reported",
    "lat": 33.791247,
    "lon": -84.3249
}, {
    "FIPS": 13089,
    "reporter_url": "https://reporter.nih.gov/project-details/10680627",
    "award_remaining": 1427216.6000000001,
    "termination_date": "2025-03-24",
    "org_name": "EMORY UNIVERSITY",
    "project_title": "Immune Regulation of COVID-19 Infection in Cancer and Autoimmunity",
    "cancellation_source": "HHS reported",
    "lat": 33.791247,
    "lon": -84.3249
}, {
    "FIPS": 13089,
    "reporter_url": "https://reporter.nih.gov/project-details/10837130",
    "award_remaining": 1651955.1899999999,
    "termination_date": "2025-03-21",
    "org_name": "EMORY UNIVERSITY",
    "project_title": "Limited interaction cohort to identify determinants of viral suppression in MSM and transfeminine individuals living with HIV: A multilevel approach",
    "cancellation_source": "HHS reported",
    "lat": 33.791247,
    "lon": -84.3249
}, {
    "FIPS": 13121,
    "reporter_url": "https://reporter.nih.gov/project-details/10458637",
    "award_remaining": 4854705.3899999997,
    "termination_date": "2025-03-21",
    "org_name": "SPELMAN COLLEGE",
    "project_title": "The Next Generation of Black Women Scientists",
    "cancellation_source": "HHS reported",
    "lat": 33.745247,
    "lon": -84.411462
}, {
    "FIPS": 13089,
    "reporter_url": "https://reporter.nih.gov/project-details/10747750",
    "award_remaining": 62797.7,
    "termination_date": "2025-03-21",
    "org_name": "EMORY UNIVERSITY",
    "project_title": "Stigma Reduction and Gender Affirmation to Promote HIV Prevention/Testing in Trans Women",
    "cancellation_source": "HHS reported",
    "lat": 33.791247,
    "lon": -84.3249
}, {
    "FIPS": 13089,
    "reporter_url": "https://reporter.nih.gov/project-details/10685369",
    "award_remaining": 615840.77,
    "termination_date": "2025-03-21",
    "org_name": "EMORY UNIVERSITY",
    "project_title": "Building Community and Research Engagement among Sexual and Gender Minority Older Adults at Risk for Alzheimer\u2019s Disease and Related Dementias",
    "cancellation_source": "HHS reported",
    "lat": 33.791247,
    "lon": -84.3249
}, {
    "FIPS": 13121,
    "reporter_url": "https://reporter.nih.gov/project-details/10849240",
    "award_remaining": 0.0,
    "termination_date": "2025-03-21",
    "org_name": "SPELMAN COLLEGE",
    "project_title": "U-RISE at Spelman College",
    "cancellation_source": "HHS reported",
    "lat": 33.745247,
    "lon": -84.411462
}, {
    "FIPS": 13089,
    "reporter_url": "https://reporter.nih.gov/project-details/10944419",
    "award_remaining": 96944.21,
    "termination_date": "2025-03-03",
    "org_name": "EMORY UNIVERSITY",
    "project_title": "Microbiome mediated effects of gender affirming hormone therapy in mice",
    "cancellation_source": "HHS reported",
    "lat": 33.791247,
    "lon": -84.3249
}, {
    "FIPS": 13089,
    "reporter_url": "https://reporter.nih.gov/project-details/10999960",
    "award_remaining": 20000.0,
    "termination_date": "2025-03-12",
    "org_name": "EMORY UNIVERSITY",
    "project_title": "National LGBT Health Conference 2024",
    "cancellation_source": "HHS reported",
    "lat": 33.791247,
    "lon": -84.3249
}, {
    "FIPS": 13089,
    "reporter_url": "https://reporter.nih.gov/project-details/10894296",
    "award_remaining": 1237047.1200000001,
    "termination_date": "2025-03-21",
    "org_name": "EMORY UNIVERSITY",
    "project_title": "Evaluating the effectiveness of a mobile HIV prevention app to increase HIV and STI testing and PrEP initiation among rural men who have sex with men",
    "cancellation_source": "HHS reported",
    "lat": 33.791247,
    "lon": -84.3249
}, {
    "FIPS": 13089,
    "reporter_url": "https://reporter.nih.gov/project-details/10395048",
    "award_remaining": 38988.0,
    "termination_date": "2025-03-24",
    "org_name": "EMORY UNIVERSITY",
    "project_title": "Leadership Group for the Infectious Diseases Clinical Research Consortium (IDCRCLG)",
    "cancellation_source": "HHS reported",
    "lat": 33.791247,
    "lon": -84.3249
}, {
    "FIPS": 13121,
    "reporter_url": "https://reporter.nih.gov/project-details/10892031",
    "award_remaining": 2696854.3900000001,
    "termination_date": "2025-03-01",
    "org_name": "MOREHOUSE SCHOOL OF MEDICINE",
    "project_title": "FIRST Coordination and Evaluation Center  to promote inclusive excellence",
    "cancellation_source": "Self reported",
    "lat": 33.746607,
    "lon": -84.414781
}, {
    "FIPS": 13067,
    "reporter_url": "https://reporter.nih.gov/project-details/10802308",
    "award_remaining": 327855.74,
    "termination_date": "2025-03-27",
    "org_name": "KENNESAW STATE UNIVERSITY",
    "project_title": "U-RISE at Kennesaw State",
    "cancellation_source": "Self reported",
    "lat": 34.034315,
    "lon": -84.574275
}, {
    "FIPS": 13121,
    "reporter_url": "https://reporter.nih.gov/project-details/10817917",
    "award_remaining": 294344.6,
    "termination_date": "2025-03-27",
    "org_name": "CLARK ATLANTA UNIVERSITY",
    "project_title": "U-RISE at Clark Atlanta University",
    "cancellation_source": "Self reported",
    "lat": 33.747725,
    "lon": -84.41301
}, {
    "FIPS": 15003,
    "reporter_url": "https://reporter.nih.gov/project-details/10747840",
    "award_remaining": 2112263.7799999998,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF HAWAII AT MANOA",
    "project_title": "Transdisciplinary Health Disparities Research Training for Native Hawaiians and Pacific Students",
    "cancellation_source": "Self and HHS reported",
    "lat": 21.299198,
    "lon": -157.820371
}, {
    "FIPS": 15003,
    "reporter_url": "https://reporter.nih.gov/project-details/10854679",
    "award_remaining": 92787.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF HAWAII AT MANOA",
    "project_title": "Evaluating HPV Vaccination Uptake Barriers and its Efficacy in PLWH",
    "cancellation_source": "HHS reported",
    "lat": 21.299198,
    "lon": -157.820371
}, {
    "FIPS": 16057,
    "reporter_url": "https://reporter.nih.gov/project-details/10880678",
    "award_remaining": 281335.35,
    "termination_date": "2025-04-01",
    "org_name": "UNIVERSITY OF IDAHO",
    "project_title": "Eradicating Misconceptions about Viruses using Multimodal Trace Data in an Intelligent Game-based Environment across Educational Contexts",
    "cancellation_source": "HHS reported",
    "lat": 46.730287,
    "lon": -116.996847
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/11081973",
    "award_remaining": 1669152.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF ILLINOIS AT CHICAGO",
    "project_title": "Keeping it LITE 2: Exploring HIV Risk in Vulnerable Youth with Limited Interaction and Digital Health Intervention (LITE-2)",
    "cancellation_source": "Self and HHS reported",
    "lat": 41.871509,
    "lon": -87.667721
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10897139",
    "award_remaining": 6788391.7599999998,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CHICAGO",
    "project_title": "Chicago Chronic Condition Equity Network (C3EN)",
    "cancellation_source": "Self and HHS reported",
    "lat": 41.789554,
    "lon": -87.601172
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10913592",
    "award_remaining": 203101.76,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CHICAGO",
    "project_title": "Identifying Community-Informed DoxyPEP Implementation Strategies to Guide Equitable Delivery of Syphilis Prevention",
    "cancellation_source": "Self and HHS reported",
    "lat": 41.789554,
    "lon": -87.601172
}, {
    "FIPS": 17097,
    "reporter_url": "https://reporter.nih.gov/project-details/10831061",
    "award_remaining": 476022.61,
    "termination_date": "2025-03-21",
    "org_name": "ROSALIND FRANKLIN UNIV OF MEDICINE & SCI",
    "project_title": "A longitudinal and experience sampling investigation of rejection sensitivity and its role in sexual minority adolescents' mental health",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.302294,
    "lon": -87.861378
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10911905",
    "award_remaining": 528100.64,
    "termination_date": "2025-03-21",
    "org_name": "NORTHWESTERN UNIVERSITY AT CHICAGO",
    "project_title": "Intersectional Approaches to Population-Level Health Research: Role of HIV Risk and Mental Health in Alcohol Use Disparities among Diverse Sexual Minority Youth",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.050479,
    "lon": -87.680046
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10914016",
    "award_remaining": 626105.02,
    "termination_date": "2025-03-21",
    "org_name": "NORTHWESTERN UNIVERSITY AT CHICAGO",
    "project_title": "Project Recognize: Improving Measurement of Alcohol Use and Other Disparities by Sex, Sexual Orientation, and Gender Identity through Community Engagement",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.050479,
    "lon": -87.680046
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10764276",
    "award_remaining": 15777826.2100000009,
    "termination_date": "2025-03-21",
    "org_name": "NORTHWESTERN UNIVERSITY AT CHICAGO",
    "project_title": "Multilevel Influences on HIV and Substance Use in a YMSM cohort",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.050479,
    "lon": -87.680046
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/11100046",
    "award_remaining": 207909.38,
    "termination_date": "2025-03-21",
    "org_name": "ILLINOIS INSTITUTE OF TECHNOLOGY",
    "project_title": "A Gender-Affirming Stigma Intervention to Improve Substance Misuse and HIV Risk among Transgender Women",
    "cancellation_source": "Self and HHS reported",
    "lat": 41.831064,
    "lon": -87.629049
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10983635",
    "award_remaining": 639202.4399999999,
    "termination_date": "2025-03-12",
    "org_name": "NORTHWESTERN UNIVERSITY AT CHICAGO",
    "project_title": "SILOS: Structural Inequities across Layers Of Social-Context as Drivers of HIV and Substance Use",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.050479,
    "lon": -87.680046
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10868380",
    "award_remaining": 191339.94,
    "termination_date": "2025-03-21",
    "org_name": "LURIE CHILDREN'S HOSPITAL OF CHICAGO",
    "project_title": "Development and Preliminary Trial of a Digital Transdiagnostic CBT Intervention for Transgender Adolescents",
    "cancellation_source": "Self and HHS reported",
    "lat": 41.896663,
    "lon": -87.622919
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10873156",
    "award_remaining": 558497.14,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF CHICAGO",
    "project_title": "Heavy cannabis use, neurocognition and PrEP care engagement among young Black sexual minority men",
    "cancellation_source": "HHS reported",
    "lat": 41.789554,
    "lon": -87.601172
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10906998",
    "award_remaining": 759434.5600000001,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF CHICAGO",
    "project_title": "Achieving Equity in Patient Outcome Reporting for Timely Assessments of Life with HIV and Substance Use (ePORTAL HIV-S)",
    "cancellation_source": "HHS reported",
    "lat": 41.789554,
    "lon": -87.601172
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10900606",
    "award_remaining": 884649.64,
    "termination_date": "2025-03-21",
    "org_name": "RUSH UNIVERSITY MEDICAL CENTER",
    "project_title": "Implementation of PrEP Care Among Women in Family Planning Clinics",
    "cancellation_source": "HHS reported",
    "lat": 41.87506,
    "lon": -87.668327
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10913990",
    "award_remaining": 352247.64,
    "termination_date": "2025-03-21",
    "org_name": "NORTHWESTERN UNIVERSITY AT CHICAGO",
    "project_title": "A mixed-methods approach to understanding stress and hazardous drinking among same-sex female couples",
    "cancellation_source": "HHS reported",
    "lat": 42.050479,
    "lon": -87.680046
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10840830",
    "award_remaining": 482777.49,
    "termination_date": "2025-04-01",
    "org_name": "NORTHWESTERN UNIVERSITY AT CHICAGO",
    "project_title": "Leveraging Community-Academic Partnerships and Social Networks to Disseminate Vaccine-Related Information and Increase Vaccine Uptake Among Black Individuals with Rheumatic Diseases",
    "cancellation_source": "HHS reported",
    "lat": 42.050479,
    "lon": -87.680046
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10830347",
    "award_remaining": 547595.58,
    "termination_date": "2025-03-18",
    "org_name": "NORTHWESTERN UNIVERSITY AT CHICAGO",
    "project_title": "Training Program in Translational Science, HIV, and Sexual and Gender Minority Health",
    "cancellation_source": "HHS reported",
    "lat": 42.050479,
    "lon": -87.680046
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10798344",
    "award_remaining": 1523541.6200000001,
    "termination_date": "2025-03-21",
    "org_name": "NORTHWESTERN UNIVERSITY AT CHICAGO",
    "project_title": "Effectiveness of Relationship Education for Reducing HIV Incidence in Men Who Have Sex with Men",
    "cancellation_source": "HHS reported",
    "lat": 42.050479,
    "lon": -87.680046
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10925422",
    "award_remaining": 1586027.1000000001,
    "termination_date": "2025-03-21",
    "org_name": "NORTHWESTERN UNIVERSITY AT CHICAGO",
    "project_title": "Intensive Combination Approach to Rollback the HIV Epidemic in Nigerian Youth (iCARE) Plus Effectiveness / Implementation Hybrid Study",
    "cancellation_source": "HHS reported",
    "lat": 42.050479,
    "lon": -87.680046
}, {
    "FIPS": 17019,
    "reporter_url": "https://reporter.nih.gov/project-details/10622325",
    "award_remaining": 54655.6,
    "termination_date": "2025-02-28",
    "org_name": "UNIVERSITY OF ILLINOIS AT URBANA-CHAMPAIGN",
    "project_title": "Racialized Sexual Discrimination (RSD) and Psychological Well-being among Young Sexual Minority Men of Color (YSMMoC)",
    "cancellation_source": "HHS reported",
    "lat": 40.116857,
    "lon": -88.228755
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10597925",
    "award_remaining": 950000.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF ILLINOIS AT CHICAGO",
    "project_title": "Center for Health Equity Research (CHER)",
    "cancellation_source": "HHS reported",
    "lat": 41.871509,
    "lon": -87.667721
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/11049141",
    "award_remaining": 247976.76,
    "termination_date": "2025-03-10",
    "org_name": "UNIVERSITY OF CHICAGO",
    "project_title": "Covid-19 transmission, testing, and vaccination dynamics within migrant worker social networks",
    "cancellation_source": "HHS reported",
    "lat": 41.789554,
    "lon": -87.601172
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10657359",
    "award_remaining": 997142.75,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CHICAGO",
    "project_title": "Boosting Mentor Effectiveness iN Training of Research Scientists (MENTORS) Using Social Cognitive Career Theory to Support Entry of Women & Minorities into Physician-Scientist Careers",
    "cancellation_source": "HHS reported",
    "lat": 41.789554,
    "lon": -87.601172
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10684644",
    "award_remaining": 202745.65,
    "termination_date": "2025-03-21",
    "org_name": "RESILIENT GAMES STUDIO, LLC",
    "project_title": "Step UP for STEM and Health Careers: An Intervention to Reduce STEM-related biases and improve high school STEM learning environments",
    "cancellation_source": "HHS reported",
    "lat": 41.798959,
    "lon": -87.598077
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10662528",
    "award_remaining": 236835.61,
    "termination_date": "2025-03-21",
    "org_name": "NATIONAL OPINION RESEARCH CENTER",
    "project_title": "Sampling Strategies and Measure Development for the LGBT Aging Project (SAMLAP)",
    "cancellation_source": "HHS reported",
    "lat": 41.785875,
    "lon": -87.597545
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10627991",
    "award_remaining": 1447546.5700000001,
    "termination_date": "2025-03-20",
    "org_name": "ENDEAVOR HEALTH CLINICAL OPERATIONS",
    "project_title": "Female Sexual Orientation GWAS",
    "cancellation_source": "HHS reported",
    "lat": 42.064695,
    "lon": -87.689868
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10923493",
    "award_remaining": 236362.25,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF ILLINOIS AT CHICAGO",
    "project_title": "Feasibility, acceptability, and preliminary efficacy of an adapted group-based and online HIV prevention intervention for immigrant sexual minority men in the US",
    "cancellation_source": "HHS reported",
    "lat": 41.871509,
    "lon": -87.667721
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10938706",
    "award_remaining": 713047.09,
    "termination_date": "2025-03-21",
    "org_name": "NORTHWESTERN UNIVERSITY AT CHICAGO",
    "project_title": "Understanding multilevel predictors affecting family formation among sexual and gender minority couples",
    "cancellation_source": "HHS reported",
    "lat": 42.050479,
    "lon": -87.680046
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10927243",
    "award_remaining": 7740427.3700000001,
    "termination_date": "2025-04-08",
    "org_name": "NORTHWESTERN UNIVERSITY AT CHICAGO",
    "project_title": "NURTURE: Northwestern University Recruitment to Transform Under-Representation and achieve Equity",
    "cancellation_source": "HHS reported",
    "lat": 42.050479,
    "lon": -87.680046
}, {
    "FIPS": 17031,
    "reporter_url": "https://reporter.nih.gov/project-details/10624946",
    "award_remaining": 128593.8,
    "termination_date": "2025-03-21",
    "org_name": "HEKTOEN INSTITUTE FOR MEDICAL RESEARCH",
    "project_title": "Keeping it LITE 2: Exploring HIV Risk in Vulnerable Youth with Limited Interaction and Digital Health Intervention (LITE-2)",
    "cancellation_source": "Self reported",
    "lat": 41.868083,
    "lon": -87.682159
}, {
    "FIPS": 18105,
    "reporter_url": "https://reporter.nih.gov/project-details/10934347",
    "award_remaining": 56616.53,
    "termination_date": "2025-03-21",
    "org_name": "TRUSTEES OF INDIANA UNIVERSITY",
    "project_title": "A digital health intervention to increase condom use among adolescent sexual minority males",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.172055,
    "lon": -86.523157
}, {
    "FIPS": 18157,
    "reporter_url": "https://reporter.nih.gov/project-details/10669131",
    "award_remaining": 514784.27,
    "termination_date": "2025-03-24",
    "org_name": "PURDUE UNIVERSITY",
    "project_title": "Novel delivery platform and antigen design for an effective COVID-19 vaccine",
    "cancellation_source": "HHS reported",
    "lat": 40.41872,
    "lon": -86.910361
}, {
    "FIPS": 19103,
    "reporter_url": "https://reporter.nih.gov/project-details/10849875",
    "award_remaining": 236176.95,
    "termination_date": "2025-04-01",
    "org_name": "UNIVERSITY OF IOWA",
    "project_title": "Creating Innovative Vaccine Messaging by Engaging in Patient-Centered Design with Non-Vaccinating Older Adults",
    "cancellation_source": "HHS reported",
    "lat": 41.664405,
    "lon": -91.542152
}, {
    "FIPS": 19103,
    "reporter_url": "https://reporter.nih.gov/project-details/10914060",
    "award_remaining": 431716.82,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF IOWA",
    "project_title": "A novel approach for equitable characterization of gender and its use in exposing subgroup discrepancies in polygenic score associations",
    "cancellation_source": "HHS reported",
    "lat": 41.664405,
    "lon": -91.542152
}, {
    "FIPS": 21067,
    "reporter_url": "https://reporter.nih.gov/project-details/10884906",
    "award_remaining": 564904.49,
    "termination_date": "2025-04-01",
    "org_name": "UNIVERSITY OF KENTUCKY",
    "project_title": "K-VAC: Kentucky Vaccinating Appalachian Communities",
    "cancellation_source": "Self and HHS reported",
    "lat": 38.040959,
    "lon": -84.505885
}, {
    "FIPS": 21067,
    "reporter_url": "https://reporter.nih.gov/project-details/10320997",
    "award_remaining": 209033.0,
    "termination_date": "2025-03-24",
    "org_name": "UNIVERSITY OF KENTUCKY",
    "project_title": "Wastewater Assessment for Coronavirus in Kentucky: Implementing Enhanced Surveillance Technology",
    "cancellation_source": "HHS reported",
    "lat": 38.040959,
    "lon": -84.505885
}, {
    "FIPS": 22071,
    "reporter_url": "https://reporter.nih.gov/project-details/10688376",
    "award_remaining": 2566075.54,
    "termination_date": "2025-03-24",
    "org_name": "TULANE UNIVERSITY OF LOUISIANA",
    "project_title": "Tulane University COVID Antibody and Immunity Network (TUCAIN)",
    "cancellation_source": "HHS reported",
    "lat": 29.935429,
    "lon": -90.12279
}, {
    "FIPS": 22071,
    "reporter_url": "https://reporter.nih.gov/project-details/10690156",
    "award_remaining": 674255.0,
    "termination_date": "2025-03-24",
    "org_name": "TULANE UNIVERSITY OF LOUISIANA",
    "project_title": "Psychosocial Factors and Lupus Disease Progression Among African American Women",
    "cancellation_source": "HHS reported",
    "lat": 29.935429,
    "lon": -90.12279
}, {
    "FIPS": 22033,
    "reporter_url": "https://reporter.nih.gov/project-details/10985454",
    "award_remaining": 233101.0,
    "termination_date": "2025-03-21",
    "org_name": "LOUISIANA STATE UNIV A&M COL BATON ROUGE",
    "project_title": "Cultural Consensus Modeling to Identify Culturally Relevant Risk and Protective Factors for Suicide among Sexual Minority Youth",
    "cancellation_source": "HHS reported",
    "lat": 30.408018,
    "lon": -91.188669
}, {
    "FIPS": 23005,
    "reporter_url": "https://reporter.nih.gov/project-details/10870176",
    "award_remaining": 21567108.0199999996,
    "termination_date": "2025-03-10",
    "org_name": "MAINEHEALTH",
    "project_title": "Northern New England Clinical and Translational Research Network",
    "cancellation_source": "HHS reported",
    "lat": 43.653164,
    "lon": -70.275471
}, {
    "FIPS": 30031,
    "reporter_url": "https://reporter.nih.gov/project-details/10950256",
    "award_remaining": 70780.0,
    "termination_date": "2025-03-20",
    "org_name": "MONTANA STATE UNIVERSITY - BOZEMAN",
    "project_title": "Romantic Relationships, Discrimination Stressors, and Alcohol Use among Sexual and Gender Minority Adults",
    "cancellation_source": "Self and HHS reported",
    "lat": 45.661963,
    "lon": -111.059937
}, {
    "FIPS": 30031,
    "reporter_url": "https://reporter.nih.gov/project-details/10929514",
    "award_remaining": 401684.0,
    "termination_date": "2025-03-21",
    "org_name": "MONTANA STATE UNIVERSITY - BOZEMAN",
    "project_title": "PREP-MT: Providing Research Education for Postbaccalaureate Trainees in Montana",
    "cancellation_source": "HHS reported",
    "lat": 45.661963,
    "lon": -111.059937
}, {
    "FIPS": 30063,
    "reporter_url": "https://reporter.nih.gov/project-details/10913438",
    "award_remaining": 341988.77,
    "termination_date": "2025-03-10",
    "org_name": "UNIVERSITY OF MONTANA",
    "project_title": "Population-level assessment of early childhood vaccination timeliness, parental vaccine hesitancy, and immunization schedule adherence in the United States, including rural-urban disparities",
    "cancellation_source": "HHS reported",
    "lat": 46.860203,
    "lon": -113.983723
}, {
    "FIPS": 31109,
    "reporter_url": "https://reporter.nih.gov/project-details/10929938",
    "award_remaining": 584987.3,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF NEBRASKA LINCOLN",
    "project_title": "Experiences of Rural Sexual and Gender Minority Couples: Does Alcohol Use Explain the Link Between Minority Stress and Intimate Partner Discord and Violence",
    "cancellation_source": "Self and HHS reported",
    "lat": 40.823017,
    "lon": -96.673442
}, {
    "FIPS": 31109,
    "reporter_url": "https://reporter.nih.gov/project-details/10878767",
    "award_remaining": 85336.39,
    "termination_date": "2025-03-12",
    "org_name": "UNIVERSITY OF NEBRASKA LINCOLN",
    "project_title": "Development and Pilot Evaluation of an Online Mentoring Program to Prevent Adversities Among Trans and Other Gender Minority Youth",
    "cancellation_source": "HHS reported",
    "lat": 40.823017,
    "lon": -96.673442
}, {
    "FIPS": 31109,
    "reporter_url": "https://reporter.nih.gov/project-details/10808127",
    "award_remaining": 356143.32,
    "termination_date": "2025-03-12",
    "org_name": "UNIVERSITY OF NEBRASKA LINCOLN",
    "project_title": "An Innovative, Prospective Model to Understand Risk and Protective Factors for Sexual Assault Experiences and Outcomes Among Sexual Minority Men",
    "cancellation_source": "HHS reported",
    "lat": 40.823017,
    "lon": -96.673442
}, {
    "FIPS": 31109,
    "reporter_url": "https://reporter.nih.gov/project-details/10903424",
    "award_remaining": 17840.76,
    "termination_date": "2025-03-18",
    "org_name": "UNIVERSITY OF NEBRASKA LINCOLN",
    "project_title": "Post-Traumatic Stress and Alcohol Use as Mechanisms Explaining IPV Among Bisexual Women Who Disclose Sexual Violence to Partners: Examining Minority Stress as a Moderator",
    "cancellation_source": "HHS reported",
    "lat": 40.823017,
    "lon": -96.673442
}, {
    "FIPS": 31109,
    "reporter_url": "https://reporter.nih.gov/project-details/10781510",
    "award_remaining": null,
    "termination_date": "2025-04-07",
    "org_name": "FEONIX - MOBILITY RISING",
    "project_title": "Reducing Health Disparities through Enhanced Mobility Support and Access",
    "cancellation_source": "HHS reported",
    "lat": 40.859135,
    "lon": -96.725607
}, {
    "FIPS": 32003,
    "reporter_url": "https://reporter.nih.gov/project-details/10896308",
    "award_remaining": 695331.51,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF NEVADA LAS VEGAS",
    "project_title": "Enhancing Measurement and Characterization of Roles and Experiences of Sexual and Gender Minority Caregivers of Persons living with Alzheimer's Disease and Related Dementias",
    "cancellation_source": "HHS reported",
    "lat": 36.109517,
    "lon": -115.141947
}, {
    "FIPS": 32003,
    "reporter_url": "https://reporter.nih.gov/project-details/10449995",
    "award_remaining": 356245.69,
    "termination_date": "2025-02-28",
    "org_name": "UNIVERSITY OF NEVADA LAS VEGAS",
    "project_title": "The Epidemiology of Alzheimer's Disease and Related Dementias in Sexual and Gender Minority Older Adults: Identifying Risk and Protective Factors",
    "cancellation_source": "HHS reported",
    "lat": 36.109517,
    "lon": -115.141947
}, {
    "FIPS": 32031,
    "reporter_url": "https://reporter.nih.gov/project-details/10851779",
    "award_remaining": 119178.64,
    "termination_date": "2025-04-02",
    "org_name": "UNIVERSITY OF NEVADA RENO",
    "project_title": "MARC at the University of Nevada, Reno",
    "cancellation_source": "Self reported",
    "lat": 39.545077,
    "lon": -119.818277
}, {
    "FIPS": 34023,
    "reporter_url": "https://reporter.nih.gov/project-details/10911221",
    "award_remaining": 1181843.3700000001,
    "termination_date": "2025-03-20",
    "org_name": "RUTGERS BIOMEDICAL AND HEALTH SCIENCES",
    "project_title": "Stigma and the non-communicable disease syndemic in aging HIV positive and HIV negative MSM",
    "cancellation_source": "Self and HHS reported",
    "lat": 40.520984,
    "lon": -74.473247
}, {
    "FIPS": 34023,
    "reporter_url": "https://reporter.nih.gov/project-details/11091603",
    "award_remaining": 1032731.61,
    "termination_date": "2025-03-20",
    "org_name": "RUTGERS BIOMEDICAL AND HEALTH SCIENCES",
    "project_title": "Understanding the Role of Structural Oppression for Suicide Risk among Black Sexual and Gender Minority Adolescents and Young Adults",
    "cancellation_source": "Self and HHS reported",
    "lat": 40.520984,
    "lon": -74.473247
}, {
    "FIPS": 34021,
    "reporter_url": "https://reporter.nih.gov/project-details/11135909",
    "award_remaining": 97554.0,
    "termination_date": "2025-03-12",
    "org_name": "PRINCETON UNIVERSITY",
    "project_title": "Views of Gender in Adolescence",
    "cancellation_source": "HHS reported",
    "lat": 40.345441,
    "lon": -74.655866
}, {
    "FIPS": 34021,
    "reporter_url": "https://reporter.nih.gov/project-details/11031960",
    "award_remaining": 79235.0,
    "termination_date": "2025-03-12",
    "org_name": "PRINCETON UNIVERSITY",
    "project_title": "The psychological underpinnings of gender disparities in adolescent mental health",
    "cancellation_source": "HHS reported",
    "lat": 40.345441,
    "lon": -74.655866
}, {
    "FIPS": 34023,
    "reporter_url": "https://reporter.nih.gov/project-details/10693823",
    "award_remaining": 577935.26,
    "termination_date": "2025-03-24",
    "org_name": "RUTGERS BIOMEDICAL AND HEALTH SCIENCES",
    "project_title": "Development of dual inhibitors targeting the viral main protease and the host cathepsin L as SARS-CoV-2 antivirals",
    "cancellation_source": "HHS reported",
    "lat": 40.520984,
    "lon": -74.473247
}, {
    "FIPS": 34023,
    "reporter_url": "https://reporter.nih.gov/project-details/10978593",
    "award_remaining": 612661.39,
    "termination_date": "2025-03-11",
    "org_name": "RUTGERS BIOMEDICAL AND HEALTH SCIENCES",
    "project_title": "Social Networks and Cognitive Health among Black and Latino sexual minority men in NJ",
    "cancellation_source": "HHS reported",
    "lat": 40.520984,
    "lon": -74.473247
}, {
    "FIPS": 34023,
    "reporter_url": "https://reporter.nih.gov/project-details/10923996",
    "award_remaining": 177197.7,
    "termination_date": "2025-04-01",
    "org_name": "RUTGERS BIOMEDICAL AND HEALTH SCIENCES",
    "project_title": "Addressing HPV vaccination disparities through tailored messaging for hesitant families",
    "cancellation_source": "HHS reported",
    "lat": 40.520984,
    "lon": -74.473247
}, {
    "FIPS": 34003,
    "reporter_url": "https://reporter.nih.gov/project-details/10864335",
    "award_remaining": 90465.48,
    "termination_date": "2025-04-01",
    "org_name": "HACKENSACK UNIVERSITY MEDICAL CENTER",
    "project_title": "Cancer Misinformation and Use of Complementary and Alternative Therapy (CAM) among Patients with Cancer.",
    "cancellation_source": "HHS reported",
    "lat": 40.883415,
    "lon": -74.055652
}, {
    "FIPS": 34021,
    "reporter_url": "https://reporter.nih.gov/project-details/11066793",
    "award_remaining": 35974.0,
    "termination_date": "2025-04-02",
    "org_name": "PRINCETON UNIVERSITY",
    "project_title": "The Role of the Adaptor Protein Enkurin in Left-Right Patterning- a Promising Link Between Polycystin-2 and Calcium Signaling",
    "cancellation_source": "Self reported",
    "lat": 40.345441,
    "lon": -74.655866
}, {
    "FIPS": 34007,
    "reporter_url": "https://reporter.nih.gov/project-details/10848617",
    "award_remaining": 175866.65,
    "termination_date": "2025-03-27",
    "org_name": "RUTGERS THE STATE UNIV OF NJ CAMDEN",
    "project_title": "U-RISE at Rutgers University - Camden",
    "cancellation_source": "Self reported",
    "lat": 39.947479,
    "lon": -75.123053
}, {
    "FIPS": 34013,
    "reporter_url": "https://reporter.nih.gov/project-details/10829427",
    "award_remaining": 200851.86,
    "termination_date": "2025-04-02",
    "org_name": "RUTGERS THE STATE UNIV OF NJ NEWARK",
    "project_title": "Graduate Research Training Initiative for Student Enhancement (G-RISE) (T32) at Rutgers University-Newark",
    "cancellation_source": "Self reported",
    "lat": 40.740542,
    "lon": -74.172677
}, {
    "FIPS": 35001,
    "reporter_url": "https://reporter.nih.gov/project-details/10927234",
    "award_remaining": 7590498.6200000001,
    "termination_date": "2025-04-08",
    "org_name": "UNIVERSITY OF NEW MEXICO",
    "project_title": "UNM FIRST: Promoting Inclusive Excellence in Neuroscience and Data Science",
    "cancellation_source": "HHS reported",
    "lat": 35.090226,
    "lon": -106.625292
}, {
    "FIPS": 35001,
    "reporter_url": "https://reporter.nih.gov/project-details/10942030",
    "award_remaining": 11119100.1699999999,
    "termination_date": "2025-04-02",
    "org_name": "UNIVERSITY OF NEW MEXICO HEALTH SCIS CTR",
    "project_title": "Academic Science Education and Research Training",
    "cancellation_source": "Self reported",
    "lat": 35.090968,
    "lon": -106.617544
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10857315",
    "award_remaining": 1066353.52,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Trial of Human Milk Oligosaccharide-based synbiotics for HIV-exposed uninfected children",
    "cancellation_source": "Self and HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10908625",
    "award_remaining": 2061467.73,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "NY Community-Hospital-Academic Maternal Health Equity Partnerships (NY-CHAMP)",
    "cancellation_source": "Self and HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36029,
    "reporter_url": "https://reporter.nih.gov/project-details/10899571",
    "award_remaining": 142523.14,
    "termination_date": "2025-03-21",
    "org_name": "STATE UNIVERSITY OF NEW YORK AT BUFFALO",
    "project_title": "Intersectional minority stress, mental health, and HIV treatment and care among MSM living with HIV in Ghana",
    "cancellation_source": "Self and HHS reported",
    "lat": 43.003074,
    "lon": -78.785924
}, {
    "FIPS": 36029,
    "reporter_url": "https://reporter.nih.gov/project-details/10870062",
    "award_remaining": 660838.29,
    "termination_date": "2025-03-21",
    "org_name": "STATE UNIVERSITY OF NEW YORK AT BUFFALO",
    "project_title": "Peer Victimization and Risky Alcohol Use among Sexual Minority Youth: Understanding Mechanisms and Contexts",
    "cancellation_source": "Self and HHS reported",
    "lat": 43.003074,
    "lon": -78.785924
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10932201",
    "award_remaining": 994518.9300000001,
    "termination_date": "2025-03-20",
    "org_name": "ICAHN SCHOOL OF MEDICINE AT MOUNT SINAI",
    "project_title": "Trans/Forming Genomics: Guidance for Research Involving Transgender and Gender Diverse People",
    "cancellation_source": "Self and HHS reported",
    "lat": 40.790284,
    "lon": -73.946781
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10917268",
    "award_remaining": 44115.14,
    "termination_date": "2025-03-21",
    "org_name": "HUNTER COLLEGE",
    "project_title": "Identifying Transdiagnostic Intervention Targets for PTSD-SUD Comorbidity in a Vulnerable Population: A Mixed-Method Study",
    "cancellation_source": "Self and HHS reported",
    "lat": 40.768737,
    "lon": -73.965182
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10987061",
    "award_remaining": 569052.35,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "CADRE Program for Postbaccalaureate Training in the Neurosciences",
    "cancellation_source": "Self and HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11003839",
    "award_remaining": 7587.92,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Dissecting the role of loneliness on substance use- and HIV-related outcomes among sexual minority men in the United States and Canada",
    "cancellation_source": "Self and HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10902995",
    "award_remaining": 33922.33,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIV NEW YORK MORNINGSIDE",
    "project_title": "Biomechanics and mechanobiology of human uterine fibroids",
    "cancellation_source": "Self and HHS reported",
    "lat": 40.81207,
    "lon": -73.954377
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11101043",
    "award_remaining": 374031.18,
    "termination_date": "2025-03-21",
    "org_name": "GRADUATE SCHOOL OF PUBLIC HEALTH AND HEALTH POLICY",
    "project_title": "Optimizing long-acting injectable PrEP strategies for sexual minority men who use methamphetamine",
    "cancellation_source": "Self and HHS reported",
    "lat": 40.81207,
    "lon": -73.954377
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10923510",
    "award_remaining": 411250.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "The Behavioral Cost of Carbon",
    "cancellation_source": "Self and HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10918284",
    "award_remaining": 409843.95,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Public Drinking Water Contaminants and Infant Health: Advancing Environmental Justice",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10906795",
    "award_remaining": 9010.0,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Alzheimer's Disease Genetic Risk and Microglial Innate Immune Memory",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10875397",
    "award_remaining": 50453.0,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Targeting Neuron-Microglia Interactions at the Margin of Glioma",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10888994",
    "award_remaining": 0.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Contribution of PAG to Immune Synapse Organization and PD-1 Function",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10906823",
    "award_remaining": 9704.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Deciphering mechanisms for olfactory receptor choice in single cells",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10902095",
    "award_remaining": 9010.0,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Adipocyte-derived exosomes in macrophage regulation",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10862718",
    "award_remaining": 0.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Elucidating the role of Fra1 in pancreatic Kras-driven acinar to ductal metaplasia",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10914690",
    "award_remaining": 4704.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Quantifying the interactions among maternal race, vaginal metabolites, and microbes in preterm birth",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10904864",
    "award_remaining": 12010.0,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Resting state connectivity signatures of obsessive compulsive symptoms",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10908296",
    "award_remaining": 18154.4,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Examining Individuals' Exposure to Alcohol Environments Using Novel Responsive Buffers",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10909146",
    "award_remaining": 25158.0,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Mechanisms underlying the effects of time-restricted feeding on lipid metabolism",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10928124",
    "award_remaining": 4704.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Inhibition of CD33-sialic acid binding in Late-Onset Alzheimer's Disease",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10915420",
    "award_remaining": 9735.67,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Data-Driven Discovery of Heterogeneous Treatment Effects of Statin Use on Dementia Risk",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10886817",
    "award_remaining": 0.0,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "A Novel Long Noncoding RNA Associated with Systemic Lupus Erythematosus Pathogenesis",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10908411",
    "award_remaining": 25958.0,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Transcriptional regulation of progenitor cell fate in craniofacial ligament regeneration",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10979141",
    "award_remaining": 25958.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "ECM remodeling and crosstalk with cell fate in zebrafish ligament regeneration",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10923843",
    "award_remaining": 14570.87,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Prenatal exposure to phthalates and associations with gestational weight gain and fetal growth trajectories.",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10930696",
    "award_remaining": 3528.0,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "An equity-focused evaluation of a system-wide intervention to reduce mold in NYC public housing and its impact on asthma burden",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10922694",
    "award_remaining": 9084.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Long-term exposure to arsenic, and the co-occurrence of uranium, in public and private drinking water: associations with cardiovascular and chronic kidney diseases in the California Teachers Study",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11099655",
    "award_remaining": 0.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Mechanisms controlling cell type-specific transcription factor activity in the development of serially homologous structures in Drosophila",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11105757",
    "award_remaining": 12936.5,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Does self-reported psychosocial stress in pregnancy mediate the association between maternal race/ethnicity and hypertensive disorders of pregnancy?",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10909057",
    "award_remaining": 13964.79,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Applying a multidimensional measure of human mobility to understand drivers of HIV incidence in Rakai, Uganda",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10867417",
    "award_remaining": 42472.27,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Understanding the individual and combined impact of childhood sexual abuse and minority stress on hazardous drinking among sexual minority women: Is emotion dysregulation a key factor?",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10915447",
    "award_remaining": 88233.35,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Functional interrogation of the mouse somatosensory thalamic interneuron in sensory perception and rhythmic states",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10911104",
    "award_remaining": 220178.36,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Alcohol-Involved Sexual Assault among Bisexual Women: Disentangling Mechanisms of Risk at Individual, Interpersonal, and Structural Levels Across the Lifespan",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10886003",
    "award_remaining": 361534.92,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Harnessing Bioinformatics for HIV Prevention: Understanding Persistence in Comprehensive HIV Prevention Services",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10894841",
    "award_remaining": 155992.88,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Evaluating the Epidemiology and Determinants of Neurologic Post-acute Sequelae of SARS-CoV-2",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10846774",
    "award_remaining": 180973.2,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Neurocognitive & neuropsychiatric impact of chemosensory alterations: Implications of olfactory dysfunction in COVID-19",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10863840",
    "award_remaining": 504275.55,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Mentoring clinical investigators in patient-oriented research on substance use and HIV",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10885042",
    "award_remaining": 5465057.0599999996,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Alzheimer's Disease Research Center",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10880379",
    "award_remaining": 61392592.9200000018,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Cancer Center Support Grant",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10817164",
    "award_remaining": 17326165.7399999984,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "New York Obesity Research Center",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10851719",
    "award_remaining": 23448071.8599999994,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Center for Environmental Health and Justice in Northern Manhattan",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10897775",
    "award_remaining": 8480636.5999999996,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Center to Improve Chronic disease Outcomes through Multi-level and Multi-generational approaches Unifying Novel Interventions and Training for health EquitY (The COMMUNITY Center)",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10832126",
    "award_remaining": 92208.96,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Novel Assessments of the Health Impacts of Tropical Cyclones",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10827921",
    "award_remaining": 1013329.8199999999,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Targeting TB transmission hotspots to find undiagnosed TB in South Africa: a genomic, geospatial and modeling study (TARGET- TB)",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11177101",
    "award_remaining": 662070.98,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Fusion inhibitors that block host-to-host transmission of SARS-CoV-2",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11177103",
    "award_remaining": 631529.72,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Engineering protease-resistant antiviral peptide inhibitors for SARS-CoV-2",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10891394",
    "award_remaining": 975527.24,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "The linkage between Race, Kaiso and the tumor microenvironment in breast cancer health disparities",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10880245",
    "award_remaining": 1023147.29,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Automated Digital Imaging for Cervical Cancer Screening",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10913427",
    "award_remaining": 400154.87,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Impact of Allostatic Load and Neighborhood Contextual Factors on Breast Cancer in the Women's Health Initiative",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10838513",
    "award_remaining": 948976.3199999999,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Cannabis use, PrEP and HIV transmission risk Among Black MSM in Chicago",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10910148",
    "award_remaining": 742935.3100000001,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Just Inclusion and Equity: Negotiating Community-Research Partnerships in Genomics Research (JUSTICE)",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10920401",
    "award_remaining": 1265436.78,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Characterizing Sleep, ART Adherence and Viral Suppression Among Black Sexual Minority Men",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10831829",
    "award_remaining": 323346.18,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Racial Disparity in Diagnostic Evaluation of Uterine Cancer",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10933040",
    "award_remaining": 1664717.1200000001,
    "termination_date": "2025-03-20",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "MyPEEPS Mobile Plus: A Multi-Level HIV Prevention Intervention for Young MSM\u00a0",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10863844",
    "award_remaining": 939077.6800000001,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Temperature, shade, and adolescent psychopathology: understanding how place shapes health",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10819558",
    "award_remaining": 1224468.95,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Ending the HIV Epidemic with Equity: An All-facility Intervention to Reduce Structural Racism and Discrimination and Its Impact on Patient and Healthcare Staff Wellbeing",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10836043",
    "award_remaining": 462.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Summer Biomechanics, Bioengineering, and Biotransport Conference",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10884394",
    "award_remaining": 78193.56,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "International Workshops on HIV Pediatrics",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10762470",
    "award_remaining": 215274.35,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Using wastewater surveillance data to study SARS-CoV-2 dynamics and predict COVID-19 outcomes",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10919831",
    "award_remaining": 193512.08,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Leveraging Latinx Adolescents, Photovoice, and Longitudinal Data to Disentangle the Bidirectional Effects of Social Media and Mental Health",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10919236",
    "award_remaining": 304022.15,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "SEARCH: SMS Electronic Adolescent Reminders for Completion of HPV vaccination- Uganda",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10884348",
    "award_remaining": 367503.58,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Preparing for pre-exposure prophylaxis implementation in Central-Eastern European Countries with low access to biomedical prevention",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10744754",
    "award_remaining": 125066.74,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Development and Testing of MyPEEPS Mobile for Young Transgender Men",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10841618",
    "award_remaining": 1167898.29,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Columbia University Graduate Training Program in Microbiology and Immunology",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10744233",
    "award_remaining": 440081.17,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Training in Translational Immunology Research",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10849865",
    "award_remaining": 339110.12,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Multidisciplinary Training in Molecular and Translational Rheumatology Research",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10880432",
    "award_remaining": 1626038.25,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Molecular Oncology Training Program",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10849844",
    "award_remaining": 4312951.6600000001,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Hormones: Molecular Mechanism of Action and Functions",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10865098",
    "award_remaining": 2844942.5299999998,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Training Grant in Pediatric Endocrinology, Diabetes and Metabolism",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10843247",
    "award_remaining": 4413766.9900000002,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Advanced training in environmental health and data science: molecules to populations",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10909050",
    "award_remaining": 2759438.1899999999,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Vision Sciences Training Grant",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10836376",
    "award_remaining": 5053829.2400000002,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Translational Research Training in Child Psychiatry",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10894080",
    "award_remaining": 5369631.8099999996,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Training in Schizophrenia and Psychotic Disorders: From Animal Models to Patients",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10874650",
    "award_remaining": 5237099.0199999996,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Behavioral Sciences Research in HIV Infection",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10917221",
    "award_remaining": 458788.4,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Neurobiology and Behavior training grant",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10873117",
    "award_remaining": 197400.98,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Social Determinants of HIV",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10864979",
    "award_remaining": 4522821.75,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Reducing Health Disparities Through Informatics",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10878700",
    "award_remaining": 1992048.0800000001,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Advanced Graduate Training Program in Neurobiology & Behavior",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10894261",
    "award_remaining": 5349792.9400000004,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "NRSA Training Core",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10886697",
    "award_remaining": 838617.03,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "India - Factors of CKDu in Uddanam Study (India-FOCUS)",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10898652",
    "award_remaining": 3205449.8599999999,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "A Multi-scale Atlas of Senescence in Diverse Tissue Types",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10897733",
    "award_remaining": 9643287.1300000008,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Investigating the Genetic, Cellular, and Metabolic Events Important for Urothelial Homeostasis and Response to Injury",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11081972",
    "award_remaining": 2605599.1099999999,
    "termination_date": "2025-03-21",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "MyPEEPS Mobile LITE:  Limited Interaction Efficacy Trial of MyPEEPS Mobile to Reduce HIV Incidence and Better Understand the Epidemiology of HIV among YMSM",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10893961",
    "award_remaining": 54667235.5799999982,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Clinical and Translational Science Award",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10833481",
    "award_remaining": 11682.44,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIV NEW YORK MORNINGSIDE",
    "project_title": "Neighborhood Social Environment, Composition and Depression in Latinx",
    "cancellation_source": "HHS reported",
    "lat": 40.81207,
    "lon": -73.954377
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10888185",
    "award_remaining": 14600.7,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIV NEW YORK MORNINGSIDE",
    "project_title": "Regulation and function of mitochondrial motility in neurons in vivo",
    "cancellation_source": "HHS reported",
    "lat": 40.81207,
    "lon": -73.954377
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10919203",
    "award_remaining": 780820.17,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIV NEW YORK MORNINGSIDE",
    "project_title": "Fragile Families Summer Data Training Workshop Series 2021-2025",
    "cancellation_source": "HHS reported",
    "lat": 40.81207,
    "lon": -73.954377
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10872326",
    "award_remaining": 19777096.1999999993,
    "termination_date": "2025-03-21",
    "org_name": "WEILL MEDICAL COLL OF CORNELL UNIV",
    "project_title": "Pediatric Scientist Development Program",
    "cancellation_source": "HHS reported",
    "lat": 40.7607,
    "lon": -73.9603
}, {
    "FIPS": 36055,
    "reporter_url": "https://reporter.nih.gov/project-details/10932383",
    "award_remaining": 460545.07,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF ROCHESTER",
    "project_title": "Status-neutral community-based multilevel intervention to address intersectional stigma and discrimination, and increase HIV testing, PrEP, and ART uptake among YGBMSM in Ghanaian Slums",
    "cancellation_source": "HHS reported",
    "lat": 43.131774,
    "lon": -77.63546
}, {
    "FIPS": 36055,
    "reporter_url": "https://reporter.nih.gov/project-details/10885157",
    "award_remaining": 62901.12,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF ROCHESTER",
    "project_title": "Adaptation and feasibility of Many Men Many Voices (3MV), an HIV prevention intervention to reduce intersectional stigma and increase HIVST among YSMM residing in Ghanaian slums",
    "cancellation_source": "HHS reported",
    "lat": 43.131774,
    "lon": -77.63546
}, {
    "FIPS": 36055,
    "reporter_url": "https://reporter.nih.gov/project-details/10880589",
    "award_remaining": 251388.99,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF ROCHESTER",
    "project_title": "Adapting the FOCUS Program for Sexual and Gender Minority (SGM) Cancer Patients and Caregivers",
    "cancellation_source": "HHS reported",
    "lat": 43.131774,
    "lon": -77.63546
}, {
    "FIPS": 36119,
    "reporter_url": "https://reporter.nih.gov/project-details/10710196",
    "award_remaining": 114680.93,
    "termination_date": "2025-02-28",
    "org_name": "SILVERBILLS INC.",
    "project_title": "SilverBills: A Legal, Technical and Financial Tool for Aging LGBTQ+ Individuals with Impaired Cognition.",
    "cancellation_source": "HHS reported",
    "lat": 40.946852,
    "lon": -73.772045
}, {
    "FIPS": 36029,
    "reporter_url": "https://reporter.nih.gov/project-details/11141354",
    "award_remaining": 200000.0,
    "termination_date": "2025-03-21",
    "org_name": "ROSWELL PARK CANCER INSTITUTE CORP",
    "project_title": "Two-Spirit Films in Indigenous Cancer Health",
    "cancellation_source": "HHS reported",
    "lat": 42.873378,
    "lon": -78.869243
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11094263",
    "award_remaining": 323783.95,
    "termination_date": "2025-04-01",
    "org_name": "NDRI-USA, INC.",
    "project_title": "Community Developed Technology-Based Messaging to Increase SARS-CoV-2 Vaccine Uptake Among People Who Inject Drugs",
    "cancellation_source": "HHS reported",
    "lat": 40.74287,
    "lon": -73.992333
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10931651",
    "award_remaining": 294434.65,
    "termination_date": "2025-03-21",
    "org_name": "ICAHN SCHOOL OF MEDICINE AT MOUNT SINAI",
    "project_title": "Cue Reactivity Modulation in MSM with Methamphetamine Use Disorder",
    "cancellation_source": "HHS reported",
    "lat": 40.790284,
    "lon": -73.946781
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10869925",
    "award_remaining": 20.0,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Testing competing models of the computational role of dopamine in hallucinations",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10896239",
    "award_remaining": 8622948.3599999994,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Core Facilities for Vision Research",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10887599",
    "award_remaining": 4158952.3700000001,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Graduate Training in Nutrition",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10866352",
    "award_remaining": -80380.3200000001,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Genetic Approaches to Development and Disease",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10924046",
    "award_remaining": 28140144.9499999993,
    "termination_date": "2025-03-25",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Alzheimer's Disease and Alzheimer's Disease Related Dementias in Prediabetes and Type 2 Diabetes: The Diabetes Prevention Program Outcomes Study AD/ADRD Project",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10904727",
    "award_remaining": 17388.49,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIV NEW YORK MORNINGSIDE",
    "project_title": "Auditory cortical tuning to communication sounds and genetic constraints on the vocal learning landscape",
    "cancellation_source": "HHS reported",
    "lat": 40.81207,
    "lon": -73.954377
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10914666",
    "award_remaining": 29900.54,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIV NEW YORK MORNINGSIDE",
    "project_title": "Understanding and Controlling the Cellular Forces that Coordinate Epithelial Tissue Morphogenesis",
    "cancellation_source": "HHS reported",
    "lat": 40.81207,
    "lon": -73.954377
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10809777",
    "award_remaining": 27900.59,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIV NEW YORK MORNINGSIDE",
    "project_title": "Fast and Flexible Conjunction Coding in Biological and Artificial Vision",
    "cancellation_source": "HHS reported",
    "lat": 40.81207,
    "lon": -73.954377
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11003276",
    "award_remaining": 48974.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Type I Interferon Mediated Restoration of Brain Endothelial Cell Function after Cerebral Infarction",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11009933",
    "award_remaining": 71235.66,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Diversity in Practice: the Quest for Inclusion in Precision Medicine",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10669228",
    "award_remaining": 418475.77,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Youth-PRIDES: Implementing integrated, mHealth care for adolescent depressionwithin primary care clinics of Mozambique",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11009064",
    "award_remaining": 259222.92,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Subtyping sepsis in Uganda using clinical, pathogen, and host response profiling",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10991705",
    "award_remaining": 40170350.2400000021,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "A Tolerance Approach to Xenotransplantation",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10662290",
    "award_remaining": 1376111.6100000001,
    "termination_date": "2025-03-21",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Stress, hazardous drinking and intimate partner aggression in a diverse sample of women and their partners",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10686266",
    "award_remaining": 2712361.04,
    "termination_date": "2025-03-20",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Examining Social Ecological and Network Factors to Assess Epidemiological Risk in a Large National Cohort of Cisgender Women",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10217065",
    "award_remaining": 4425407.0800000001,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "A Multi-site Multi-Setting RCT of Integrated HIV Prevention and HCV Care for PWID",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10772814",
    "award_remaining": 100000.0,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Skeletal Health in Youth with Type 1 Diabetes and Gender Diversity",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10850865",
    "award_remaining": 6418653.71,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Obesogenic origins of maternal and child metabolic health involving dolutegravir (ORCHID)",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10653189",
    "award_remaining": 1426986.3999999999,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Disability, diversity and trust in precision medicine research: stakeholdersengagement",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10397977",
    "award_remaining": 2034106.5800000001,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Impact of Social Cohesion and Social Capital in PrEP Uptake and Adherence Among Transwomen of Color",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11004310",
    "award_remaining": 1430333.28,
    "termination_date": "2025-03-21",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Social Connectedness and Health among Gender Minority People of Color",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10982514",
    "award_remaining": 864863.4399999999,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Assessing Cervical Cancer Healthcare Inequities in Diverse Populations: The ACHIEVE Study",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10632778",
    "award_remaining": 2373903.6499999999,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Building mobile HIV prevention and mental health support in low-resource settings",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10615902",
    "award_remaining": 1223855.8600000001,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "A randomized trial of ImpACT+, a coping intervention to improve clinical and mental health outcomes among HIV-infected women with sexual trauma in South Africa",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11073000",
    "award_remaining": 1148993.4299999999,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "COVID-19 Mother Baby Outcomes (COMBO): brain-behavior functioning",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10651894",
    "award_remaining": 25512.31,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Multimodal immune profiling to determine mechanisms of COVID-19 clinical trajectory in Uganda",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10693537",
    "award_remaining": 62459.66,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "mHealth and Mobile Ultrasound for Mothers ",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10658980",
    "award_remaining": 1013773.16,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "BEST-DP: Biostatistics & Epidemiology Summer Training Diversity Program",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10661019",
    "award_remaining": 2256093.2400000002,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Training in Pediatric Infectious Diseases",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10591549",
    "award_remaining": 3053910.46,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Research Training in Late-Life NeuroPsychiatric Disorders",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11085137",
    "award_remaining": 1109640.1799999999,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "2/3 Genomics of Schizophrenia in the South African Xhosa",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11012850",
    "award_remaining": 1705883.47,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "The SDOH-Homecare Intervention Focus Team (SHIFT) Trial to Mitigate SDOH in Stroke Outcomes and Build Community Capacity",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10891553",
    "award_remaining": 70577078.4899999946,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Center for High-Throughput Minimally-Invasive Radiation Biodosimetry",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10699986",
    "award_remaining": 13978814.4900000002,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "The North American Mitochondrial Disease Consortium (NAMDC)",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10975364",
    "award_remaining": 2935267.1699999999,
    "termination_date": "2025-03-21",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "ICAP Clinical Trials Unit",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11002649",
    "award_remaining": 30072.6,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIV NEW YORK MORNINGSIDE",
    "project_title": "Linking endoplasmic reticulum calcium handling to neuronal function in vivo in the Drosophila visual system",
    "cancellation_source": "HHS reported",
    "lat": 40.81207,
    "lon": -73.954377
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10425383",
    "award_remaining": 2142459.3900000001,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIV NEW YORK MORNINGSIDE",
    "project_title": "Preventing Drug Abuse among Sexual-Minority Youth",
    "cancellation_source": "HHS reported",
    "lat": 40.81207,
    "lon": -73.954377
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10592335",
    "award_remaining": 7749.16,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIV NEW YORK MORNINGSIDE",
    "project_title": "Investigating associations and mediating effects between climate and mental health and violence in informal settlements in Kenya",
    "cancellation_source": "HHS reported",
    "lat": 40.81207,
    "lon": -73.954377
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10442449",
    "award_remaining": 2182476.27,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIV NEW YORK MORNINGSIDE",
    "project_title": "HIV Intervention Science Training Program for Underrepresented Investigators",
    "cancellation_source": "HHS reported",
    "lat": 40.81207,
    "lon": -73.954377
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10898330",
    "award_remaining": 14149.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY TEACHERS COLLEGE",
    "project_title": "Associations among maternal stress, infant epigenetics, and behavioral and cognitive development across the first few years of life",
    "cancellation_source": "HHS reported",
    "lat": 40.8101,
    "lon": -73.9606
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10997953",
    "award_remaining": 4704.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "The impact of Alzheimer's disease on novel genetic signatures of hippocampal memory traces",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10824991",
    "award_remaining": 2352.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Investigating the potential of wastewater surveillance data to improve SARS-CoV-2 dynamical modeling and forecasting",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10826774",
    "award_remaining": 4704.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Mechanistic insights into lipid A modification by the phosphoethanolamine transferase MCR-1",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10903057",
    "award_remaining": 3.57,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Acetylation as a novel post-translational modification of MafA",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10903156",
    "award_remaining": 100.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Brain-wide neural mechanisms enhancing maternal behavioral response to infant cues",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10900078",
    "award_remaining": 2425.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Personal Healthcare Networks of Transgender and Gender-Diverse Adults After Gender-Affirming Surgery",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10995462",
    "award_remaining": 14806.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "The Role of Social Determinants in Reproductive Coercion: Understanding Health Information and Support Needs",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10984277",
    "award_remaining": 63864.26,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Spatiotemporal effects and associations between deforestation and alcohol and tobacco use in Indonesia",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10981243",
    "award_remaining": 1250670.3700000001,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Climate and Health: Action and Research for Transformational Change (CHART)",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10856102",
    "award_remaining": 531581.65,
    "termination_date": "2025-03-10",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Text4Vax: Understanding the Effectiveness and Implementation of Text Message Reminders for Pediatric COVID-19 and Influenza Vaccines",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10801508",
    "award_remaining": 305955.94,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "SPECTRUM (Studying PRIDE to Enhance Cancer screening guidelines for TRansgender Users of gender-affirMing hormones)",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10869406",
    "award_remaining": 359994.91,
    "termination_date": "2025-03-20",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Reframing personal and community report back of consumer products by centering intersectionality",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10801457",
    "award_remaining": 964084.09,
    "termination_date": "2025-03-21",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "A daily diary examination of the influence of intersectional stigma on blood pressure",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11008251",
    "award_remaining": 262936.43,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Strengthening informed consent for authentic participation in perinatal HIV research",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11035852",
    "award_remaining": 123012.9,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Doxy4STICare - Doxycycline for Sexually Transmitted Infections; A Comprehensive Assessment of Antimicrobial Resistance and Engagement",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10740301",
    "award_remaining": 397796.41,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Structural Racism, Neurocognition in Reward Related Decision Making and Substance Use Risk",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10982425",
    "award_remaining": 1061973.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIV NEW YORK MORNINGSIDE",
    "project_title": "Anga Center for Climate Justice, Health Equity, and Community Wellbeing",
    "cancellation_source": "HHS reported",
    "lat": 40.81207,
    "lon": -73.954377
}, {
    "FIPS": 36001,
    "reporter_url": "https://reporter.nih.gov/project-details/10688352",
    "award_remaining": 612495.59,
    "termination_date": "2025-03-24",
    "org_name": "WADSWORTH CENTER",
    "project_title": "High-Throughput Dried Blood Spot (HT-DBS) Technologies in SARS COV-2 Serology and Vaccinology",
    "cancellation_source": "HHS reported",
    "lat": 42.645888,
    "lon": -73.797658
}, {
    "FIPS": 36055,
    "reporter_url": "https://reporter.nih.gov/project-details/10399400",
    "award_remaining": 53996.0,
    "termination_date": "2025-03-10",
    "org_name": "UNIVERSITY OF ROCHESTER",
    "project_title": "One Health Education: Connecting Humans, Animals, and the Environment",
    "cancellation_source": "HHS reported",
    "lat": 43.131774,
    "lon": -77.63546
}, {
    "FIPS": 36103,
    "reporter_url": "https://reporter.nih.gov/project-details/10647728",
    "award_remaining": 2834866.48,
    "termination_date": "2025-03-21",
    "org_name": "STATE UNIVERSITY NEW YORK STONY BROOK",
    "project_title": "BioPREP: Biology Partnership in Research and Education Program",
    "cancellation_source": "HHS reported",
    "lat": 40.914561,
    "lon": -73.125169
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10662390",
    "award_remaining": 1792086.5800000001,
    "termination_date": "2025-03-21",
    "org_name": "NEW YORK STATE PSYCHIATRIC INSTITUTE DBA RESEARCH FOUNDATION FOR MENTAL HYGIENE, INC",
    "project_title": "Social Convoys, Cognitive Reserve and Resilience, and Risk for Alzheimer's Disease and Related Dementias",
    "cancellation_source": "HHS reported",
    "lat": 40.843076,
    "lon": -73.944206
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10767072",
    "award_remaining": 651232.89,
    "termination_date": "2025-03-21",
    "org_name": "NEW YORK STATE PSYCHIATRIC INSTITUTE DBA RESEARCH FOUNDATION FOR MENTAL HYGIENE, INC",
    "project_title": "A multi-level approach to improve HIV prevention and care for transgender women of color",
    "cancellation_source": "HHS reported",
    "lat": 40.843076,
    "lon": -73.944206
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10463829",
    "award_remaining": 197806.75,
    "termination_date": "2025-03-21",
    "org_name": "NEW YORK STATE PSYCHIATRIC INSTITUTE DBA RESEARCH FOUNDATION FOR MENTAL HYGIENE, INC",
    "project_title": "Social environmental drivers of stimulant use and its impact on HIV prevention and treatment in Black men who have sex with men",
    "cancellation_source": "HHS reported",
    "lat": 40.843076,
    "lon": -73.944206
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10645082",
    "award_remaining": 152591.46,
    "termination_date": "2025-03-21",
    "org_name": "NEW YORK STATE PSYCHIATRIC INSTITUTE DBA RESEARCH FOUNDATION FOR MENTAL HYGIENE, INC",
    "project_title": "In-depth Understanding of HIV Risk Behavior among Men Who Have Sex With Men in Sub-Saharan Africa: Secondary Analysis of HPTN 075 Data",
    "cancellation_source": "HHS reported",
    "lat": 40.843076,
    "lon": -73.944206
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10701731",
    "award_remaining": 141361.78,
    "termination_date": "2025-02-28",
    "org_name": "HUNTER COLLEGE",
    "project_title": "Trajectories of Adaptation to Traumatic Stress in a Vulnerable Population",
    "cancellation_source": "HHS reported",
    "lat": 40.768737,
    "lon": -73.965182
}, {
    "FIPS": 36005,
    "reporter_url": "https://reporter.nih.gov/project-details/11231762",
    "award_remaining": 57967.0,
    "termination_date": "2025-03-21",
    "org_name": "ALBERT EINSTEIN COLLEGE OF MEDICINE",
    "project_title": "ED2PrEP - patient focused, low-burden strategies for PrEP uptake among emergency departments patients: a cross-over hybrid implementation-effectiveness trial",
    "cancellation_source": "HHS reported",
    "lat": 40.85103,
    "lon": -73.844379
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11042742",
    "award_remaining": 70125.34,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Therapeutic Editing of Rod Glycolysis Rescues Retinal Degeneration",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10620288",
    "award_remaining": 3592137.9700000002,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Neuroepidemiology Training Program",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10615158",
    "award_remaining": 2016533.54,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Advanced Graduate Training Program in Theoretical Neuroscience",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10928756",
    "award_remaining": 29633.78,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIV NEW YORK MORNINGSIDE",
    "project_title": "Interactions between motor learning and episodic memory",
    "cancellation_source": "HHS reported",
    "lat": 40.81207,
    "lon": -73.954377
}, {
    "FIPS": 36029,
    "reporter_url": "https://reporter.nih.gov/project-details/10899829",
    "award_remaining": 651743.3199999999,
    "termination_date": "2025-03-12",
    "org_name": "STATE UNIVERSITY OF NEW YORK AT BUFFALO",
    "project_title": "Igniting Hope in Buffalo New York Communities: Training the Next Generation of Health Equity Researchers",
    "cancellation_source": "HHS reported",
    "lat": 43.003074,
    "lon": -78.785924
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10879368",
    "award_remaining": 324336.74,
    "termination_date": "2025-03-21",
    "org_name": "NEW YORK UNIVERSITY",
    "project_title": "Geographically-Explicit Ecological Momentary Assessment Protocol to Assess the Linkages Between Intersectional Discrimination and CVD Risk Among Sexual and Gender Minorities",
    "cancellation_source": "HHS reported",
    "lat": 40.729659,
    "lon": -73.997018
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10944038",
    "award_remaining": 541914.3100000001,
    "termination_date": "2025-04-01",
    "org_name": "NEW YORK UNIVERSITY",
    "project_title": "Community - based behavioral intervention to increase COVID - 19 and influenza vaccination for African American/ Black and Latino persons: An optimization randomized controlled trial",
    "cancellation_source": "HHS reported",
    "lat": 40.729659,
    "lon": -73.997018
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11009234",
    "award_remaining": 286650.18,
    "termination_date": "2025-03-21",
    "org_name": "NEW YORK BLOOD CENTER",
    "project_title": "Impact of geographic mobility on PrEP and HIV care outcomes among Latino gay, bisexual and other men who have sex with men",
    "cancellation_source": "HHS reported",
    "lat": 40.76519,
    "lon": -73.959922
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10987836",
    "award_remaining": 41180.64,
    "termination_date": "2025-03-12",
    "org_name": "NEW SCHOOL UNIVERSITY",
    "project_title": "Exploring Historical Trauma, Racial Discrimination, PTSD, and Substance Use Among Black Young Adults",
    "cancellation_source": "HHS reported",
    "lat": 40.735382,
    "lon": -73.997241
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10899938",
    "award_remaining": 744184.0,
    "termination_date": "2025-03-20",
    "org_name": "ICAHN SCHOOL OF MEDICINE AT MOUNT SINAI",
    "project_title": "The Institute for Health Equity Research Catalyst Center",
    "cancellation_source": "HHS reported",
    "lat": 40.790284,
    "lon": -73.946781
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10949311",
    "award_remaining": 108302.3,
    "termination_date": "2025-03-18",
    "org_name": "HUNTER COLLEGE",
    "project_title": "ALIVE: Development and feasibility of a psychosocial intervention for sexual and gender minority autistic adults",
    "cancellation_source": "HHS reported",
    "lat": 40.768737,
    "lon": -73.965182
}, {
    "FIPS": 36005,
    "reporter_url": "https://reporter.nih.gov/project-details/11070751",
    "award_remaining": 48974.0,
    "termination_date": "2025-03-18",
    "org_name": "FORDHAM UNIVERSITY",
    "project_title": "Determining the role of discrimination in clinical presentation and treatment response among sexual minority people with OCD: A machine learning approach",
    "cancellation_source": "HHS reported",
    "lat": 40.86209,
    "lon": -73.88639
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10129786",
    "award_remaining": 0.0,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Creation of an Institutional Biobanking Facility",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11071091",
    "award_remaining": 42044.28,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Immature neutrophil migration promotes inflammation during obesity",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11055056",
    "award_remaining": 142267.34,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Establishing a unified evaluation and implementation framework to inform heat-health warning systems",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10727706",
    "award_remaining": 64225.12,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Drinking water contaminants and fetal loss in Northern California",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10700242",
    "award_remaining": 285216.82,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "The TAIL-PrEP Study: Acceptability and Feasibility of a Tailored Adherence Intervention for safe discontinuation of Long-acting PrEP",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11058265",
    "award_remaining": 132347.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Bronx Environmental Health Summer Training for Justice",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36055,
    "reporter_url": "https://reporter.nih.gov/project-details/10741034",
    "award_remaining": 103822.91,
    "termination_date": "2025-02-28",
    "org_name": "UNIVERSITY OF ROCHESTER",
    "project_title": "TRANSforma Tu Salud Dejando de Fumar: Advancing smoking cessation among transgender individuals",
    "cancellation_source": "HHS reported",
    "lat": 43.131774,
    "lon": -77.63546
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10898516",
    "award_remaining": 30000.0,
    "termination_date": "2025-03-20",
    "org_name": "NEW YORK STATE PSYCHIATRIC INSTITUTE DBA RESEARCH FOUNDATION FOR MENTAL HYGIENE, INC",
    "project_title": "Enhancing Diversity, Equity, and Inclusion in Mental Health Research: American Psychopathological Association Annual Meetings",
    "cancellation_source": "HHS reported",
    "lat": 40.843076,
    "lon": -73.944206
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11053893",
    "award_remaining": 267121.0,
    "termination_date": "2025-03-10",
    "org_name": "NEW YORK BLOOD CENTER",
    "project_title": "Understanding transgender women's immune and behavioral responses to seasonal COVID-19 vaccines to improve their uptake",
    "cancellation_source": "HHS reported",
    "lat": 40.76519,
    "lon": -73.959922
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10613750",
    "award_remaining": 1059126.6899999999,
    "termination_date": "2025-03-10",
    "org_name": "GRADUATE SCHOOL OF PUBLIC HEALTH AND HEALTH POLICY",
    "project_title": "Brief digital intervention to increase COVID-19 vaccination among individuals with anxiety or depression",
    "cancellation_source": "HHS reported",
    "lat": 40.81207,
    "lon": -73.954377
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10877167",
    "award_remaining": 2330193.2200000002,
    "termination_date": "2025-03-12",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Randomized Comparison of the Clinical Outcome of Single Versus Multiple Arterial Grafts: Cognition (ROMA:Cog)",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10927327",
    "award_remaining": 8576876.6999999993,
    "termination_date": "2025-04-08",
    "org_name": "ICAHN SCHOOL OF MEDICINE AT MOUNT SINAI",
    "project_title": "NIH FIRST Cohort Cluster Hiring Initiative at Icahn School of Medicine at Mount Sinai",
    "cancellation_source": "HHS reported",
    "lat": 40.790284,
    "lon": -73.946781
}, {
    "FIPS": 36109,
    "reporter_url": "https://reporter.nih.gov/project-details/10910926",
    "award_remaining": 9587201.6400000006,
    "termination_date": "2025-04-08",
    "org_name": "CORNELL UNIVERSITY",
    "project_title": "Cornell FIRST",
    "cancellation_source": "HHS reported",
    "lat": 42.438,
    "lon": -76.4625
}, {
    "FIPS": 36005,
    "reporter_url": "https://reporter.nih.gov/project-details/10777652",
    "award_remaining": null,
    "termination_date": "2025-04-07",
    "org_name": "BRONXWORKS, INC.",
    "project_title": "Healthy and Livable Bronx Partnership",
    "cancellation_source": "HHS reported",
    "lat": 40.851,
    "lon": -73.9081
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10688370",
    "award_remaining": 1766060.7,
    "termination_date": "2025-03-24",
    "org_name": "ICAHN SCHOOL OF MEDICINE AT MOUNT SINAI",
    "project_title": "Vulnerability of SARS- CoV-2 Infection in Lung Cancer Based on Serological Antibody Analyses",
    "cancellation_source": "HHS reported",
    "lat": 40.790284,
    "lon": -73.946781
}, {
    "FIPS": 36047,
    "reporter_url": "https://reporter.nih.gov/project-details/10977780",
    "award_remaining": 589688.7,
    "termination_date": "2025-04-07",
    "org_name": "NEW YORK UNIVERSITY SCHOOL OF MEDICINE",
    "project_title": "The SHHare Community Project: The Shared Hub for Health Action Research and Equity in Community-led Interventions",
    "cancellation_source": "HHS reported",
    "lat": 40.669895,
    "lon": -73.974354
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10900711",
    "award_remaining": 500605.62,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Guyana Research in Injury and Trauma Training (GRITT) Program",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10824958",
    "award_remaining": 0.0,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Host Factors Required by Human Parainfluenza Virus 3: Determinants of entry and viral spread",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10924017",
    "award_remaining": 202618.89,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Molecular Biomarkers in pathogenesis of Lymphangioleiomyomatosis (LAM)",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10863934",
    "award_remaining": 71242.49,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Training in Cardiovascular Sciences for Under Represented Students",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11011475",
    "award_remaining": 411576.35,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Summer Institute for Training in Biostatistics and Data Science at Columbia (SIBDS@Columbia)",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10890104",
    "award_remaining": 8341708.5,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Postdoctoral Training in Cardiovascular Disease",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10899556",
    "award_remaining": 3169086.5299999998,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "The Columbia University Training Program in Lung Science",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10833526",
    "award_remaining": 2045044.5800000001,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Short Term Training Grant",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10891645",
    "award_remaining": 315108.52,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Advancing Public Health Research in Eastern Africa through Data Science Training  (APHREA-DST)",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10877789",
    "award_remaining": 1188621.01,
    "termination_date": "2025-03-14",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Alpha-1 Antitrypsin Disease Cohort: Longitudinal Biomarker  Study of Disease",
    "cancellation_source": "HHS reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10975613",
    "award_remaining": null,
    "termination_date": "2025-03-22",
    "org_name": "NEW YORK UNIVERSITY",
    "project_title": "Building a Diverse Network to Support and Build Pathways for Historically Underrepresented Students in Quantitative-Focused Research Areas Within the All of Us Research Program",
    "cancellation_source": "HHS reported",
    "lat": 40.729659,
    "lon": -73.997018
}, {
    "FIPS": 36081,
    "reporter_url": "https://reporter.nih.gov/project-details/10823242",
    "award_remaining": 151656.7,
    "termination_date": "2025-03-27",
    "org_name": "QUEENS COLLEGE",
    "project_title": "U-RISE at Queens College, CUNY",
    "cancellation_source": "Self reported",
    "lat": 40.735855,
    "lon": -73.815751
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10819581",
    "award_remaining": 154907.07,
    "termination_date": "2025-03-27",
    "org_name": "CITY COLLEGE OF NEW YORK",
    "project_title": "U-RISE at City College of New York",
    "cancellation_source": "Self reported",
    "lat": 40.819407,
    "lon": -73.950169
}, {
    "FIPS": 36047,
    "reporter_url": "https://reporter.nih.gov/project-details/10818578",
    "award_remaining": 115715.39,
    "termination_date": "2025-03-27",
    "org_name": "BROOKLYN COLLEGE",
    "project_title": "U-RISE at Brooklyn College",
    "cancellation_source": "Self reported",
    "lat": 40.631637,
    "lon": -73.952868
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10895753",
    "award_remaining": 2272117.0800000001,
    "termination_date": "2025-03-20",
    "org_name": "COLUMBIA UNIV NEW YORK MORNINGSIDE",
    "project_title": "Columbia Population Research Center",
    "cancellation_source": "Self reported",
    "lat": 40.81207,
    "lon": -73.954377
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11097370",
    "award_remaining": 234733.79,
    "termination_date": "2025-03-20",
    "org_name": "ICAHN SCHOOL OF MEDICINE AT MOUNT SINAI",
    "project_title": "Structural Racism as a \"Third hit\" on kidney outcomes of Black individuals with APOL1 risk alleles",
    "cancellation_source": "Self reported",
    "lat": 40.790284,
    "lon": -73.946781
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10902945",
    "award_remaining": 0.0,
    "termination_date": null,
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Investigating the Impacts of Pharmacological Slow Wave Sleep Enhancement on Cognition and Memory Traces in an Alzheimers Disease Model",
    "cancellation_source": "Self reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10902956",
    "award_remaining": 0.0,
    "termination_date": null,
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Impact of social environment on cognitive development and thalamocortical maturation",
    "cancellation_source": "Self reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11018608",
    "award_remaining": 3862987.0099999998,
    "termination_date": "2025-03-10",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Communicating Narrative Concerns Entered by RNs (CONCERN)",
    "cancellation_source": "Self reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10933006",
    "award_remaining": 853970.6800000001,
    "termination_date": null,
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Integrated Supportive Care Policies to Improve Maternal Health Equity: Evaluating the Multi-level Effects and Implementation of Doula Programs for Medicaid-Eligible Birthing People in New York City",
    "cancellation_source": "Self reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11004622",
    "award_remaining": 918973.87,
    "termination_date": null,
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Summer Program for Undergraduate Rising Stars (SPURS), a Columbia University biomedical sciences pipeline program",
    "cancellation_source": "Self reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10814938",
    "award_remaining": 1268611.8500000001,
    "termination_date": null,
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Columbia Integrated Training Program in Infectious Diseases Research",
    "cancellation_source": "Self reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/9743799",
    "award_remaining": 1103767.9299999999,
    "termination_date": null,
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Training Program in Environmental Life Course Epidemiology",
    "cancellation_source": "Self reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10200818",
    "award_remaining": 15823696.3599999994,
    "termination_date": null,
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "Medical Scientist Training Program",
    "cancellation_source": "Self reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10931463",
    "award_remaining": 1155179.27,
    "termination_date": "2025-03-10",
    "org_name": "COLUMBIA UNIVERSITY HEALTH SCIENCES",
    "project_title": "The Empilisweni Center for Women's Health - Advancing Implementation of Equitable Cervical Cancer Control",
    "cancellation_source": "Self reported",
    "lat": 40.8415,
    "lon": -73.9414
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/11058915",
    "award_remaining": 351854.3,
    "termination_date": null,
    "org_name": "COLUMBIA UNIV NEW YORK MORNINGSIDE",
    "project_title": "Brain Research Apprenticeships in New York at Columbia (BRAINYAC)",
    "cancellation_source": "Self reported",
    "lat": 40.81207,
    "lon": -73.954377
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/10804662",
    "award_remaining": 77864.52,
    "termination_date": null,
    "org_name": "COLUMBIA UNIV NEW YORK MORNINGSIDE",
    "project_title": "Integrated Musculoskeletal Training Program",
    "cancellation_source": "Self reported",
    "lat": 40.81207,
    "lon": -73.954377
}, {
    "FIPS": 36061,
    "reporter_url": "https://reporter.nih.gov/project-details/3530439",
    "award_remaining": null,
    "termination_date": null,
    "org_name": "COLUMBIA UNIV NEW YORK MORNINGSIDE",
    "project_title": "RESEARCH TRAINING PROGRAM IN PSYCHIATRIC EPIDEMIOLOGY",
    "cancellation_source": "Self reported",
    "lat": 40.81207,
    "lon": -73.954377
}, {
    "FIPS": 37135,
    "reporter_url": "https://reporter.nih.gov/project-details/10828306",
    "award_remaining": 13470.24,
    "termination_date": "2025-03-21",
    "org_name": "UNIV OF NORTH CAROLINA CHAPEL HILL",
    "project_title": "Applying Computational Phenotypes To Assess Mental Health Disorders Among Transgender Patients in the United States",
    "cancellation_source": "Self and HHS reported",
    "lat": 35.9316,
    "lon": -79.057377
}, {
    "FIPS": 37135,
    "reporter_url": "https://reporter.nih.gov/project-details/11100968",
    "award_remaining": 1431968.5800000001,
    "termination_date": "2025-03-21",
    "org_name": "UNIV OF NORTH CAROLINA CHAPEL HILL",
    "project_title": "Looking Back to Look Forward: Social Environment Across the Life Course, Epigenetics, and Birth Outcomes in Black Families",
    "cancellation_source": "Self and HHS reported",
    "lat": 35.9316,
    "lon": -79.057377
}, {
    "FIPS": 37135,
    "reporter_url": "https://reporter.nih.gov/project-details/10875513",
    "award_remaining": 225675.39,
    "termination_date": "2025-03-21",
    "org_name": "UNIV OF NORTH CAROLINA CHAPEL HILL",
    "project_title": "Piloting a multi-level intervention to promote viral suppression among transgender women living with HIV",
    "cancellation_source": "Self and HHS reported",
    "lat": 35.9316,
    "lon": -79.057377
}, {
    "FIPS": 37135,
    "reporter_url": "https://reporter.nih.gov/project-details/10934520",
    "award_remaining": 3770148.9500000002,
    "termination_date": "2025-03-21",
    "org_name": "UNIV OF NORTH CAROLINA CHAPEL HILL",
    "project_title": "Advancing Tobacco Regulatory Science to Reduce Health Disparities",
    "cancellation_source": "Self and HHS reported",
    "lat": 35.9316,
    "lon": -79.057377
}, {
    "FIPS": 37135,
    "reporter_url": "https://reporter.nih.gov/project-details/10783778",
    "award_remaining": 290429.68,
    "termination_date": "2025-03-20",
    "org_name": "UNIV OF NORTH CAROLINA CHAPEL HILL",
    "project_title": "Charting Trajectories of Sexual Identity Development and Mental Health Disparities Among Sexual Minority Youth",
    "cancellation_source": "Self and HHS reported",
    "lat": 35.9316,
    "lon": -79.057377
}, {
    "FIPS": 37119,
    "reporter_url": "https://reporter.nih.gov/project-details/10793324",
    "award_remaining": 380701.13,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF NORTH CAROLINA CHARLOTTE",
    "project_title": "Reconstruction of an SGM-specific sexual violence peer support program (SSS+)",
    "cancellation_source": "Self and HHS reported",
    "lat": 35.301652,
    "lon": -80.731452
}, {
    "FIPS": 37067,
    "reporter_url": "https://reporter.nih.gov/project-details/10908996",
    "award_remaining": 1413841.5600000001,
    "termination_date": "2025-04-01",
    "org_name": "WAKE FOREST UNIVERSITY HEALTH SCIENCES",
    "project_title": "Advancing communication strategies to support future HIV vaccine use among African Americans in the South.",
    "cancellation_source": "HHS reported",
    "lat": 36.059402,
    "lon": -80.321981
}, {
    "FIPS": 37067,
    "reporter_url": "https://reporter.nih.gov/project-details/10844443",
    "award_remaining": 703725.8199999999,
    "termination_date": "2025-03-21",
    "org_name": "WAKE FOREST UNIVERSITY HEALTH SCIENCES",
    "project_title": "Harnessing the power of peer navigation and mHealth to reduce health disparities in Appalachia",
    "cancellation_source": "HHS reported",
    "lat": 36.059402,
    "lon": -80.321981
}, {
    "FIPS": 37119,
    "reporter_url": "https://reporter.nih.gov/project-details/10881886",
    "award_remaining": 409454.57,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF NORTH CAROLINA CHARLOTTE",
    "project_title": "CA-LINC: A Culturally Adapted Care Coordination Suicide Detection and Intervention Model for Black Youth",
    "cancellation_source": "HHS reported",
    "lat": 35.301652,
    "lon": -80.731452
}, {
    "FIPS": 37135,
    "reporter_url": "https://reporter.nih.gov/project-details/10854799",
    "award_remaining": 753813.26,
    "termination_date": "2025-04-01",
    "org_name": "UNIV OF NORTH CAROLINA CHAPEL HILL",
    "project_title": "Addressing COVID 19 Vaccine Hesitancy in Rural Community Pharmacies Reducing Disparities Through an Implementation Science Approach",
    "cancellation_source": "HHS reported",
    "lat": 35.9316,
    "lon": -79.057377
}, {
    "FIPS": 37063,
    "reporter_url": "https://reporter.nih.gov/project-details/11001043",
    "award_remaining": 16303.24,
    "termination_date": "2025-03-12",
    "org_name": "DUKE UNIVERSITY",
    "project_title": "Intersectional Discrimination and Sexual Health Among Young Black Men who Have Sex with Men: A Mixed Methods Study",
    "cancellation_source": "HHS reported",
    "lat": 36.007766,
    "lon": -78.926475
}, {
    "FIPS": 37135,
    "reporter_url": "https://reporter.nih.gov/project-details/10848418",
    "award_remaining": 464912.85,
    "termination_date": "2025-03-24",
    "org_name": "UNIV OF NORTH CAROLINA CHAPEL HILL",
    "project_title": "Genetic Analysis of COVID-19 Susceptibility and Resistance Determinants in the Collaborative Cross",
    "cancellation_source": "HHS reported",
    "lat": 35.9316,
    "lon": -79.057377
}, {
    "FIPS": 37135,
    "reporter_url": "https://reporter.nih.gov/project-details/10688366",
    "award_remaining": 2136844.0299999998,
    "termination_date": "2025-03-24",
    "org_name": "UNIV OF NORTH CAROLINA CHAPEL HILL",
    "project_title": "North Carolina Seronet Center for Excellence",
    "cancellation_source": "HHS reported",
    "lat": 35.9316,
    "lon": -79.057377
}, {
    "FIPS": 37063,
    "reporter_url": "https://reporter.nih.gov/project-details/10327519",
    "award_remaining": 8269819.3700000001,
    "termination_date": "2025-03-24",
    "org_name": "DUKE UNIVERSITY",
    "project_title": "Design and Development of a Pan-betacoronavirus Vaccine",
    "cancellation_source": "HHS reported",
    "lat": 36.007766,
    "lon": -78.926475
}, {
    "FIPS": 37063,
    "reporter_url": "https://reporter.nih.gov/project-details/10439479",
    "award_remaining": 9546581.1899999995,
    "termination_date": "2025-03-24",
    "org_name": "DUKE UNIVERSITY",
    "project_title": "RADx-UP CDCC",
    "cancellation_source": "HHS reported",
    "lat": 36.007766,
    "lon": -78.926475
}, {
    "FIPS": 37063,
    "reporter_url": "https://reporter.nih.gov/project-details/10442110",
    "award_remaining": 77049200.0,
    "termination_date": "2025-03-24",
    "org_name": "DUKE UNIVERSITY",
    "project_title": "ACTIV-6",
    "cancellation_source": "HHS reported",
    "lat": 36.007766,
    "lon": -78.926475
}, {
    "FIPS": 37063,
    "reporter_url": "https://reporter.nih.gov/project-details/10652817",
    "award_remaining": 20600000.0,
    "termination_date": "2025-03-24",
    "org_name": "DUKE UNIVERSITY",
    "project_title": "ACTIV-6",
    "cancellation_source": "HHS reported",
    "lat": 36.007766,
    "lon": -78.926475
}, {
    "FIPS": 37135,
    "reporter_url": "https://reporter.nih.gov/project-details/10993740",
    "award_remaining": 410458.31,
    "termination_date": "2025-03-21",
    "org_name": "UNIV OF NORTH CAROLINA CHAPEL HILL",
    "project_title": "Restoring equity to measuring and preventing perinatal intimate partner violence (Remap-IPV)",
    "cancellation_source": "HHS reported",
    "lat": 35.9316,
    "lon": -79.057377
}, {
    "FIPS": 37063,
    "reporter_url": "https://reporter.nih.gov/project-details/11134498",
    "award_remaining": 134837.3,
    "termination_date": "2025-03-21",
    "org_name": "INNOVATION RESEARCH AND TRAINING, INC.",
    "project_title": "Examining reproductive and sexual health during the transition to adulthood",
    "cancellation_source": "HHS reported",
    "lat": 35.964557,
    "lon": -78.940527
}, {
    "FIPS": 37135,
    "reporter_url": "https://reporter.nih.gov/project-details/11070608",
    "award_remaining": 23279.91,
    "termination_date": "2025-03-18",
    "org_name": "UNIV OF NORTH CAROLINA CHAPEL HILL",
    "project_title": "Social safety as a novel mechanism of risk for problematic substance use among sexual and gender minority youth",
    "cancellation_source": "HHS reported",
    "lat": 35.9316,
    "lon": -79.057377
}, {
    "FIPS": 37135,
    "reporter_url": "https://reporter.nih.gov/project-details/10788460",
    "award_remaining": 1604482.6499999999,
    "termination_date": "2025-03-20",
    "org_name": "UNIV OF NORTH CAROLINA CHAPEL HILL",
    "project_title": "Cardiovascular Health of Sexual and Gender Minorities in the Hispanic Community Health Study/Study of Latinos (SGM HCHS/SOL)",
    "cancellation_source": "Self and HHS reported",
    "lat": 35.9316,
    "lon": -79.057377
}, {
    "FIPS": 37063,
    "reporter_url": "https://reporter.nih.gov/project-details/11058792",
    "award_remaining": 100507.0,
    "termination_date": "2025-03-11",
    "org_name": "RESEARCH TRIANGLE INSTITUTE",
    "project_title": "Social influences on sexual health among Latinx adolescents and emerging adults who identify as LGBTQ+ in an agricultural community",
    "cancellation_source": "Self and HHS reported",
    "lat": 35.9138,
    "lon": -78.848911
}, {
    "FIPS": 37183,
    "reporter_url": "https://reporter.nih.gov/project-details/10776449",
    "award_remaining": null,
    "termination_date": "2025-04-07",
    "org_name": "NC STATE DEPT/HLTH & HUMAN SERVICES",
    "project_title": "Agricultural Workers Digital Equity Initiative",
    "cancellation_source": "HHS reported",
    "lat": 35.670641,
    "lon": -78.663729
}, {
    "FIPS": 37063,
    "reporter_url": "https://reporter.nih.gov/project-details/10991009",
    "award_remaining": 431470744.3000000119,
    "termination_date": "2025-03-21",
    "org_name": "FAMILY HEALTH INTERNATIONAL",
    "project_title": "HIV Prevention Trials Network Leadership and Operations Center",
    "cancellation_source": "HHS reported",
    "lat": 35.992834,
    "lon": -78.903914
}, {
    "FIPS": 37155,
    "reporter_url": "https://reporter.nih.gov/project-details/10849425",
    "award_remaining": 111770.52,
    "termination_date": "2025-03-27",
    "org_name": "UNIVERSITY OF NORTH CAROLINA AT PEMBROKE",
    "project_title": "U-RISE at the UNC Pembroke",
    "cancellation_source": "Self reported",
    "lat": 34.694134,
    "lon": -79.198114
}, {
    "FIPS": 37135,
    "reporter_url": "https://reporter.nih.gov/project-details/10686035",
    "award_remaining": 4763771.1799999997,
    "termination_date": "2025-04-14",
    "org_name": "UNIV OF NORTH CAROLINA CHAPEL HILL",
    "project_title": "Cell entry, cross-species transmission and pathogenesis of novel coronavirus from",
    "cancellation_source": "Self reported",
    "lat": 35.9316,
    "lon": -79.057377
}, {
    "FIPS": 39049,
    "reporter_url": "https://reporter.nih.gov/project-details/10892893",
    "award_remaining": 318037.08,
    "termination_date": "2025-03-21",
    "org_name": "OHIO STATE UNIVERSITY",
    "project_title": "Testing the effect of anti-tobacco message framing on polytobacco use in lesbian, gay, bisexual, and transgender young adults",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.999598,
    "lon": -83.033131
}, {
    "FIPS": 39061,
    "reporter_url": "https://reporter.nih.gov/project-details/10991842",
    "award_remaining": 331253.29,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CINCINNATI",
    "project_title": "Improving the accessibility of transgender voice training with visual-acoustic biofeedback",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.129719,
    "lon": -84.520554
}, {
    "FIPS": 39049,
    "reporter_url": "https://reporter.nih.gov/project-details/11015985",
    "award_remaining": 815881.0,
    "termination_date": "2025-03-20",
    "org_name": "OHIO STATE UNIVERSITY",
    "project_title": "Bisexual adolescents' and young adults' risk for depression and suicidal ideation: Developmental trajectories, risk and protective factors, and underlying mechanisms",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.999598,
    "lon": -83.033131
}, {
    "FIPS": 39035,
    "reporter_url": "https://reporter.nih.gov/project-details/11036909",
    "award_remaining": 279366.0,
    "termination_date": "2025-03-21",
    "org_name": "CASE WESTERN RESERVE UNIVERSITY",
    "project_title": "Youth Empowerment and Safety Intervention for Systems-involved Sexual and Gender Minority Youth at Risk of Suicide",
    "cancellation_source": "Self and HHS reported",
    "lat": 41.502739,
    "lon": -81.607334
}, {
    "FIPS": 39061,
    "reporter_url": "https://reporter.nih.gov/project-details/10840474",
    "award_remaining": 1744393.04,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF CINCINNATI",
    "project_title": "Cerebral small vessel disease burden and racial disparity in vascular cognitive impairment and Alzheimer\u2019s disease and its related dementias",
    "cancellation_source": "HHS reported",
    "lat": 39.129719,
    "lon": -84.520554
}, {
    "FIPS": 39049,
    "reporter_url": "https://reporter.nih.gov/project-details/10883566",
    "award_remaining": 1036898.54,
    "termination_date": "2025-03-20",
    "org_name": "RESEARCH INST NATIONWIDE CHILDREN'S HOSP",
    "project_title": "THE IMPACT OF PUBERTAL SUPPRESSION ON ADOLESCENT NEURAL AND MENTAL HEALTH TRAJECTORIES - Resubmission - 1",
    "cancellation_source": "HHS reported",
    "lat": 39.95251,
    "lon": -82.979302
}, {
    "FIPS": 39049,
    "reporter_url": "https://reporter.nih.gov/project-details/10872251",
    "award_remaining": 337527.64,
    "termination_date": "2025-03-11",
    "org_name": "OHIO STATE UNIVERSITY",
    "project_title": "Testing a multistage model of risk factors for cannabis use utilizing a measurement burst design among sexual minority women, sexual minority gender diverse individuals, and heterosexual women",
    "cancellation_source": "HHS reported",
    "lat": 39.999598,
    "lon": -83.033131
}, {
    "FIPS": 39049,
    "reporter_url": "https://reporter.nih.gov/project-details/10688381",
    "award_remaining": 2393740.5099999998,
    "termination_date": "2025-03-24",
    "org_name": "OHIO STATE UNIVERSITY",
    "project_title": "Center for Serological Testing to Improve Outcomes from Pandemic COVID-19 (STOP-COVID)",
    "cancellation_source": "HHS reported",
    "lat": 39.999598,
    "lon": -83.033131
}, {
    "FIPS": 39035,
    "reporter_url": "https://reporter.nih.gov/project-details/10680625",
    "award_remaining": 1193455.04,
    "termination_date": "2025-03-24",
    "org_name": "CASE WESTERN RESERVE UNIVERSITY",
    "project_title": "Pre-exposure Immunologic Health and Linkages to SARS-COV2 Serologic Responses, Endothelial Cell Resilience, and Cardiovascular Complications: Defining the mechanistic basis of high risk endotypes.",
    "cancellation_source": "HHS reported",
    "lat": 41.502739,
    "lon": -81.607334
}, {
    "FIPS": 39049,
    "reporter_url": "https://reporter.nih.gov/project-details/10597154",
    "award_remaining": 31523.21,
    "termination_date": "2025-03-21",
    "org_name": "OHIO STATE UNIVERSITY",
    "project_title": "Improving Sexual Minority Health: Differences in Substance Use, Substance Use Treatment, and Associated Chronic Diseases among Rural versus Urban Populations",
    "cancellation_source": "HHS reported",
    "lat": 39.999598,
    "lon": -83.033131
}, {
    "FIPS": 39049,
    "reporter_url": "https://reporter.nih.gov/project-details/10669810",
    "award_remaining": 1859625.9199999999,
    "termination_date": "2025-03-21",
    "org_name": "OHIO STATE UNIVERSITY",
    "project_title": "A Randomized Controlled Trial of an HPV Vaccine Intervention for Young Sexual Minority Men",
    "cancellation_source": "HHS reported",
    "lat": 39.999598,
    "lon": -83.033131
}, {
    "FIPS": 39049,
    "reporter_url": "https://reporter.nih.gov/project-details/10916716",
    "award_remaining": 22932.25,
    "termination_date": "2025-03-18",
    "org_name": "OHIO STATE UNIVERSITY",
    "project_title": "Client and clinician priorities for same-day PrEP and DoxyPEP awareness, uptake, and persistence in primary care.",
    "cancellation_source": "HHS reported",
    "lat": 39.999598,
    "lon": -83.033131
}, {
    "FIPS": 39049,
    "reporter_url": "https://reporter.nih.gov/project-details/10947101",
    "award_remaining": 196875.0,
    "termination_date": "2025-04-01",
    "org_name": "OHIO STATE UNIVERSITY",
    "project_title": "COVID-19 Vaccine Coverage and General Vaccine Hesitancy in Rural Areas in the United States",
    "cancellation_source": "HHS reported",
    "lat": 39.999598,
    "lon": -83.033131
}, {
    "FIPS": 39035,
    "reporter_url": "https://reporter.nih.gov/project-details/10994407",
    "award_remaining": 165398.76,
    "termination_date": "2025-03-21",
    "org_name": "CASE WESTERN RESERVE UNIVERSITY",
    "project_title": "Defining the neovaginal microbiome after gender affirming vaginoplasty",
    "cancellation_source": "HHS reported",
    "lat": 41.502739,
    "lon": -81.607334
}, {
    "FIPS": 39049,
    "reporter_url": "https://reporter.nih.gov/project-details/10619940",
    "award_remaining": 148099.56,
    "termination_date": "2025-03-21",
    "org_name": "OHIO STATE UNIVERSITY",
    "project_title": "The Influence of Developmental Assets on Intersectional Stigma and HIV Prevention Behaviors in Black MSM",
    "cancellation_source": "HHS reported",
    "lat": 39.999598,
    "lon": -83.033131
}, {
    "FIPS": 39061,
    "reporter_url": "https://reporter.nih.gov/project-details/10866585",
    "award_remaining": 1265295.3500000001,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF CINCINNATI",
    "project_title": "Young Sexual Minority Women's Mental Health: Developmental Trajectories, Mechanisms of Risk, and Protective Factors.",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.129719,
    "lon": -84.520554
}, {
    "FIPS": 39035,
    "reporter_url": "https://reporter.nih.gov/project-details/10983483",
    "award_remaining": 384686.5,
    "termination_date": "2025-04-15",
    "org_name": "CASE WESTERN RESERVE UNIVERSITY",
    "project_title": "APOL1 as a model to quantify and identify environmental modifiers of genetic associations in diverse populations",
    "cancellation_source": "Self reported",
    "lat": 41.502739,
    "lon": -81.607334
}, {
    "FIPS": 40109,
    "reporter_url": "https://reporter.nih.gov/project-details/11081104",
    "award_remaining": 95486.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF OKLAHOMA HLTH SCIENCES CTR",
    "project_title": "Randomized Controlled Trial of Dyadic Financial Incentive Treatment for Dual Smoker Couples: Evaluation of Efficacy, Mechanisms, and Cost Effectiveness",
    "cancellation_source": "Self and HHS reported",
    "lat": 35.47459,
    "lon": -97.505034
}, {
    "FIPS": 40109,
    "reporter_url": "https://reporter.nih.gov/project-details/10981148",
    "award_remaining": 296976.57,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF OKLAHOMA HLTH SCIENCES CTR",
    "project_title": "Elucidating minority stress influences on tobacco use at the intersection of sexual orientation and rurality",
    "cancellation_source": "Self and HHS reported",
    "lat": 35.47459,
    "lon": -97.505034
}, {
    "FIPS": 40109,
    "reporter_url": "https://reporter.nih.gov/project-details/11057000",
    "award_remaining": 162655.47,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF OKLAHOMA HLTH SCIENCES CTR",
    "project_title": "Ecological momentary assessment of daily minority stressors and cannabis and tobacco co-use among sexual minority young adults",
    "cancellation_source": "Self and HHS reported",
    "lat": 35.47459,
    "lon": -97.505034
}, {
    "FIPS": 40021,
    "reporter_url": "https://reporter.nih.gov/project-details/10233632",
    "award_remaining": 2906085.0,
    "termination_date": "2025-03-24",
    "org_name": "CHEROKEE NATION",
    "project_title": "RAD-X UP NARCH Supplement: A Cherokee Nation Community-Driven Program for Testing and Contact Tracing (Cherokee PROTECT)",
    "cancellation_source": "HHS reported",
    "lat": 35.85318,
    "lon": -94.99067
}, {
    "FIPS": 40021,
    "reporter_url": "https://reporter.nih.gov/project-details/10293108",
    "award_remaining": 1317488.0,
    "termination_date": "2025-03-24",
    "org_name": "CHEROKEE NATION",
    "project_title": "Cherokee Nation Native AmericanResearch Center for Health",
    "cancellation_source": "HHS reported",
    "lat": 35.85318,
    "lon": -94.99067
}, {
    "FIPS": 40109,
    "reporter_url": "https://reporter.nih.gov/project-details/11074843",
    "award_remaining": 10000.0,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF OKLAHOMA HLTH SCIENCES CTR",
    "project_title": "Be Curious, Not Judgmental: The 4th National Symposium on Sexual Behavior of Youth",
    "cancellation_source": "HHS reported",
    "lat": 35.47459,
    "lon": -97.505034
}, {
    "FIPS": 40119,
    "reporter_url": "https://reporter.nih.gov/project-details/10828734",
    "award_remaining": 318173.06,
    "termination_date": "2025-04-30",
    "org_name": "OKLAHOMA STATE UNIVERSITY STILLWATER",
    "project_title": "G-RISE at Oklahoma State University",
    "cancellation_source": "Self reported",
    "lat": 36.115627,
    "lon": -97.058038
}, {
    "FIPS": 41039,
    "reporter_url": "https://reporter.nih.gov/project-details/11129927",
    "award_remaining": 229707.18,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF OREGON",
    "project_title": "Predicting acute and dynamic suicide risk in rural sexual minorities",
    "cancellation_source": "Self and HHS reported",
    "lat": 44.045509,
    "lon": -123.069741
}, {
    "FIPS": 41039,
    "reporter_url": "https://reporter.nih.gov/project-details/10484828",
    "award_remaining": 682242.0,
    "termination_date": "2025-03-24",
    "org_name": "UNIVERSITY OF OREGON",
    "project_title": "Prevention Research Center: Parenting Among Women Who Are Opioid Users",
    "cancellation_source": "HHS reported",
    "lat": 44.045509,
    "lon": -123.069741
}, {
    "FIPS": 41039,
    "reporter_url": "https://reporter.nih.gov/project-details/10616911",
    "award_remaining": 633455.01,
    "termination_date": "2025-03-24",
    "org_name": "UNIVERSITY OF OREGON",
    "project_title": "Supported employment to create a community culture of SARS-CoV-2 rapid testing among people who inject drugs: PeerConnect2Test",
    "cancellation_source": "HHS reported",
    "lat": 44.045509,
    "lon": -123.069741
}, {
    "FIPS": 41051,
    "reporter_url": "https://reporter.nih.gov/project-details/10852482",
    "award_remaining": 1286550.0,
    "termination_date": "2025-03-24",
    "org_name": "OREGON HEALTH & SCIENCE UNIVERSITY",
    "project_title": "Effect of obesity on HIV pathogenesis, antiretroviral therapy, and metabolic comorbidities",
    "cancellation_source": "HHS reported",
    "lat": 45.49882,
    "lon": -122.685647
}, {
    "FIPS": 41039,
    "reporter_url": "https://reporter.nih.gov/project-details/11004019",
    "award_remaining": 158274.02,
    "termination_date": "2025-03-21",
    "org_name": "IRIS MEDIA, INC.",
    "project_title": "Evidence-based Parent Training for Diverse Families (PTDF)",
    "cancellation_source": "HHS reported",
    "lat": 44.048722,
    "lon": -123.088476
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10880249",
    "award_remaining": 1719040.21,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MARYLAND BALTIMORE",
    "project_title": "Integrated Networks of Scholars in Global Health Research Training (INSIGHT)",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.292248,
    "lon": -76.625629
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10916436",
    "award_remaining": 901894.5699999999,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MARYLAND BALTIMORE",
    "project_title": "A randomized clinical trial of client-centered care coordination to improve pre-exposure prophylaxis use for Black men who have sex with men",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.292248,
    "lon": -76.625629
}, {
    "FIPS": 24033,
    "reporter_url": "https://reporter.nih.gov/project-details/10906230",
    "award_remaining": 45090.58,
    "termination_date": "2025-03-21",
    "org_name": "UNIV OF MARYLAND, COLLEGE PARK",
    "project_title": "Sexual orientation, gender identity, and alcohol use: A multi-method analysis of developmental differences and key mechanisms",
    "cancellation_source": "Self and HHS reported",
    "lat": 38.992333,
    "lon": -76.952986
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10878690",
    "award_remaining": 34319.09,
    "termination_date": "2025-03-21",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "Interpersonal Protective Factors and Mental Health Symptom Self-Management Among Black Transgender Women: A Mixed-Methods Study",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10886032",
    "award_remaining": 1927381.97,
    "termination_date": "2025-03-20",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "Enhanced COhort methods for HIV Research and Epidemiology (ENCORE) among transgender women in the United States",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10771048",
    "award_remaining": 1183014.0,
    "termination_date": "2025-04-01",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "REDES: a peer network and mobile health (mHealth) enhanced CHW model to maximize COVID-19 vaccination among low income Latinos",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10879037",
    "award_remaining": 863272.76,
    "termination_date": "2025-03-21",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "Characterizing intersecting sexual, gender, and race-based stigmas affecting communities of US transgender women and cisgender men who are sexually active with men",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10492082",
    "award_remaining": 6700000.0,
    "termination_date": "2025-03-24",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "HOPE in Action: A Clinical Trial of HIV-to-HIV Liver Transplantation",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10544767",
    "award_remaining": 722013.85,
    "termination_date": "2025-03-24",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "Sin Duda: a community-driven approach to expand reach, access and uptake of COVID-19 home-based tests for at risk Latinos",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10688356",
    "award_remaining": 1253163.8,
    "termination_date": "2025-03-24",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "Johns Hopkins Excellence in Pathogenesis and Immunity Center for SARS-CoV-2 (JH-EPICS)",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24033,
    "reporter_url": "https://reporter.nih.gov/project-details/10802220",
    "award_remaining": 299791.97,
    "termination_date": "2025-03-20",
    "org_name": "PACIFIC INSTITUTE FOR RES AND EVALUATION",
    "project_title": "The Role of Local Structural Stigma in Alcohol Related Inequities among SGM Young Adults",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.050676,
    "lon": -76.93727
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10997877",
    "award_remaining": 20666.94,
    "termination_date": "2025-03-18",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "Characterizing Economic Determinants of Violence and Safety Disparities Among Sexual and Gender Diverse Populations",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/11085774",
    "award_remaining": 750102.6899999999,
    "termination_date": "2025-03-20",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "Impact of Gender Affirming Hormone Therapy on HIV Viral Dynamics and Immune Responses in Transgender Women",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10931459",
    "award_remaining": 526027.38,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF MARYLAND BALTIMORE",
    "project_title": "The Role of Testosterone on Mediating Sex and Gender Influences on Chronic Orofacial Pain Conditions",
    "cancellation_source": "HHS reported",
    "lat": 39.292248,
    "lon": -76.625629
}, {
    "FIPS": 24031,
    "reporter_url": "https://reporter.nih.gov/project-details/10880572",
    "award_remaining": 11012015.8800000008,
    "termination_date": "2025-03-21",
    "org_name": "WESTAT, INC.",
    "project_title": "Adolescent Medicine Trials Network for HIV/AIDS Interventions (ATN) Operations and Collaborations Center (UM2 Clinical Trial Optional)",
    "cancellation_source": "HHS reported",
    "lat": 39.094626,
    "lon": -77.181453
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10901921",
    "award_remaining": 890323.62,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF MARYLAND BALTIMORE",
    "project_title": "Synergistic epidemics of non-communicable diseases, stigma, depression, and material insecurities among sexual and gender minorities living with HIV in Nigeria",
    "cancellation_source": "HHS reported",
    "lat": 39.292248,
    "lon": -76.625629
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10934361",
    "award_remaining": 784851.89,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MARYLAND BALTIMORE",
    "project_title": "Assessing intersectional, multilevel and multidimensional structural racism for English- and Spanish-speaking populations in the US",
    "cancellation_source": "HHS reported",
    "lat": 39.292248,
    "lon": -76.625629
}, {
    "FIPS": 24033,
    "reporter_url": "https://reporter.nih.gov/project-details/10837780",
    "award_remaining": 658061.23,
    "termination_date": "2025-03-21",
    "org_name": "UNIV OF MARYLAND, COLLEGE PARK",
    "project_title": "Long-term and Daily Associations among Intersectional Minority Stress, Structural Oppression, and Alcohol Use and Misuse among Sexual Minority Adolescents of Color",
    "cancellation_source": "HHS reported",
    "lat": 38.992333,
    "lon": -76.952986
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10848343",
    "award_remaining": 135399.09,
    "termination_date": "2025-03-10",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "Implementation research to improve the uptake of influenza vaccination in CKD",
    "cancellation_source": "HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10933001",
    "award_remaining": 1338772.71,
    "termination_date": "2025-03-12",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "A Multi-Level Trauma-Informed Approach to Increase HIV Pre-exposure Prophylaxis Initiation among Black Women",
    "cancellation_source": "HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10783810",
    "award_remaining": 97150.17,
    "termination_date": "2025-03-21",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "Expanding \"Safe Spaces 4 Sexual Health,\" a Mobile Van HIV/STI Testing and Care Linkage Strategy, for Black MSM in online spaces",
    "cancellation_source": "HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10905980",
    "award_remaining": 676423.97,
    "termination_date": "2025-03-21",
    "org_name": "FRIENDS RESEARCH INSTITUTE, INC.",
    "project_title": "Comparative- and cost-effectiveness research determining the optimal intervention for advancing transgender women living with HIV to full viral suppression",
    "cancellation_source": "HHS reported",
    "lat": 39.303676,
    "lon": -76.619888
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10894742",
    "award_remaining": 846098.4,
    "termination_date": "2025-03-20",
    "org_name": "FRIENDS RESEARCH INSTITUTE, INC.",
    "project_title": "Optimizing PrEP Implementation and Cost-effectiveness among Sexual and Gender Minority Individuals with a Substance Use Disorder",
    "cancellation_source": "HHS reported",
    "lat": 39.303676,
    "lon": -76.619888
}, {
    "FIPS": 24033,
    "reporter_url": "https://reporter.nih.gov/project-details/11009959",
    "award_remaining": 1113500.51,
    "termination_date": "2025-03-21",
    "org_name": "PACIFIC INSTITUTE FOR RES AND EVALUATION",
    "project_title": "Enhancing Structural Competency in School-Based Health Centers to Address LGBTQ+ Adolescent Health Equity",
    "cancellation_source": "HHS reported",
    "lat": 39.050676,
    "lon": -76.93727
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/11098409",
    "award_remaining": 38103.36,
    "termination_date": "2025-03-21",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "Extending the Prevention Toolbox: Exploring the Acceptability and Impact of Long-acting Injectable PrEP among MSM in Baltimore: A Pilot Study",
    "cancellation_source": "HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10578778",
    "award_remaining": 1119865.27,
    "termination_date": "2025-03-20",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "Improving PrEP protection of\u00a0transgender women through mechanistic pharmacokinetic understanding",
    "cancellation_source": "HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10641978",
    "award_remaining": 663724.42,
    "termination_date": "2025-03-20",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "Sex, Gender and the Immunopathogenesis of HIV",
    "cancellation_source": "HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10364643",
    "award_remaining": 1439052.1599999999,
    "termination_date": "2025-03-12",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "Health disparities, stress pathways, and stress-related comorbidities among MSM living with HIV",
    "cancellation_source": "HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/11009980",
    "award_remaining": 185275.32,
    "termination_date": "2025-03-21",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "Understanding the Complex Reproductive Health Needs of Formerly Incarcerated Young Men",
    "cancellation_source": "HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10822586",
    "award_remaining": 10598.75,
    "termination_date": "2025-03-10",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "Epidemiological factors related to human monkeypox virus (MPOX) in men who have sex with men (MSM) in the United States",
    "cancellation_source": "HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10826027",
    "award_remaining": 26735.1,
    "termination_date": "2025-03-03",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "Understanding how chromosomal makeup and cross-sex hormone administration affect wound healing in mice",
    "cancellation_source": "HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10921340",
    "award_remaining": 11217.73,
    "termination_date": "2025-03-18",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "Aligning HIV services with gender diverse community priorities through person-centered care: a mixed methods study in India",
    "cancellation_source": "HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/11068148",
    "award_remaining": 37870.0,
    "termination_date": "2025-03-18",
    "org_name": "JOHNS HOPKINS UNIVERSITY",
    "project_title": "Structural Stigma and Mental Health Among Transgender and Gender Diverse Adults Living in the Rural United States",
    "cancellation_source": "HHS reported",
    "lat": 39.325256,
    "lon": -76.605131
}, {
    "FIPS": 24033,
    "reporter_url": "https://reporter.nih.gov/project-details/10239915",
    "award_remaining": 127165.09,
    "termination_date": "2025-03-24",
    "org_name": "UNIV OF MARYLAND, COLLEGE PARK",
    "project_title": "Elucidating Airborne SARS-CoV-2 Infectivity at Single Aerosol Resolution",
    "cancellation_source": "HHS reported",
    "lat": 38.992333,
    "lon": -76.952986
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10927237",
    "award_remaining": 7647791.5499999998,
    "termination_date": "2025-04-08",
    "org_name": "UNIVERSITY OF MARYLAND BALTIMORE",
    "project_title": "University of Maryland FIRST Program",
    "cancellation_source": "HHS reported",
    "lat": 39.292248,
    "lon": -76.625629
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10918339",
    "award_remaining": 986360.88,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MARYLAND BALTIMORE",
    "project_title": "Resilient HIV Implementation Science with Sexual and Gender Minority Youths using Evidence (RISE) Clinical Research Center",
    "cancellation_source": "HHS reported",
    "lat": 39.292248,
    "lon": -76.625629
}, {
    "FIPS": 24031,
    "reporter_url": "https://reporter.nih.gov/project-details/10695604",
    "award_remaining": 4000000.0,
    "termination_date": "2025-03-24",
    "org_name": "WESTAT, INC.",
    "project_title": "NHLBI Maternal Morbidity and Mortality (3M) Administrative Coordinating Center",
    "cancellation_source": "HHS reported",
    "lat": 39.094626,
    "lon": -77.181453
}, {
    "FIPS": 24510,
    "reporter_url": "https://reporter.nih.gov/project-details/10976762",
    "award_remaining": 1091300.99,
    "termination_date": "2025-04-07",
    "org_name": "UNIVERSITY OF MARYLAND BALTIMORE",
    "project_title": "ComPASS Health Equity Research Hub at UMB",
    "cancellation_source": "HHS reported",
    "lat": 39.292248,
    "lon": -76.625629
}, {
    "FIPS": 25021,
    "reporter_url": "https://reporter.nih.gov/project-details/10886007",
    "award_remaining": 1352073.79,
    "termination_date": "2025-03-20",
    "org_name": "HARVARD PILGRIM HEALTH CARE, INC.",
    "project_title": "Cabotegravir PrEP: Actionable Robust Evidence for Translation into Practice (CABARET)",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.316808,
    "lon": -71.234595
}, {
    "FIPS": 25021,
    "reporter_url": "https://reporter.nih.gov/project-details/10795788",
    "award_remaining": 1327156.47,
    "termination_date": "2025-03-21",
    "org_name": "HARVARD PILGRIM HEALTH CARE, INC.",
    "project_title": "Sexual orientation-related disparities in obstetrical and perinatal health",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.316808,
    "lon": -71.234595
}, {
    "FIPS": 25017,
    "reporter_url": "https://reporter.nih.gov/project-details/10818631",
    "award_remaining": 1289224.3,
    "termination_date": "2025-03-21",
    "org_name": "CAMBRIDGE HEALTH ALLIANCE",
    "project_title": "ALACRITY for Early Screening and Treatment of High Risk Youth (eSToRY)",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.374417,
    "lon": -71.104436
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10920445",
    "award_remaining": 1776251.8600000001,
    "termination_date": "2025-02-28",
    "org_name": "BOSTON CHILDREN'S HOSPITAL",
    "project_title": "TransHealthGUIDE: Transforming Health for Gender-Diverse Young Adults Using Interventions to Drive Equity",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.337481,
    "lon": -71.104964
}, {
    "FIPS": 25015,
    "reporter_url": "https://reporter.nih.gov/project-details/11018758",
    "award_remaining": 99974.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MASSACHUSETTS AMHERST",
    "project_title": "Effect of Medicaid Accountable Care Organizations on Behavioral Health Care Quality and Outcomes for Children",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.386914,
    "lon": -72.521131
}, {
    "FIPS": 25027,
    "reporter_url": "https://reporter.nih.gov/project-details/10876893",
    "award_remaining": 85313.79,
    "termination_date": "2025-03-21",
    "org_name": "UNIV OF MASSACHUSETTS MED SCH WORCESTER",
    "project_title": "Applying Deep Learning for Predicting Retention in PrEP Care and Effective PrEP Use among Key Populations at Risk for HIV in Thailand",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.2802,
    "lon": -71.758245
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/11062592",
    "award_remaining": 258830.68,
    "termination_date": "2025-03-21",
    "org_name": "BOSTON UNIVERSITY MEDICAL CAMPUS",
    "project_title": "Stigma,Romantic Relationships, and Alcohol Use Among Transgender and Nonbinary Young Adults",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.33639,
    "lon": -71.07097
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10991658",
    "award_remaining": 86871.54,
    "termination_date": "2025-03-21",
    "org_name": "BOSTON CHILDREN'S HOSPITAL",
    "project_title": "Sexual Minority Mental Health During the COVID-19 Pandemic: An Intersectional, Social Epidemiologic Investigation",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.337481,
    "lon": -71.104964
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10947001",
    "award_remaining": 438342.48,
    "termination_date": "2025-03-21",
    "org_name": "MASSACHUSETTS GENERAL HOSPITAL",
    "project_title": "Adapting and testing a smoking cessation intervention for transgender and gender-diverse individuals",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.363198,
    "lon": -71.068772
}, {
    "FIPS": 25021,
    "reporter_url": "https://reporter.nih.gov/project-details/10921786",
    "award_remaining": 223302.46,
    "termination_date": "2025-03-21",
    "org_name": "HARVARD PILGRIM HEALTH CARE, INC.",
    "project_title": "Over-the-Counter PrEP: Acceptability, Feasibility, and Potential Impact of Access without a Prescription (OFFSCRIPT)",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.316808,
    "lon": -71.234595
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10952740",
    "award_remaining": 470246.1,
    "termination_date": "2025-03-21",
    "org_name": "BRIGHAM AND WOMEN'S HOSPITAL",
    "project_title": "Confidentiality in use of health insurance coverage for reproductive health services",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.336107,
    "lon": -71.107481
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/11007213",
    "award_remaining": 798517.78,
    "termination_date": "2025-03-27",
    "org_name": "BOSTON UNIVERSITY MEDICAL CAMPUS",
    "project_title": "An assessment of environmental and neighborhood-level risk factors for subfertility among Black women in the U.S.",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.33639,
    "lon": -71.07097
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10921703",
    "award_remaining": 418684.31,
    "termination_date": "2025-03-21",
    "org_name": "FENWAY COMMUNITY HEALTH CENTER",
    "project_title": "Bridge to Belonging (B2B): Peer led intervention to reduce loneliness and depression among older gay and bisexual men",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.34412,
    "lon": -71.098412
}, {
    "FIPS": 25017,
    "reporter_url": "https://reporter.nih.gov/project-details/11031686",
    "award_remaining": 239551.0,
    "termination_date": "2025-03-12",
    "org_name": "BOSTON COLLEGE",
    "project_title": "Development of a School-Based Prevention Intervention to Promote Adolescent Mental Health Equity",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.336956,
    "lon": -71.170504
}, {
    "FIPS": 25021,
    "reporter_url": "https://reporter.nih.gov/project-details/11145379",
    "award_remaining": 206103.72,
    "termination_date": "2025-03-21",
    "org_name": "HARVARD PILGRIM HEALTH CARE, INC.",
    "project_title": "Tailoring Delivery of LongActing PrEP for Cisgender (MSM) who Use Methamphetamine",
    "cancellation_source": "HHS reported",
    "lat": 42.316808,
    "lon": -71.234595
}, {
    "FIPS": 25017,
    "reporter_url": "https://reporter.nih.gov/project-details/10910931",
    "award_remaining": 4011515.4199999999,
    "termination_date": "2025-03-21",
    "org_name": "BROAD INSTITUTE, INC.",
    "project_title": "1/4 Asian Bipolar Genetics Network (A-BIG-NET)",
    "cancellation_source": "HHS reported",
    "lat": 42.363082,
    "lon": -71.087893
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10794272",
    "award_remaining": 1628103.5900000001,
    "termination_date": "2025-03-20",
    "org_name": "BOSTON CHILDREN'S HOSPITAL",
    "project_title": "Skeletal Health and Bone Marrow Composition Among Youth",
    "cancellation_source": "HHS reported",
    "lat": 42.337481,
    "lon": -71.104964
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10925168",
    "award_remaining": 650428.85,
    "termination_date": "2025-03-10",
    "org_name": "BOSTON CHILDREN'S HOSPITAL",
    "project_title": "Digital data streams and machine learning for real-time modeling of vaccine-preventable infectious diseases",
    "cancellation_source": "HHS reported",
    "lat": 42.337481,
    "lon": -71.104964
}, {
    "FIPS": 25027,
    "reporter_url": "https://reporter.nih.gov/project-details/10922833",
    "award_remaining": 290202.47,
    "termination_date": "2025-03-21",
    "org_name": "UNIV OF MASSACHUSETTS MED SCH WORCESTER",
    "project_title": "Optimizing an mHealth intervention to improve uptake and adherence of the HIV pre-exposure prophylaxis (PrEP) in vulnerable adolescents and emerging adults",
    "cancellation_source": "HHS reported",
    "lat": 42.2802,
    "lon": -71.758245
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/11176626",
    "award_remaining": 327390.0,
    "termination_date": "2025-03-21",
    "org_name": "TUFTS UNIVERSITY BOSTON",
    "project_title": "Supporting the Tufts BIRCWH Program with an Additional Scholar Position",
    "cancellation_source": "HHS reported",
    "lat": 42.3498,
    "lon": -71.06149
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10759403",
    "award_remaining": 1052517.3400000001,
    "termination_date": "2025-04-01",
    "org_name": "NORTHEASTERN UNIVERSITY",
    "project_title": "Community-based Design and Evaluation of a Conversational Agent to Promote SARS-COV2 Vaccination in Black Churches",
    "cancellation_source": "HHS reported",
    "lat": 42.340048,
    "lon": -71.088892
}, {
    "FIPS": 25017,
    "reporter_url": "https://reporter.nih.gov/project-details/10933002",
    "award_remaining": 392555.0,
    "termination_date": "2025-03-21",
    "org_name": "IBIS REPRODUCTIVE HEALTH",
    "project_title": "Advancing novel survey tools to increase participation and improve sexual and reproductive health data quality",
    "cancellation_source": "HHS reported",
    "lat": 42.372813,
    "lon": -71.119098
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10906956",
    "award_remaining": 133367.24,
    "termination_date": "2025-03-12",
    "org_name": "BOSTON MEDICAL CENTER",
    "project_title": "Understanding the effects of cross-sex hormone therapy on vaginal mucosal immunity",
    "cancellation_source": "HHS reported",
    "lat": 42.336854,
    "lon": -71.070881
}, {
    "FIPS": 25017,
    "reporter_url": "https://reporter.nih.gov/project-details/10876450",
    "award_remaining": 577852.21,
    "termination_date": "2025-03-10",
    "org_name": "BOSTON COLLEGE",
    "project_title": "Leveraging community-based behavioral health to increase vaccine uptake in Latinx adults with mental illness",
    "cancellation_source": "HHS reported",
    "lat": 42.336956,
    "lon": -71.170504
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10220180",
    "award_remaining": 13847931.0,
    "termination_date": "2025-03-24",
    "org_name": "MASSACHUSETTS GENERAL HOSPITAL",
    "project_title": "Point of Care Technology Research Center in Primary Care",
    "cancellation_source": "HHS reported",
    "lat": 42.363198,
    "lon": -71.068772
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10551734",
    "award_remaining": 1967601.6000000001,
    "termination_date": "2025-02-28",
    "org_name": "HARVARD SCHOOL OF PUBLIC HEALTH",
    "project_title": "Advancing novel methods to measure and analyze multiple types of discrimination for population health research",
    "cancellation_source": "HHS reported",
    "lat": 42.335306,
    "lon": -71.102775
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10852367",
    "award_remaining": 800325.98,
    "termination_date": "2025-03-24",
    "org_name": "HARVARD SCHOOL OF PUBLIC HEALTH",
    "project_title": "Casual, Statistical and Mathematical Modeling with Serologic Data",
    "cancellation_source": "HHS reported",
    "lat": 42.335306,
    "lon": -71.102775
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10328116",
    "award_remaining": 9639619.2400000002,
    "termination_date": "2025-03-24",
    "org_name": "BRIGHAM AND WOMEN'S HOSPITAL",
    "project_title": "Discovering Durable Pan-Coronavirus Immunity",
    "cancellation_source": "HHS reported",
    "lat": 42.336107,
    "lon": -71.107481
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10890506",
    "award_remaining": 2191609.6200000001,
    "termination_date": "2025-03-24",
    "org_name": "BRIGHAM AND WOMEN'S HOSPITAL",
    "project_title": "SARS-CoV-2 tropism in the brain and its relationship to COVID-19 pathogenesis",
    "cancellation_source": "HHS reported",
    "lat": 42.336107,
    "lon": -71.107481
}, {
    "FIPS": 25021,
    "reporter_url": "https://reporter.nih.gov/project-details/11035524",
    "award_remaining": 721388.14,
    "termination_date": "2025-03-12",
    "org_name": "HARVARD PILGRIM HEALTH CARE, INC.",
    "project_title": "Supportive and restrictive factors and mental health in LGBT adolescent and young adult populations",
    "cancellation_source": "HHS reported",
    "lat": 42.316808,
    "lon": -71.234595
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/11020434",
    "award_remaining": 305171.43,
    "termination_date": "2025-03-12",
    "org_name": "BRIGHAM AND WOMEN'S HOSPITAL",
    "project_title": "Molecular Mechanisms of Hormone-Mediated Sex Differences in Wound Healing",
    "cancellation_source": "HHS reported",
    "lat": 42.336107,
    "lon": -71.107481
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10944835",
    "award_remaining": 521825.62,
    "termination_date": "2025-03-21",
    "org_name": "BOSTON CHILDREN'S HOSPITAL",
    "project_title": "The effects of gender-affirming sex steroids on brain development in adolescents",
    "cancellation_source": "HHS reported",
    "lat": 42.337481,
    "lon": -71.104964
}, {
    "FIPS": 25027,
    "reporter_url": "https://reporter.nih.gov/project-details/10676114",
    "award_remaining": -145867.91,
    "termination_date": "2025-03-21",
    "org_name": "UNIV OF MASSACHUSETTS MED SCH WORCESTER",
    "project_title": "Adapting effective mhealth interventions to improve uptake and adherence of the HIV pre- exposure prophylaxis (PrEP) in Thai young MSM",
    "cancellation_source": "HHS reported",
    "lat": 42.2802,
    "lon": -71.758245
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10652571",
    "award_remaining": 48123.55,
    "termination_date": "2025-03-21",
    "org_name": "NORTHEASTERN UNIVERSITY",
    "project_title": "The Use of Diversity: Managing Race and Representation in Law, Politics, and the Biosciences",
    "cancellation_source": "HHS reported",
    "lat": 42.340048,
    "lon": -71.088892
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10707198",
    "award_remaining": 2326551.02,
    "termination_date": "2025-03-21",
    "org_name": "FUNCTION PROMOTING THERAPIES, LLC",
    "project_title": "Phase IIB: Development of TruT Algorithm for Commercialization in Androgen Disorders",
    "cancellation_source": "HHS reported",
    "lat": 42.33724,
    "lon": -71.10217
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/11007199",
    "award_remaining": 32213.42,
    "termination_date": "2025-03-21",
    "org_name": "BOSTON UNIVERSITY (CHARLES RIVER CAMPUS)",
    "project_title": "Boston University Conference on Language Development, 2022-2026",
    "cancellation_source": "HHS reported",
    "lat": 42.349594,
    "lon": -71.099726
}, {
    "FIPS": 25017,
    "reporter_url": "https://reporter.nih.gov/project-details/10473113",
    "award_remaining": 18146.48,
    "termination_date": "2025-03-14",
    "org_name": "HARVARD UNIVERSITY",
    "project_title": "The Optics of Health: Race Skin Tone Minority Health and Health Disparities in the U.S.",
    "cancellation_source": "HHS reported",
    "lat": 42.369697,
    "lon": -71.11193
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10912193",
    "award_remaining": 100881.14,
    "termination_date": "2025-03-12",
    "org_name": "BETH ISRAEL DEACONESS MEDICAL CENTER",
    "project_title": "Gender-Affirming Testosterone Therapy on Breast Cancer Risk and Treatment Outcomes",
    "cancellation_source": "HHS reported",
    "lat": 42.33982,
    "lon": -71.10568
}, {
    "FIPS": 25017,
    "reporter_url": "https://reporter.nih.gov/project-details/10652864",
    "award_remaining": 175107.66,
    "termination_date": "2025-03-10",
    "org_name": "BENTLEY UNIVERSITY",
    "project_title": "COVID-19 Vaccine Uptake and Risk Mitigation Behaviors: Understanding the Role of Institutional Trust",
    "cancellation_source": "HHS reported",
    "lat": 42.388834,
    "lon": -71.220231
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10900605",
    "award_remaining": 208851.82,
    "termination_date": "2025-04-01",
    "org_name": "BRIGHAM AND WOMEN'S HOSPITAL",
    "project_title": "Multi-level school-based intervention to improve HPV vaccine uptake and completion in South Africa",
    "cancellation_source": "HHS reported",
    "lat": 42.336107,
    "lon": -71.107481
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10929945",
    "award_remaining": 899495.72,
    "termination_date": "2025-04-01",
    "org_name": "TUFTS MEDICAL CENTER",
    "project_title": "Conversational Agents to Improve HPV Vaccine Acceptance in Primary Care",
    "cancellation_source": "HHS reported",
    "lat": 42.349512,
    "lon": -71.063308
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10923945",
    "award_remaining": 242612.59,
    "termination_date": "2025-04-01",
    "org_name": "NORTHEASTERN UNIVERSITY",
    "project_title": "Cancer misinformation on social media and its correction",
    "cancellation_source": "HHS reported",
    "lat": 42.340048,
    "lon": -71.088892
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10820423",
    "award_remaining": 81043.26,
    "termination_date": "2025-03-21",
    "org_name": "BOSTON MEDICAL CENTER",
    "project_title": "Building methods to assess and address cardiovascular health in transgender adults",
    "cancellation_source": "HHS reported",
    "lat": 42.336854,
    "lon": -71.070881
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10688351",
    "award_remaining": 1312957.0600000001,
    "termination_date": "2025-03-24",
    "org_name": "BETH ISRAEL DEACONESS MEDICAL CENTER",
    "project_title": "Immunologic Signatures of SARS-CoV-2 Vaccination and Disease",
    "cancellation_source": "HHS reported",
    "lat": 42.33982,
    "lon": -71.10568
}, {
    "FIPS": 25025,
    "reporter_url": "https://reporter.nih.gov/project-details/10997393",
    "award_remaining": 912451.72,
    "termination_date": "2025-03-20",
    "org_name": "BOSTON UNIVERSITY (CHARLES RIVER CAMPUS)",
    "project_title": "Effects of exogenous testosterone therapy on communication in gender diverse speakers",
    "cancellation_source": "HHS reported",
    "lat": 42.349594,
    "lon": -71.099726
}, {
    "FIPS": 26161,
    "reporter_url": "https://reporter.nih.gov/project-details/10805381",
    "award_remaining": 9183.11,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MICHIGAN AT ANN ARBOR",
    "project_title": "Low Dose Computed Tomography (LDCT) Eligibility and Outcome differences between Sexual and Gender Minorities and their Sexual and Gender Majority Counterparts",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.275494,
    "lon": -83.743038
}, {
    "FIPS": 26161,
    "reporter_url": "https://reporter.nih.gov/project-details/11088497",
    "award_remaining": 1591852.1899999999,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MICHIGAN AT ANN ARBOR",
    "project_title": "Strategies to Prevent HIV Acquisition Among Transgender MSM in the US",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.275494,
    "lon": -83.743038
}, {
    "FIPS": 26065,
    "reporter_url": "https://reporter.nih.gov/project-details/10856923",
    "award_remaining": 603112.6800000001,
    "termination_date": "2025-03-20",
    "org_name": "MICHIGAN STATE UNIVERSITY",
    "project_title": "Modeling Resilience as a Multidimensional Protective Factor for Transgender Health Disparities: Measure Development and Longitudinal Evaluation of Resilience",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.653979,
    "lon": -84.492032
}, {
    "FIPS": 26161,
    "reporter_url": "https://reporter.nih.gov/project-details/11060885",
    "award_remaining": 1827587.6200000001,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MICHIGAN AT ANN ARBOR",
    "project_title": "Improving Inclusivity of Alzheimer\u2019s Disease and Related Dementias Research for Asian Americans and Latinx through Nationally Representative Hybrid Sampling.",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.275494,
    "lon": -83.743038
}, {
    "FIPS": 26161,
    "reporter_url": "https://reporter.nih.gov/project-details/10412053",
    "award_remaining": 1592439.8400000001,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF MICHIGAN AT ANN ARBOR",
    "project_title": "A couples-based approach to HIV prevention for transgender women and their male partners",
    "cancellation_source": "Self and HHS reported",
    "lat": 42.275494,
    "lon": -83.743038
}, {
    "FIPS": 26081,
    "reporter_url": "https://reporter.nih.gov/project-details/10910038",
    "award_remaining": 105648.66,
    "termination_date": "2025-03-03",
    "org_name": "VAN ANDEL RESEARCH INSTITUTE",
    "project_title": "The roles of genetics, hormones, and gender in sexually dimorphic immune response",
    "cancellation_source": "HHS reported",
    "lat": 42.969389,
    "lon": -85.666402
}, {
    "FIPS": 26161,
    "reporter_url": "https://reporter.nih.gov/project-details/10880712",
    "award_remaining": 369394.43,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MICHIGAN AT ANN ARBOR",
    "project_title": "Sexual Fluidity and Longitudinal Changes in Alcohol Misuse and Associated Health Consequences",
    "cancellation_source": "HHS reported",
    "lat": 42.275494,
    "lon": -83.743038
}, {
    "FIPS": 26161,
    "reporter_url": "https://reporter.nih.gov/project-details/11018656",
    "award_remaining": 99999.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MICHIGAN AT ANN ARBOR",
    "project_title": "The role of circulating meta-inflammatory monocytes in adolescent insulin resistance",
    "cancellation_source": "HHS reported",
    "lat": 42.275494,
    "lon": -83.743038
}, {
    "FIPS": 26161,
    "reporter_url": "https://reporter.nih.gov/project-details/10821455",
    "award_remaining": 48482.3100000001,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MICHIGAN AT ANN ARBOR",
    "project_title": "Pipeline to Graduate Education and Careers in Behavioral and Social Science Research for URM Undergraduates: Addressing HIV in Sexual and Gender Minority Communities",
    "cancellation_source": "HHS reported",
    "lat": 42.275494,
    "lon": -83.743038
}, {
    "FIPS": 26065,
    "reporter_url": "https://reporter.nih.gov/project-details/10933529",
    "award_remaining": 793127.73,
    "termination_date": "2025-03-20",
    "org_name": "HENRY FORD HEALTH + MICHIGAN STATE UNIVERSITY HEALTH SCIENCES",
    "project_title": "A Multilevel, Multiphase Optimization Strategy for PrEP: Patients and Providers in Primary Care",
    "cancellation_source": "HHS reported",
    "lat": 42.653979,
    "lon": -84.492032
}, {
    "FIPS": 26161,
    "reporter_url": "https://reporter.nih.gov/project-details/11000850",
    "award_remaining": 492618.51,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF MICHIGAN AT ANN ARBOR",
    "project_title": "Smoking and Cancer-Related Health Disparities among Sexual and Gender Minority Adults",
    "cancellation_source": "HHS reported",
    "lat": 42.275494,
    "lon": -83.743038
}, {
    "FIPS": 26161,
    "reporter_url": "https://reporter.nih.gov/project-details/10619517",
    "award_remaining": 1234152.1499999999,
    "termination_date": "2025-03-03",
    "org_name": "UNIVERSITY OF MICHIGAN AT ANN ARBOR",
    "project_title": "Reproductive Consequences of Steroid Hormone Administration",
    "cancellation_source": "HHS reported",
    "lat": 42.275494,
    "lon": -83.743038
}, {
    "FIPS": 26161,
    "reporter_url": "https://reporter.nih.gov/project-details/10983769",
    "award_remaining": 921713.98,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF MICHIGAN AT ANN ARBOR",
    "project_title": "Violence and viral suppression among men living with HIV",
    "cancellation_source": "HHS reported",
    "lat": 42.275494,
    "lon": -83.743038
}, {
    "FIPS": 26161,
    "reporter_url": "https://reporter.nih.gov/project-details/10392460",
    "award_remaining": 363450.77,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MICHIGAN AT ANN ARBOR",
    "project_title": "Recruiting & Retaining Older African Americans into Research (ROAR)",
    "cancellation_source": "HHS reported",
    "lat": 42.275494,
    "lon": -83.743038
}, {
    "FIPS": 26065,
    "reporter_url": "https://reporter.nih.gov/project-details/10688350",
    "award_remaining": 751666.5699999999,
    "termination_date": "2025-03-24",
    "org_name": "MICHIGAN STATE UNIVERSITY",
    "project_title": "Culturally-targeted communication to promote SARS-CoV-2 antibody testing in saliva:  Enabling evaluation of inflammatory pathways in COVID-19 racial disparities",
    "cancellation_source": "HHS reported",
    "lat": 42.653979,
    "lon": -84.492032
}, {
    "FIPS": 26161,
    "reporter_url": "https://reporter.nih.gov/project-details/11051397",
    "award_remaining": 1059015.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MICHIGAN AT ANN ARBOR",
    "project_title": "ADRD risk and resilience among Black Americans: A 20-year longitudinal study",
    "cancellation_source": "HHS reported",
    "lat": 42.275494,
    "lon": -83.743038
}, {
    "FIPS": 26161,
    "reporter_url": "https://reporter.nih.gov/project-details/10812130",
    "award_remaining": 1093703.95,
    "termination_date": "2025-03-21",
    "org_name": "EASTERN MICHIGAN UNIVERSITY",
    "project_title": "Adaptable Community-Engaged Intervention for Violence Prevention: Michigan Model",
    "cancellation_source": "HHS reported",
    "lat": 42.233132,
    "lon": -83.623767
}, {
    "FIPS": 26161,
    "reporter_url": "https://reporter.nih.gov/project-details/10866574",
    "award_remaining": 4868039.71,
    "termination_date": "2025-04-08",
    "org_name": "UNIVERSITY OF MICHIGAN AT ANN ARBOR",
    "project_title": "Michigan Program for Advancing Cultural Transformation (M-PACT) in Biomedical and Health Sciences",
    "cancellation_source": "HHS reported",
    "lat": 42.275494,
    "lon": -83.743038
}, {
    "FIPS": 26121,
    "reporter_url": "https://reporter.nih.gov/project-details/10781210",
    "award_remaining": null,
    "termination_date": "2025-04-07",
    "org_name": "ACCESS HEALTH INC",
    "project_title": "Strengthening Community-Driven Safety-Net Interventions to Improve Health and Economic Equity",
    "cancellation_source": "HHS reported",
    "lat": 43.230962,
    "lon": -86.243109
}, {
    "FIPS": 26099,
    "reporter_url": "https://reporter.nih.gov/project-details/10780514",
    "award_remaining": null,
    "termination_date": "2025-04-07",
    "org_name": "FACE ADDICTION NOW",
    "project_title": "Creating Statewide Community Partnerships: Spanning Boundaries between Public Health, Emergency Housing & Criminal Justice",
    "cancellation_source": "HHS reported",
    "lat": 42.553717,
    "lon": -82.928158
}, {
    "FIPS": 26161,
    "reporter_url": "https://reporter.nih.gov/project-details/10974928",
    "award_remaining": 594863.01,
    "termination_date": "2025-04-07",
    "org_name": "UNIVERSITY OF MICHIGAN AT ANN ARBOR",
    "project_title": "Partners in Research: Building capacity for community-driven research to advance health equity",
    "cancellation_source": "HHS reported",
    "lat": 42.275494,
    "lon": -83.743038
}, {
    "FIPS": 26163,
    "reporter_url": "https://reporter.nih.gov/project-details/10825530",
    "award_remaining": 99780.84,
    "termination_date": "2025-04-02",
    "org_name": "UNIVERSITY OF DETROIT MERCY",
    "project_title": "U-RISE at University of Detroit Mercy",
    "cancellation_source": "Self reported",
    "lat": 42.417084,
    "lon": -83.138847
}, {
    "FIPS": 27053,
    "reporter_url": "https://reporter.nih.gov/project-details/11090086",
    "award_remaining": 69606.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MINNESOTA",
    "project_title": "Training the Long-Term Services and Supports Dementia Care Workforce in Provision of Care to Sexual and Gender Minority Residents",
    "cancellation_source": "Self and HHS reported",
    "lat": 44.975143,
    "lon": -93.227003
}, {
    "FIPS": 27053,
    "reporter_url": "https://reporter.nih.gov/project-details/10896380",
    "award_remaining": 488230.7,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF MINNESOTA",
    "project_title": "Testing Effective Methods to Recruit Sexual and Gender Minority Cancer Patients for Cancer Studies",
    "cancellation_source": "Self and HHS reported",
    "lat": 44.975143,
    "lon": -93.227003
}, {
    "FIPS": 27053,
    "reporter_url": "https://reporter.nih.gov/project-details/10825800",
    "award_remaining": 2078594.8,
    "termination_date": "2025-03-12",
    "org_name": "UNIVERSITY OF MINNESOTA",
    "project_title": "A Longitudinal Examination of Mechanisms Underlying Intersectional Health Disparities in the United States",
    "cancellation_source": "HHS reported",
    "lat": 44.975143,
    "lon": -93.227003
}, {
    "FIPS": 27053,
    "reporter_url": "https://reporter.nih.gov/project-details/10752616",
    "award_remaining": 666287.8,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MINNESOTA",
    "project_title": "Adolescent health at the intersections of sexual, gender, racial/ethnic, immigrant identities and native language",
    "cancellation_source": "HHS reported",
    "lat": 44.975143,
    "lon": -93.227003
}, {
    "FIPS": 27053,
    "reporter_url": "https://reporter.nih.gov/project-details/10824363",
    "award_remaining": 705873.41,
    "termination_date": "2025-03-10",
    "org_name": "HEALTHPARTNERS INSTITUTE",
    "project_title": "Maternal COVID-19 Vaccination and Lactation Outcomes",
    "cancellation_source": "HHS reported",
    "lat": 44.85364,
    "lon": -93.225576
}, {
    "FIPS": 27053,
    "reporter_url": "https://reporter.nih.gov/project-details/10667568",
    "award_remaining": 1135463.1599999999,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MINNESOTA",
    "project_title": "The All-or-Nothing Marriage? Marital Functioning and Health Among Individuals in Same and Different-Gender Marriages",
    "cancellation_source": "HHS reported",
    "lat": 44.975143,
    "lon": -93.227003
}, {
    "FIPS": 27053,
    "reporter_url": "https://reporter.nih.gov/project-details/10421060",
    "award_remaining": 299292.49,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF MINNESOTA",
    "project_title": "HPV Oropharyngeal cancer and screening in Gay and Bisexual Men",
    "cancellation_source": "HHS reported",
    "lat": 44.975143,
    "lon": -93.227003
}, {
    "FIPS": 27053,
    "reporter_url": "https://reporter.nih.gov/project-details/10916392",
    "award_remaining": 453397.12,
    "termination_date": "2025-03-12",
    "org_name": "UNIVERSITY OF MINNESOTA",
    "project_title": "Unequal Parenthoods: Population Perspectives on Gender, Race, and Sexual Minority Disparities in Family Stress and Health During Crises",
    "cancellation_source": "HHS reported",
    "lat": 44.975143,
    "lon": -93.227003
}, {
    "FIPS": 27053,
    "reporter_url": "https://reporter.nih.gov/project-details/11261495",
    "award_remaining": 757577.0,
    "termination_date": "2025-03-10",
    "org_name": "HEALTHPARTNERS INSTITUTE",
    "project_title": "Investigating Behavioral Mechanisms and Efficacy of a Provider-Directed Intervention for HPV Vaccine Promotion in Real-World Dental Settings",
    "cancellation_source": "HHS reported",
    "lat": 44.85364,
    "lon": -93.225576
}, {
    "FIPS": 27053,
    "reporter_url": "https://reporter.nih.gov/project-details/10885682",
    "award_remaining": 83383.96,
    "termination_date": "2025-03-10",
    "org_name": "UNIVERSITY OF MINNESOTA",
    "project_title": "Using Data Science to Quantify the Impact of Misinformation, Mistrust, and Other Key Psychosocial Factors on Vaccine Hesitancy Among Vulnerable People Experiencing Psychopathology",
    "cancellation_source": "HHS reported",
    "lat": 44.975143,
    "lon": -93.227003
}, {
    "FIPS": 27109,
    "reporter_url": "https://reporter.nih.gov/project-details/10869448",
    "award_remaining": 10362.97,
    "termination_date": "2025-03-20",
    "org_name": "MAYO CLINIC ROCHESTER",
    "project_title": "Refinement of a Training Module to Improve Discussions of Sexual Orientation and Gender Identity in Cancer Clinics",
    "cancellation_source": "HHS reported",
    "lat": 44.02432,
    "lon": -92.46011
}, {
    "FIPS": 27053,
    "reporter_url": "https://reporter.nih.gov/project-details/10522804",
    "award_remaining": 17957538.7399999984,
    "termination_date": "2025-03-24",
    "org_name": "UNIVERSITY OF MINNESOTA",
    "project_title": "Midwest AViDD Center",
    "cancellation_source": "Self and HHS reported",
    "lat": 44.975143,
    "lon": -93.227003
}, {
    "FIPS": 27053,
    "reporter_url": "https://reporter.nih.gov/project-details/10682507",
    "award_remaining": 3448783.2200000002,
    "termination_date": "2025-04-02",
    "org_name": "UNIVERSITY OF MINNESOTA",
    "project_title": "The Minnesota IRACDA Program",
    "cancellation_source": "Self reported",
    "lat": 44.975143,
    "lon": -93.227003
}, {
    "FIPS": 28089,
    "reporter_url": "https://reporter.nih.gov/project-details/10781706",
    "award_remaining": null,
    "termination_date": "2025-03-22",
    "org_name": "MY BROTHER'S KEEPER, INC.",
    "project_title": "Achieving Optimal Sexual and Reproductive Health (SRWH Project)",
    "cancellation_source": "HHS reported",
    "lat": 32.419743,
    "lon": -90.125726
}, {
    "FIPS": 28049,
    "reporter_url": "https://reporter.nih.gov/project-details/11074016",
    "award_remaining": 0.69,
    "termination_date": "2025-03-03",
    "org_name": "UNIVERSITY OF MISSISSIPPI MED CTR",
    "project_title": "Cross Sex Steroid Therapy and Cardiovascular Risk in the Transgender Female",
    "cancellation_source": "HHS reported",
    "lat": 32.328724,
    "lon": -90.175537
}, {
    "FIPS": 28151,
    "reporter_url": "https://reporter.nih.gov/project-details/11167954",
    "award_remaining": 374616.0,
    "termination_date": "2025-04-07",
    "org_name": "DELTA HEALTH ALLIANCE, INC.",
    "project_title": "Partnership to Optimize Equity in Maternal and Infant Health",
    "cancellation_source": "HHS reported",
    "lat": 33.40757,
    "lon": -90.911217
}, {
    "FIPS": 28049,
    "reporter_url": "https://reporter.nih.gov/project-details/10978012",
    "award_remaining": 851580.14,
    "termination_date": "2025-04-07",
    "org_name": "UNIVERSITY OF MISSISSIPPI MED CTR",
    "project_title": "Southeast Center for Health Achievement and Growth in Equity (SEACHANGE) Hub",
    "cancellation_source": "HHS reported",
    "lat": 32.328724,
    "lon": -90.175537
}, {
    "FIPS": 29189,
    "reporter_url": "https://reporter.nih.gov/project-details/10866483",
    "award_remaining": 602760.9300000001,
    "termination_date": "2025-03-10",
    "org_name": "WASHINGTON UNIVERSITY",
    "project_title": "Religion and support for genomic healthcare: An exploratory study of the US public and faith leaders.",
    "cancellation_source": "HHS reported",
    "lat": 38.664368,
    "lon": -90.323797
}, {
    "FIPS": 29189,
    "reporter_url": "https://reporter.nih.gov/project-details/10669612",
    "award_remaining": 229432.94,
    "termination_date": "2025-03-24",
    "org_name": "WASHINGTON UNIVERSITY",
    "project_title": "Development and characterization of engineered therapeutic antibodies against SARS-CoV-2",
    "cancellation_source": "HHS reported",
    "lat": 38.664368,
    "lon": -90.323797
}, {
    "FIPS": 29189,
    "reporter_url": "https://reporter.nih.gov/project-details/11003666",
    "award_remaining": 594439.8100000001,
    "termination_date": "2025-03-12",
    "org_name": "WASHINGTON UNIVERSITY",
    "project_title": "Efficacy of a Multi-level School Intervention for LGBTQ Youth",
    "cancellation_source": "HHS reported",
    "lat": 38.664368,
    "lon": -90.323797
}, {
    "FIPS": 29095,
    "reporter_url": "https://reporter.nih.gov/project-details/10617112",
    "award_remaining": 935912.76,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF MISSOURI KANSAS CITY",
    "project_title": "Faithful Response II: COVID-19 Rapid Test-to-Treat with African American Churches",
    "cancellation_source": "HHS reported",
    "lat": 39.034521,
    "lon": -94.575773
}, {
    "FIPS": 29189,
    "reporter_url": "https://reporter.nih.gov/project-details/10902121",
    "award_remaining": 1085920.6599999999,
    "termination_date": "2025-04-14",
    "org_name": "WASHINGTON UNIVERSITY",
    "project_title": "Human antibody-based countermeasures against the Wuhan Coronavirus SARS-CoV-2",
    "cancellation_source": "Self reported",
    "lat": 38.664368,
    "lon": -90.323797
}, {
    "FIPS": 42101,
    "reporter_url": "https://reporter.nih.gov/project-details/10850671",
    "award_remaining": 940995.98,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF PENNSYLVANIA",
    "project_title": "Investigating and identifying the heterogeneity in COVID-19 misinformation exposure on social media among Black and Rural communities to inform precision public health messaging",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.953462,
    "lon": -75.193983
}, {
    "FIPS": 42003,
    "reporter_url": "https://reporter.nih.gov/project-details/10875471",
    "award_remaining": 386369.76,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF PITTSBURGH AT PITTSBURGH",
    "project_title": "A Randomized Controlled Trial of a Game-Based Intervention to Reduce Alcohol Use among Sexual and Gender Minority Youth",
    "cancellation_source": "Self and HHS reported",
    "lat": 40.440909,
    "lon": -79.959125
}, {
    "FIPS": 42101,
    "reporter_url": "https://reporter.nih.gov/project-details/10861929",
    "award_remaining": 380550.59,
    "termination_date": "2025-03-21",
    "org_name": "TEMPLE UNIV OF THE COMMONWEALTH",
    "project_title": "Data-driven, peer-led messaging using social media influencers to increase PrEP awareness and uptake among transgender women",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.980272,
    "lon": -75.157051
}, {
    "FIPS": 42027,
    "reporter_url": "https://reporter.nih.gov/project-details/10825602",
    "award_remaining": 155003.64,
    "termination_date": "2025-03-21",
    "org_name": "PENNSYLVANIA STATE UNIVERSITY, THE",
    "project_title": "Enhancing Engagement with Online Health Messaging about Oral and Injectable PrEP Among Young-Adult MSM",
    "cancellation_source": "Self and HHS reported",
    "lat": 40.870717,
    "lon": -77.83415
}, {
    "FIPS": 42101,
    "reporter_url": "https://reporter.nih.gov/project-details/11026646",
    "award_remaining": 990427.15,
    "termination_date": "2025-03-21",
    "org_name": "CHILDREN'S HOSP OF PHILADELPHIA",
    "project_title": "The Collaborative Care PrTNER (Prevention, Treatment, Navigation,Engagement, Resource) Project",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.946632,
    "lon": -75.196604
}, {
    "FIPS": 42003,
    "reporter_url": "https://reporter.nih.gov/project-details/10768457",
    "award_remaining": 153319.76,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF PITTSBURGH AT PITTSBURGH",
    "project_title": "Building an interprofessional and diverse workforce in substance use and pain",
    "cancellation_source": "Self and HHS reported",
    "lat": 40.440909,
    "lon": -79.959125
}, {
    "FIPS": 42101,
    "reporter_url": "https://reporter.nih.gov/project-details/10988796",
    "award_remaining": 230282.48,
    "termination_date": "2025-03-21",
    "org_name": "TEMPLE UNIV OF THE COMMONWEALTH",
    "project_title": "Advancing help-seeking and recovery measures for sexual and gender minority survivors of gender-based violence",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.980272,
    "lon": -75.157051
}, {
    "FIPS": 42101,
    "reporter_url": "https://reporter.nih.gov/project-details/11085507",
    "award_remaining": 812946.0,
    "termination_date": "2025-03-12",
    "org_name": "DREXEL UNIVERSITY",
    "project_title": "Measures of structural stigmatization and discrimination for HIV research with Latine sexual and gender minorities",
    "cancellation_source": "Self and HHS reported",
    "lat": 39.954073,
    "lon": -75.186541
}, {
    "FIPS": 42101,
    "reporter_url": "https://reporter.nih.gov/project-details/10774243",
    "award_remaining": 1367250.6599999999,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF PENNSYLVANIA",
    "project_title": "Project RESIST: Increasing Resistance to Tobacco Marketing Among Young Adult Sexual Minority Women Using Inoculation Message Approaches",
    "cancellation_source": "HHS reported",
    "lat": 39.953462,
    "lon": -75.193983
}, {
    "FIPS": 42101,
    "reporter_url": "https://reporter.nih.gov/project-details/10833095",
    "award_remaining": 150193.76,
    "termination_date": "2025-03-12",
    "org_name": "UNIVERSITY OF PENNSYLVANIA",
    "project_title": "Project SMART: Social Media Anti-vaping Messages to Reduce ENDS Use Among Sexual and Gender Minority Teens",
    "cancellation_source": "HHS reported",
    "lat": 39.953462,
    "lon": -75.193983
}, {
    "FIPS": 42101,
    "reporter_url": "https://reporter.nih.gov/project-details/10894613",
    "award_remaining": 608866.64,
    "termination_date": "2025-03-10",
    "org_name": "UNIVERSITY OF PENNSYLVANIA",
    "project_title": "Understanding the Regional Ecology of a Future HIV Vaccine",
    "cancellation_source": "HHS reported",
    "lat": 39.953462,
    "lon": -75.193983
}, {
    "FIPS": 42003,
    "reporter_url": "https://reporter.nih.gov/project-details/10798111",
    "award_remaining": 456422.66,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF PITTSBURGH AT PITTSBURGH",
    "project_title": "Social-Affective Vulnerability to Suicidality among LGBTQ Young Adults: Proximal and Distal Factors",
    "cancellation_source": "HHS reported",
    "lat": 40.440909,
    "lon": -79.959125
}, {
    "FIPS": 42003,
    "reporter_url": "https://reporter.nih.gov/project-details/11020053",
    "award_remaining": 99994.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF PITTSBURGH AT PITTSBURGH",
    "project_title": "Dopamine Availability and Developmental Pathways of Adolescent Depression and Anhedonia - Administrative Supplement",
    "cancellation_source": "HHS reported",
    "lat": 40.440909,
    "lon": -79.959125
}, {
    "FIPS": 42101,
    "reporter_url": "https://reporter.nih.gov/project-details/10914163",
    "award_remaining": 5909629.1299999999,
    "termination_date": "2025-03-21",
    "org_name": "DREXEL UNIVERSITY",
    "project_title": "Catalyzing Systemic Change at Drexel University to Support Diverse Faculty in Health Disparities Research",
    "cancellation_source": "HHS reported",
    "lat": 39.954073,
    "lon": -75.186541
}, {
    "FIPS": 42101,
    "reporter_url": "https://reporter.nih.gov/project-details/10873326",
    "award_remaining": 50325.71,
    "termination_date": "2025-03-12",
    "org_name": "CHILDREN'S HOSP OF PHILADELPHIA",
    "project_title": "Developing Modules to Address Microaggressions and Discriminatory Behaviors",
    "cancellation_source": "HHS reported",
    "lat": 39.946632,
    "lon": -75.196604
}, {
    "FIPS": 42101,
    "reporter_url": "https://reporter.nih.gov/project-details/10778519",
    "award_remaining": null,
    "termination_date": "2025-03-22",
    "org_name": "ASIAN COMMUNITY HEALTH COALITION",
    "project_title": "Asian Community-Led Health Equity Structural Intervention (Asian CHESI)",
    "cancellation_source": "HHS reported",
    "lat": 39.960695,
    "lon": -75.157059
}, {
    "FIPS": 42101,
    "reporter_url": "https://reporter.nih.gov/project-details/11078765",
    "award_remaining": 851087.25,
    "termination_date": "2025-04-01",
    "org_name": "UNIVERSITY OF PENNSYLVANIA",
    "project_title": "An inoculation theory-based messaging intervention addressing misinformation about HPV vaccine on social media: The Inoculate for HPV Vaccine randomized controlled trial",
    "cancellation_source": "HHS reported",
    "lat": 39.953462,
    "lon": -75.193983
}, {
    "FIPS": 42101,
    "reporter_url": "https://reporter.nih.gov/project-details/10800512",
    "award_remaining": 529503.47,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF PENNSYLVANIA",
    "project_title": "Intervention to improve parent communication about sexuality with sexual minority male adolescents",
    "cancellation_source": "HHS reported",
    "lat": 39.953462,
    "lon": -75.193983
}, {
    "FIPS": 42003,
    "reporter_url": "https://reporter.nih.gov/project-details/10823709",
    "award_remaining": 50941.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF PITTSBURGH AT PITTSBURGH",
    "project_title": "Biological Mechanisms of Suicidal Behavior among Sexual Minority Adolescents - Supplement",
    "cancellation_source": "HHS reported",
    "lat": 40.440909,
    "lon": -79.959125
}, {
    "FIPS": 42003,
    "reporter_url": "https://reporter.nih.gov/project-details/10726920",
    "award_remaining": 62152.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF PITTSBURGH AT PITTSBURGH",
    "project_title": "Building Up",
    "cancellation_source": "HHS reported",
    "lat": 40.440909,
    "lon": -79.959125
}, {
    "FIPS": 42003,
    "reporter_url": "https://reporter.nih.gov/project-details/10726926",
    "award_remaining": 15758.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF PITTSBURGH AT PITTSBURGH",
    "project_title": "Building Up",
    "cancellation_source": "HHS reported",
    "lat": 40.440909,
    "lon": -79.959125
}, {
    "FIPS": 42003,
    "reporter_url": "https://reporter.nih.gov/project-details/10874084",
    "award_remaining": 215227.0,
    "termination_date": "2025-03-10",
    "org_name": "DUQUESNE UNIVERSITY",
    "project_title": "Partnerships for Prevention: A plan for managing student stress, anxiety, and pain through interactive\u00a0media.",
    "cancellation_source": "HHS reported",
    "lat": 40.437818,
    "lon": -79.993649
}, {
    "FIPS": 42003,
    "reporter_url": "https://reporter.nih.gov/project-details/10949604",
    "award_remaining": 662000.0600000001,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF PITTSBURGH AT PITTSBURGH",
    "project_title": "Promoting Inclusive Excellence",
    "cancellation_source": "HHS reported",
    "lat": 40.440909,
    "lon": -79.959125
}, {
    "FIPS": 42003,
    "reporter_url": "https://reporter.nih.gov/project-details/10767519",
    "award_remaining": 485296.68,
    "termination_date": "2025-03-10",
    "org_name": "UNIVERSITY OF PITTSBURGH AT PITTSBURGH",
    "project_title": "Modeling Adolescent Health Care Decision-Making for Vaccines: A Community- Based Participatory Approach",
    "cancellation_source": "HHS reported",
    "lat": 40.440909,
    "lon": -79.959125
}, {
    "FIPS": 42003,
    "reporter_url": "https://reporter.nih.gov/project-details/10875822",
    "award_remaining": 554305.33,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF PITTSBURGH AT PITTSBURGH",
    "project_title": "Psychosocial Predictors of Risk for Suicidal Behavior Among Gender Minority Adolescents",
    "cancellation_source": "HHS reported",
    "lat": 40.440909,
    "lon": -79.959125
}, {
    "FIPS": 42101,
    "reporter_url": "https://reporter.nih.gov/project-details/10991124",
    "award_remaining": 196128.43,
    "termination_date": "2025-03-21",
    "org_name": "TEMPLE UNIV OF THE COMMONWEALTH",
    "project_title": "Developing and pilot testing an eHealth decision support tool for young trans women to improve informed decision \tmaking about PrEP",
    "cancellation_source": "HHS reported",
    "lat": 39.980272,
    "lon": -75.157051
}, {
    "FIPS": 42043,
    "reporter_url": "https://reporter.nih.gov/project-details/10842257",
    "award_remaining": 542183.66,
    "termination_date": "2025-04-01",
    "org_name": "PENNSYLVANIA STATE UNIV HERSHEY MED CTR",
    "project_title": "HPV ECHO: Increasing the adoption of evidence-based communication strategies for HPV vaccination in rural primary care practices",
    "cancellation_source": "HHS reported",
    "lat": 40.264414,
    "lon": -76.674014
}, {
    "FIPS": 42101,
    "reporter_url": "https://reporter.nih.gov/project-details/10933455",
    "award_remaining": 2895139.73,
    "termination_date": "2025-04-07",
    "org_name": "DREXEL UNIVERSITY",
    "project_title": "Advancing Health Equity Through Innovative Community Capacity Building, Data Science & Delivering Community-Centered Structural Interventions & Outcomes: Drexel's ComPASS Coordinating Center (C3)",
    "cancellation_source": "HHS reported",
    "lat": 39.954073,
    "lon": -75.186541
}, {
    "FIPS": 44007,
    "reporter_url": "https://reporter.nih.gov/project-details/10823327",
    "award_remaining": 372422.38,
    "termination_date": "2025-03-21",
    "org_name": "BROWN UNIVERSITY",
    "project_title": "Examining Health Comorbidities and Healthcare Utilization Disparities among Older Transgender and Cisgender Adults in the U.S.",
    "cancellation_source": "Self and HHS reported",
    "lat": 41.826136,
    "lon": -71.404513
}, {
    "FIPS": 44007,
    "reporter_url": "https://reporter.nih.gov/project-details/10933019",
    "award_remaining": 279436.76,
    "termination_date": "2025-04-01",
    "org_name": "BROWN UNIVERSITY",
    "project_title": "Integrated Network Analysis of RADx-UP Data to Increase COVID-19 Testing and Vaccination Among Persons Involved with Criminal Legal Systems (PCLS)",
    "cancellation_source": "Self and HHS reported",
    "lat": 41.826136,
    "lon": -71.404513
}, {
    "FIPS": 44007,
    "reporter_url": "https://reporter.nih.gov/project-details/11131581",
    "award_remaining": 304268.04,
    "termination_date": "2025-03-21",
    "org_name": "RHODE ISLAND HOSPITAL",
    "project_title": "Event-level Antecedents of Heavy Drinking Among Bisexual and Heterosexual Women with and without Histories of Sexual Assault",
    "cancellation_source": "Self and HHS reported",
    "lat": 41.811681,
    "lon": -71.409371
}, {
    "FIPS": 44007,
    "reporter_url": "https://reporter.nih.gov/project-details/10612852",
    "award_remaining": 288525.36,
    "termination_date": "2025-03-21",
    "org_name": "BROWN UNIVERSITY",
    "project_title": "Making universal, free-of-charge antiretroviral therapy work for sexual and gender minority youth in Brazil",
    "cancellation_source": "Self and HHS reported",
    "lat": 41.826136,
    "lon": -71.404513
}, {
    "FIPS": 44007,
    "reporter_url": "https://reporter.nih.gov/project-details/10903921",
    "award_remaining": 866894.98,
    "termination_date": "2025-03-20",
    "org_name": "BROWN UNIVERSITY",
    "project_title": "Intervention to Enhance PrepPersistence Among African American Men Who Have Sex With Men",
    "cancellation_source": "HHS reported",
    "lat": 41.826136,
    "lon": -71.404513
}, {
    "FIPS": 44009,
    "reporter_url": "https://reporter.nih.gov/project-details/10829458",
    "award_remaining": 194486.58,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF RHODE ISLAND",
    "project_title": "ESTEEMED Scholars Program at the University of Rhode Island",
    "cancellation_source": "HHS reported",
    "lat": 41.486042,
    "lon": -71.528656
}, {
    "FIPS": 44007,
    "reporter_url": "https://reporter.nih.gov/project-details/10917072",
    "award_remaining": 322213.85,
    "termination_date": "2025-03-21",
    "org_name": "RHODE ISLAND HOSPITAL",
    "project_title": "Integrated Alcohol and Sexual Assault Prevention for Bisexual Women",
    "cancellation_source": "HHS reported",
    "lat": 41.811681,
    "lon": -71.409371
}, {
    "FIPS": 44007,
    "reporter_url": "https://reporter.nih.gov/project-details/10757043",
    "award_remaining": 109719.66,
    "termination_date": "2025-03-10",
    "org_name": "BUTLER HOSPITAL (PROVIDENCE, RI)",
    "project_title": "COVID19 vaccine hesitancy among perinatal women at risk for health disparities",
    "cancellation_source": "HHS reported",
    "lat": 41.843586,
    "lon": -71.379656
}, {
    "FIPS": 44007,
    "reporter_url": "https://reporter.nih.gov/project-details/10712780",
    "award_remaining": 64508.0,
    "termination_date": "2025-03-21",
    "org_name": "EMMA PENDLETON BRADLEY HOSPITAL",
    "project_title": "A culturally centered CBT protocol for suicidal ideation and suicide attempts among Latinx youth",
    "cancellation_source": "HHS reported",
    "lat": 41.792379,
    "lon": -71.367401
}, {
    "FIPS": 44009,
    "reporter_url": "https://reporter.nih.gov/project-details/11046167",
    "award_remaining": 771618.0,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF RHODE ISLAND",
    "project_title": "Network-based study design, statistical, and modeling solutions for HIV among populations that use illicit substances: Informing interventions and policy in real-world settings using existing data",
    "cancellation_source": "HHS reported",
    "lat": 41.486042,
    "lon": -71.528656
}, {
    "FIPS": 44009,
    "reporter_url": "https://reporter.nih.gov/project-details/10821268",
    "award_remaining": 195373.29,
    "termination_date": "2025-03-21",
    "org_name": "PRO-CHANGE BEHAVIOR SYSTEMS, INC.",
    "project_title": "Bridges: A digital intervention to increase workplace belonging",
    "cancellation_source": "HHS reported",
    "lat": 41.451027,
    "lon": -71.497523
}, {
    "FIPS": 44007,
    "reporter_url": "https://reporter.nih.gov/project-details/10613077",
    "award_remaining": 979946.75,
    "termination_date": "2025-02-28",
    "org_name": "BROWN UNIVERSITY",
    "project_title": "Improving mental health among the LGBTQ+ community impacted by the COVID-19 pandemic",
    "cancellation_source": "HHS reported",
    "lat": 41.826136,
    "lon": -71.404513
}, {
    "FIPS": 44009,
    "reporter_url": "https://reporter.nih.gov/project-details/11065758",
    "award_remaining": 0.0,
    "termination_date": "2025-03-20",
    "org_name": "GORDON RESEARCH CONFERENCES",
    "project_title": "2025 Cardiac Arrhythmia Mechanisms Gordon Research Conference and Gordon Research Seminar",
    "cancellation_source": "HHS reported",
    "lat": 41.480003,
    "lon": -71.569648
}, {
    "FIPS": 44009,
    "reporter_url": "https://reporter.nih.gov/project-details/11074164",
    "award_remaining": 3100.0,
    "termination_date": "2025-03-20",
    "org_name": "GORDON RESEARCH CONFERENCES",
    "project_title": "2025 Sex Differences in Immunity Gordon Research Conference and Gordon Research Seminar",
    "cancellation_source": "HHS reported",
    "lat": 41.480003,
    "lon": -71.569648
}, {
    "FIPS": 44007,
    "reporter_url": "https://reporter.nih.gov/project-details/10949742",
    "award_remaining": 134942.28,
    "termination_date": "2025-04-07",
    "org_name": "BROWN UNIVERSITY",
    "project_title": "The Impact of Social-Contextual Stressors on Psychopharmacological Mechanisms of Smoking Cessation and Relapse among Socioeconomically Disadvantaged Young Adults who Smoke Cigarettes",
    "cancellation_source": "Self reported",
    "lat": 41.826136,
    "lon": -71.404513
}, {
    "FIPS": 45079,
    "reporter_url": "https://reporter.nih.gov/project-details/11000632",
    "award_remaining": 94974.49,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF SOUTH CAROLINA AT COLUMBIA",
    "project_title": "The ADAR Summit Meeting",
    "cancellation_source": "HHS reported",
    "lat": 33.999623,
    "lon": -81.028249
}, {
    "FIPS": 45079,
    "reporter_url": "https://reporter.nih.gov/project-details/10927241",
    "award_remaining": 6066200.7599999998,
    "termination_date": "2025-03-12",
    "org_name": "UNIVERSITY OF SOUTH CAROLINA AT COLUMBIA",
    "project_title": "Faculty Initiative for Improved Recruitment, Retention, and Experience (FIIRRE)",
    "cancellation_source": "HHS reported",
    "lat": 33.999623,
    "lon": -81.028249
}, {
    "FIPS": 45019,
    "reporter_url": "https://reporter.nih.gov/project-details/10911378",
    "award_remaining": 583096.16,
    "termination_date": "2025-03-21",
    "org_name": "MEDICAL UNIVERSITY OF SOUTH CAROLINA",
    "project_title": "STEM-Coaching and Resources for Entrepreneurial Women (CREW)",
    "cancellation_source": "HHS reported",
    "lat": 32.786754,
    "lon": -79.947265
}, {
    "FIPS": 45079,
    "reporter_url": "https://reporter.nih.gov/project-details/10978364",
    "award_remaining": 393732.31,
    "termination_date": "2025-03-12",
    "org_name": "UNIVERSITY OF SOUTH CAROLINA AT COLUMBIA",
    "project_title": "PRIDE-CARES Center: Patient-Responsive Initiatives for Diverse Engagement - LGBTQ+ Community Action in Research to Eliminate Substance Use Disorder",
    "cancellation_source": "HHS reported",
    "lat": 33.999623,
    "lon": -81.028249
}, {
    "FIPS": 47037,
    "reporter_url": "https://reporter.nih.gov/project-details/10983387",
    "award_remaining": 540489.66,
    "termination_date": "2025-03-20",
    "org_name": "VANDERBILT UNIVERSITY",
    "project_title": "Measuring and Mapping Trajectories of Risk and Resilience for Suicidal Thoughts and Behaviors in Sexual and Gender Minority Preteens",
    "cancellation_source": "Self and HHS reported",
    "lat": 36.143381,
    "lon": -86.803365
}, {
    "FIPS": 47157,
    "reporter_url": "https://reporter.nih.gov/project-details/10899314",
    "award_remaining": 12094.46,
    "termination_date": "2025-03-18",
    "org_name": "UNIVERSITY OF MEMPHIS",
    "project_title": "A Mixed Methods Study to Enhance Alcohol Treatment Help-seeking and Engagement Among Gender Diverse Adults",
    "cancellation_source": "Self and HHS reported",
    "lat": 35.120123,
    "lon": -89.939705
}, {
    "FIPS": 47037,
    "reporter_url": "https://reporter.nih.gov/project-details/11072243",
    "award_remaining": 722293.0,
    "termination_date": "2025-03-20",
    "org_name": "VANDERBILT UNIVERSITY",
    "project_title": "Mental Health Effects of Marriage Policy: Evidence from Linked Administrative Data in New Zealand",
    "cancellation_source": "Self and HHS reported",
    "lat": 36.143381,
    "lon": -86.803365
}, {
    "FIPS": 47037,
    "reporter_url": "https://reporter.nih.gov/project-details/10852925",
    "award_remaining": 4982003.7000000002,
    "termination_date": "2025-03-21",
    "org_name": "VANDERBILT UNIVERSITY MEDICAL CENTER",
    "project_title": "Vanderbilt FIRST - Elevating Excellence and Transforming Institutional Culture",
    "cancellation_source": "HHS reported",
    "lat": 36.143784,
    "lon": -86.800995
}, {
    "FIPS": 47037,
    "reporter_url": "https://reporter.nih.gov/project-details/10899675",
    "award_remaining": 60352.4,
    "termination_date": "2025-03-21",
    "org_name": "VANDERBILT UNIVERSITY",
    "project_title": "Multi-Level Determinants of Sexual and Gender Minority Aging",
    "cancellation_source": "HHS reported",
    "lat": 36.143381,
    "lon": -86.803365
}, {
    "FIPS": 47037,
    "reporter_url": "https://reporter.nih.gov/project-details/10854835",
    "award_remaining": 24125227.7399999984,
    "termination_date": "2025-03-21",
    "org_name": "MEHARRY MEDICAL COLLEGE",
    "project_title": "The RCMI Program in Health Disparities Research at Meharry Medical College",
    "cancellation_source": "HHS reported",
    "lat": 36.166904,
    "lon": -86.806149
}, {
    "FIPS": 47037,
    "reporter_url": "https://reporter.nih.gov/project-details/10642814",
    "award_remaining": 1036087.38,
    "termination_date": "2025-02-28",
    "org_name": "VANDERBILT UNIVERSITY",
    "project_title": "Effects of Social Networks and Policy Context on Health among Older Sexual and Gender Minorities in the US South",
    "cancellation_source": "HHS reported",
    "lat": 36.143381,
    "lon": -86.803365
}, {
    "FIPS": 47093,
    "reporter_url": "https://reporter.nih.gov/project-details/10988917",
    "award_remaining": 14549.29,
    "termination_date": "2025-03-19",
    "org_name": "UNIVERSITY OF TENNESSEE KNOXVILLE",
    "project_title": "Examining Proximal Associations between Minority Stress, PTSD Symptoms, and Alcohol Use among Bi+ College Students with Trauma Histories",
    "cancellation_source": "HHS reported",
    "lat": 35.954943,
    "lon": -83.93035
}, {
    "FIPS": 47065,
    "reporter_url": "https://reporter.nih.gov/project-details/10793008",
    "award_remaining": 224753.34,
    "termination_date": "2025-03-10",
    "org_name": "UNIVERSITY OF TENNESSEE CHATTANOOGA",
    "project_title": "Mathematical Modeling and Scientific Computing for Infectious Disease Research",
    "cancellation_source": "HHS reported",
    "lat": 35.045822,
    "lon": -85.299815
}, {
    "FIPS": 47037,
    "reporter_url": "https://reporter.nih.gov/project-details/10547968",
    "award_remaining": 1890539.74,
    "termination_date": "2025-03-21",
    "org_name": "MEHARRY MEDICAL COLLEGE",
    "project_title": "Meharry HIV/AIDS Research and Training Facility",
    "cancellation_source": "HHS reported",
    "lat": 36.166904,
    "lon": -86.806149
}, {
    "FIPS": 47037,
    "reporter_url": "https://reporter.nih.gov/project-details/11059507",
    "award_remaining": 750528.0,
    "termination_date": "2025-03-22",
    "org_name": "VANDERBILT UNIVERSITY MEDICAL CENTER",
    "project_title": "Engaging Diverse Stakeholders in Genomic/Precision Medicine Research: The All of Us Research Program Engagement Core",
    "cancellation_source": "HHS reported",
    "lat": 36.143784,
    "lon": -86.800995
}, {
    "FIPS": 48113,
    "reporter_url": "https://reporter.nih.gov/project-details/10934568",
    "award_remaining": 875417.24,
    "termination_date": "2025-03-20",
    "org_name": "UT SOUTHWESTERN MEDICAL CENTER",
    "project_title": "Long-term trajectories of psychosocial functioning among transgender youth and their parents.",
    "cancellation_source": "HHS reported",
    "lat": 32.811963,
    "lon": -96.837534
}, {
    "FIPS": 48201,
    "reporter_url": "https://reporter.nih.gov/project-details/10891578",
    "award_remaining": 313452.96,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF TX MD ANDERSON CAN CTR",
    "project_title": "Sexual and Gender Minority Cancer Curricular Advances for Research and Education (SGM Cancer CARE)",
    "cancellation_source": "HHS reported",
    "lat": 29.706319,
    "lon": -95.397195
}, {
    "FIPS": 48029,
    "reporter_url": "https://reporter.nih.gov/project-details/10807984",
    "award_remaining": 499482.38,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF TEXAS SAN ANTONIO",
    "project_title": "Contextual Determinants of Sexual Minority Health in the United States",
    "cancellation_source": "HHS reported",
    "lat": 29.567119,
    "lon": -98.605723
}, {
    "FIPS": 48167,
    "reporter_url": "https://reporter.nih.gov/project-details/10848229",
    "award_remaining": 5464217.71,
    "termination_date": "2025-03-24",
    "org_name": "UNIVERSITY OF TEXAS MED BR GALVESTON",
    "project_title": "World Reference Center for Emerging Viruses and Arboviruses (WRCEVA)",
    "cancellation_source": "HHS reported",
    "lat": 29.311028,
    "lon": -94.778007
}, {
    "FIPS": 48439,
    "reporter_url": "https://reporter.nih.gov/project-details/10868520",
    "award_remaining": 10000000.0,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF NORTH TEXAS HLTH SCI CTR",
    "project_title": "Texas Minority Health, Research and Outreach (MiHERO)",
    "cancellation_source": "HHS reported",
    "lat": 32.749542,
    "lon": -97.36903
}, {
    "FIPS": 48439,
    "reporter_url": "https://reporter.nih.gov/project-details/10778338",
    "award_remaining": null,
    "termination_date": "2025-03-22",
    "org_name": "HEALTHY TARRANT COUNTY COLLABORATION",
    "project_title": "Macro-level Health Considerations of Community and Criminal Justice System Relationships in North Texas ",
    "cancellation_source": "HHS reported",
    "lat": 32.765454,
    "lon": -97.252866
}, {
    "FIPS": 48201,
    "reporter_url": "https://reporter.nih.gov/project-details/10781469",
    "award_remaining": null,
    "termination_date": "2025-03-22",
    "org_name": "ASIAN AMERICAN HEALTH COALITION/HOUSTON",
    "project_title": "Addressing Systemic Barriers Impacting Health in CHC Communities",
    "cancellation_source": "HHS reported",
    "lat": 29.715091,
    "lon": -95.553787
}, {
    "FIPS": 48201,
    "reporter_url": "https://reporter.nih.gov/project-details/10997294",
    "award_remaining": 26394.0,
    "termination_date": "2025-03-12",
    "org_name": "UNIVERSITY OF HOUSTON",
    "project_title": "A multi-level study of the link between fear of deportation and mental health in Latinx young adults: The role of systemic inflammation and related risk and protective factors",
    "cancellation_source": "HHS reported",
    "lat": 29.718091,
    "lon": -95.336483
}, {
    "FIPS": 48167,
    "reporter_url": "https://reporter.nih.gov/project-details/10514146",
    "award_remaining": 36694422.3999999985,
    "termination_date": "2025-03-24",
    "org_name": "UNIVERSITY OF TEXAS MED BR GALVESTON",
    "project_title": "UTMB-Novartis Alliance for Pandemic Preparedness",
    "cancellation_source": "HHS reported",
    "lat": 29.311028,
    "lon": -94.778007
}, {
    "FIPS": 48453,
    "reporter_url": "https://reporter.nih.gov/project-details/11001953",
    "award_remaining": 1336740.25,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF TEXAS AT AUSTIN",
    "project_title": "How Spouses Influence Each Other's Health in Same- and Different-Sex Marriages: A Dyadic and Longitudinal Assessment from Mid to Later Life",
    "cancellation_source": "HHS reported",
    "lat": 30.291188,
    "lon": -97.737568
}, {
    "FIPS": 48303,
    "reporter_url": "https://reporter.nih.gov/project-details/10742318",
    "award_remaining": 211114.83,
    "termination_date": "2025-02-28",
    "org_name": "TEXAS TECH UNIVERSITY",
    "project_title": "Internal Sources of Minority Stress and Alcohol Consumption",
    "cancellation_source": "HHS reported",
    "lat": 33.584696,
    "lon": -101.872767
}, {
    "FIPS": 48113,
    "reporter_url": "https://reporter.nih.gov/project-details/10853106",
    "award_remaining": 4913372.29,
    "termination_date": "2025-04-08",
    "org_name": "UT SOUTHWESTERN MEDICAL CENTER",
    "project_title": "The Medical District UTSW-D FIRST Program",
    "cancellation_source": "HHS reported",
    "lat": 32.811963,
    "lon": -96.837534
}, {
    "FIPS": 48201,
    "reporter_url": "https://reporter.nih.gov/project-details/10908586",
    "award_remaining": 779971.62,
    "termination_date": "2025-04-01",
    "org_name": "UNIVERSITY OF TX MD ANDERSON CAN CTR",
    "project_title": "Promoting HPV Vaccination among Young Adults in Texas",
    "cancellation_source": "HHS reported",
    "lat": 29.706319,
    "lon": -95.397195
}, {
    "FIPS": 48141,
    "reporter_url": "https://reporter.nih.gov/project-details/10857169",
    "award_remaining": 3883606.1899999999,
    "termination_date": "2025-04-08",
    "org_name": "UNIVERSITY OF TEXAS EL PASO",
    "project_title": "UTEP FIRST: United Toward Equity and Progress: Faculty Institutional Recruitment for Sustainable Transformation",
    "cancellation_source": "HHS reported",
    "lat": 31.770518,
    "lon": -106.504149
}, {
    "FIPS": 48453,
    "reporter_url": "https://reporter.nih.gov/project-details/10781553",
    "award_remaining": null,
    "termination_date": "2025-04-07",
    "org_name": "MIGRANT CLINICIANS NETWORK, INC.",
    "project_title": "Humanitarian Health Care Network: Bringing the Most Vulnerable to Care",
    "cancellation_source": "HHS reported",
    "lat": 30.266878,
    "lon": -97.788025
}, {
    "FIPS": 48141,
    "reporter_url": "https://reporter.nih.gov/project-details/10597695",
    "award_remaining": 588860.26,
    "termination_date": "2025-03-27",
    "org_name": "UNIVERSITY OF TEXAS EL PASO",
    "project_title": "U-RISE at the University of Texas at El Paso",
    "cancellation_source": "Self reported",
    "lat": 31.770518,
    "lon": -106.504149
}, {
    "FIPS": 48209,
    "reporter_url": "https://reporter.nih.gov/project-details/10207151",
    "award_remaining": 488871.92,
    "termination_date": "2025-03-27",
    "org_name": "TEXAS STATE UNIVERSITY",
    "project_title": "U-RISE at Texas State University",
    "cancellation_source": "Self reported",
    "lat": 29.888774,
    "lon": -97.937445
}, {
    "FIPS": 48029,
    "reporter_url": "https://reporter.nih.gov/project-details/10816503",
    "award_remaining": 90808.0699999999,
    "termination_date": "2025-04-02",
    "org_name": "ST. MARY'S UNIVERSITY",
    "project_title": "U-RISE at St. Mary's University",
    "cancellation_source": "Self reported",
    "lat": 29.451933,
    "lon": -98.560605
}, {
    "FIPS": 48209,
    "reporter_url": "https://reporter.nih.gov/project-details/10936047",
    "award_remaining": 272494.12,
    "termination_date": "2025-04-02",
    "org_name": "TEXAS STATE UNIVERSITY",
    "project_title": "Texas Doctoral Bridge Program",
    "cancellation_source": "Self reported",
    "lat": 29.888774,
    "lon": -97.937445
}, {
    "FIPS": 48201,
    "reporter_url": "https://reporter.nih.gov/project-details/10906657",
    "award_remaining": 30598.19,
    "termination_date": "2025-04-02",
    "org_name": "BAYLOR COLLEGE OF MEDICINE",
    "project_title": "Exploring the functional role of tubulin methylation and its regulation by mes-4/NSD in C. elegans",
    "cancellation_source": "Self reported",
    "lat": 29.70926,
    "lon": -95.400851
}, {
    "FIPS": 48201,
    "reporter_url": "https://reporter.nih.gov/project-details/10767939",
    "award_remaining": 5121751.3499999996,
    "termination_date": "2025-04-02",
    "org_name": "BAYLOR COLLEGE OF MEDICINE",
    "project_title": "YEARS 19 - 23:  BCM POST-BACCALAUREATE RESEARCH EDUCATION PROGRAM",
    "cancellation_source": "Self reported",
    "lat": 29.70926,
    "lon": -95.400851
}, {
    "FIPS": 48201,
    "reporter_url": "https://reporter.nih.gov/project-details/10784451",
    "award_remaining": 217504.16,
    "termination_date": "2025-04-02",
    "org_name": "BAYLOR COLLEGE OF MEDICINE",
    "project_title": "Baylor College of Medicine Initiative for Maximizing Student Development",
    "cancellation_source": "Self reported",
    "lat": 29.70926,
    "lon": -95.400851
}, {
    "FIPS": 49035,
    "reporter_url": "https://reporter.nih.gov/project-details/10897144",
    "award_remaining": 436182.57,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF UTAH",
    "project_title": "Intermountain PREP",
    "cancellation_source": "HHS reported",
    "lat": 40.764542,
    "lon": -111.850317
}, {
    "FIPS": 49035,
    "reporter_url": "https://reporter.nih.gov/project-details/10810815",
    "award_remaining": 1246628.3100000001,
    "termination_date": "2025-03-12",
    "org_name": "UNIVERSITY OF UTAH",
    "project_title": "CTSA UM1 Program at University of Utah",
    "cancellation_source": "HHS reported",
    "lat": 40.764542,
    "lon": -111.850317
}, {
    "FIPS": 50007,
    "reporter_url": "https://reporter.nih.gov/project-details/10883711",
    "award_remaining": 5130709.1500000004,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF VERMONT & ST AGRIC COLLEGE",
    "project_title": "Vermont Center for Cardiovascular and Brain Health",
    "cancellation_source": "HHS reported",
    "lat": 44.478282,
    "lon": -73.201079
}, {
    "FIPS": 51121,
    "reporter_url": "https://reporter.nih.gov/project-details/10873232",
    "award_remaining": 360465.12,
    "termination_date": "2025-03-21",
    "org_name": "VIRGINIA POLYTECHNIC INST AND ST UNIV",
    "project_title": "The BH-Works Suicide Prevention Program for Sexual and Gender Minority Youth",
    "cancellation_source": "Self and HHS reported",
    "lat": 37.233061,
    "lon": -80.421005
}, {
    "FIPS": 51121,
    "reporter_url": "https://reporter.nih.gov/project-details/11057137",
    "award_remaining": 216223.99,
    "termination_date": "2025-03-20",
    "org_name": "VIRGINIA POLYTECHNIC INST AND ST UNIV",
    "project_title": "Daily Impact of Sexual Minority Stress on Alcohol-Related Intimate Partner Violence among Bisexual+ Young Adults: A Couples' Daily Diary Study",
    "cancellation_source": "Self and HHS reported",
    "lat": 37.233061,
    "lon": -80.421005
}, {
    "FIPS": 51760,
    "reporter_url": "https://reporter.nih.gov/project-details/10723404",
    "award_remaining": 11989.99,
    "termination_date": "2025-03-18",
    "org_name": "VIRGINIA COMMONWEALTH UNIVERSITY",
    "project_title": "Using youth-engaged methods to develop and evaluate a measure for disordered eating behaviors in transgender and gender-diverse youth",
    "cancellation_source": "Self and HHS reported",
    "lat": 37.549807,
    "lon": -77.452775
}, {
    "FIPS": 51013,
    "reporter_url": "https://reporter.nih.gov/project-details/10890031",
    "award_remaining": 168922.18,
    "termination_date": "2025-04-01",
    "org_name": "WETA TV 26",
    "project_title": "PBS NewsHour STEM StoryMaker: Project-based learning for youth health literacy and biomedical career awareness through journalism and storytelling",
    "cancellation_source": "HHS reported",
    "lat": 38.84087,
    "lon": -77.086486
}, {
    "FIPS": 51121,
    "reporter_url": "https://reporter.nih.gov/project-details/10849666",
    "award_remaining": 4758359.4500000002,
    "termination_date": "2025-03-21",
    "org_name": "VIRGINIA POLYTECHNIC INST AND ST UNIV",
    "project_title": "Virginia Tech Postbaccalaureate Research Education Program (VT PREP)",
    "cancellation_source": "HHS reported",
    "lat": 37.233061,
    "lon": -80.421005
}, {
    "FIPS": 51540,
    "reporter_url": "https://reporter.nih.gov/project-details/10875573",
    "award_remaining": 23638793.8200000003,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF VIRGINIA",
    "project_title": "Autism Center of Excellence Network: Neurodevelopmental Biomarkers of Late Diagnosis in Female and Gender Diverse Autism",
    "cancellation_source": "HHS reported",
    "lat": 38.050527,
    "lon": -78.500531
}, {
    "FIPS": 51059,
    "reporter_url": "https://reporter.nih.gov/project-details/11023087",
    "award_remaining": 0.0,
    "termination_date": "2025-03-26",
    "org_name": "SOCIETY OF TOXICOLOGY",
    "project_title": "Society of Toxicology Undergraduate Diversity Program",
    "cancellation_source": "HHS reported",
    "lat": 38.948468,
    "lon": -77.332357
}, {
    "FIPS": 51760,
    "reporter_url": "https://reporter.nih.gov/project-details/10852568",
    "award_remaining": 521354.0,
    "termination_date": "2025-03-21",
    "org_name": "VIRGINIA COMMONWEALTH UNIVERSITY",
    "project_title": "VCU National Coordinating Center for Advancing Gender Inclusive Excellence",
    "cancellation_source": "HHS reported",
    "lat": 37.549807,
    "lon": -77.452775
}, {
    "FIPS": 53033,
    "reporter_url": "https://reporter.nih.gov/project-details/10663250",
    "award_remaining": 991194.14,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF WASHINGTON",
    "project_title": "UnBIASED: Understanding Biased patient-provider Interaction And Supporting Enhanced Discourse",
    "cancellation_source": "Self and HHS reported",
    "lat": 47.660307,
    "lon": -122.315168
}, {
    "FIPS": 53033,
    "reporter_url": "https://reporter.nih.gov/project-details/10991343",
    "award_remaining": 1022514.1800000001,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF WASHINGTON",
    "project_title": "Sexual Assault Recovery Among Sexual Minority Women: A Longitudinal, Multi-Level Study",
    "cancellation_source": "Self and HHS reported",
    "lat": 47.660307,
    "lon": -122.315168
}, {
    "FIPS": 53033,
    "reporter_url": "https://reporter.nih.gov/project-details/10816924",
    "award_remaining": 3200000.0,
    "termination_date": "2025-03-24",
    "org_name": "FRED HUTCHINSON CANCER CENTER",
    "project_title": "CoVPN 3008 Multi-Center, Randomized, Efficacy Study of Early vs Deferred Vaccination with COVID-19 mRNA Vaccine in Regions with SARS-CoV-2 Variants of Concern - LC GY18",
    "cancellation_source": "Self and HHS reported",
    "lat": 47.626482,
    "lon": -122.329606
}, {
    "FIPS": 53033,
    "reporter_url": "https://reporter.nih.gov/project-details/10745629",
    "award_remaining": 12647369.0,
    "termination_date": "2025-03-24",
    "org_name": "FRED HUTCHINSON CANCER CENTER",
    "project_title": "CoVPN 3008 2022-2023",
    "cancellation_source": "Self and HHS reported",
    "lat": 47.626482,
    "lon": -122.329606
}, {
    "FIPS": 53033,
    "reporter_url": "https://reporter.nih.gov/project-details/10821340",
    "award_remaining": 938541.5699999999,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF WASHINGTON",
    "project_title": "NNLM Region 5:  Reaching More People in More Ways",
    "cancellation_source": "HHS reported",
    "lat": 47.660307,
    "lon": -122.315168
}, {
    "FIPS": 53033,
    "reporter_url": "https://reporter.nih.gov/project-details/10932323",
    "award_remaining": 111662.27,
    "termination_date": "2025-03-10",
    "org_name": "SEATTLE CHILDREN'S HOSPITAL",
    "project_title": "Improving Vaccine Delivery in Hospitalized Children",
    "cancellation_source": "HHS reported",
    "lat": 47.66243,
    "lon": -122.282291
}, {
    "FIPS": 53075,
    "reporter_url": "https://reporter.nih.gov/project-details/10540229",
    "award_remaining": 409142.41,
    "termination_date": "2025-03-24",
    "org_name": "WASHINGTON STATE UNIVERSITY",
    "project_title": "Marshallese: Alternate Surveillance for COVID-19 in a Unique Population",
    "cancellation_source": "HHS reported",
    "lat": 46.728892,
    "lon": -117.155742
}, {
    "FIPS": 53033,
    "reporter_url": "https://reporter.nih.gov/project-details/10995512",
    "award_remaining": 17972.8,
    "termination_date": "2025-03-18",
    "org_name": "UNIVERSITY OF WASHINGTON",
    "project_title": "Prevention of Chlamydia trachomatis infections: Evaluation of vaccination and post-exposure prophylactic antibiotic use as population-level strategies",
    "cancellation_source": "HHS reported",
    "lat": 47.660307,
    "lon": -122.315168
}, {
    "FIPS": 53033,
    "reporter_url": "https://reporter.nih.gov/project-details/10794134",
    "award_remaining": 47535.0,
    "termination_date": "2025-03-12",
    "org_name": "UNIVERSITY OF WASHINGTON",
    "project_title": "Securing Health Equity: Philosophical Foundations for Equality and Social Justice in Public Health and Health Care",
    "cancellation_source": "HHS reported",
    "lat": 47.660307,
    "lon": -122.315168
}, {
    "FIPS": 53033,
    "reporter_url": "https://reporter.nih.gov/project-details/11002931",
    "award_remaining": 135282.01,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF WASHINGTON",
    "project_title": "Kabawil: Adapting an Intervention to Reduce Intersectional Stigmas among Indigenous Sexual Minority Men and Traditional Healers in Mesoamerica",
    "cancellation_source": "HHS reported",
    "lat": 47.660307,
    "lon": -122.315168
}, {
    "FIPS": 53033,
    "reporter_url": "https://reporter.nih.gov/project-details/11005651",
    "award_remaining": 224666.4,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF WASHINGTON",
    "project_title": "Applying a Behavioral Economic Approach on PrEP and Hormone Options among Transgender Women",
    "cancellation_source": "HHS reported",
    "lat": 47.660307,
    "lon": -122.315168
}, {
    "FIPS": 53033,
    "reporter_url": "https://reporter.nih.gov/project-details/10634713",
    "award_remaining": 824202.49,
    "termination_date": "2025-03-24",
    "org_name": "SEATTLE CHILDREN'S HOSPITAL",
    "project_title": "Viral and immune kinetics in rhinovirus infection following hematopoietic cell transplantation",
    "cancellation_source": "HHS reported",
    "lat": 47.66243,
    "lon": -122.282291
}, {
    "FIPS": 53033,
    "reporter_url": "https://reporter.nih.gov/project-details/11052511",
    "award_remaining": 657779.52,
    "termination_date": "2025-04-01",
    "org_name": "FRED HUTCHINSON CANCER CENTER",
    "project_title": "Evaluating a Multilevel Communication Campaign to Increase HIV Vaccine Trial Enrollment ",
    "cancellation_source": "HHS reported",
    "lat": 47.626482,
    "lon": -122.329606
}, {
    "FIPS": 53033,
    "reporter_url": "https://reporter.nih.gov/project-details/10814239",
    "award_remaining": 37129.42,
    "termination_date": null,
    "org_name": "SEATTLE CHILDREN'S HOSPITAL",
    "project_title": "Using telehealth to improve access to gender-affirming care for BIPOC and rural gender diverse youth",
    "cancellation_source": "Self reported",
    "lat": 47.66243,
    "lon": -122.282291
}, {
    "FIPS": 55079,
    "reporter_url": "https://reporter.nih.gov/project-details/10891703",
    "award_remaining": 165808.09,
    "termination_date": "2025-03-21",
    "org_name": "MEDICAL COLLEGE OF WISCONSIN",
    "project_title": "Understanding Breast Cancer Risk and Screening in Transgender Persons through a Pilot Breast Cancer Screening Program",
    "cancellation_source": "Self and HHS reported",
    "lat": 43.04575,
    "lon": -88.020374
}, {
    "FIPS": 55025,
    "reporter_url": "https://reporter.nih.gov/project-details/11172536",
    "award_remaining": 1072747.55,
    "termination_date": "2025-03-20",
    "org_name": "UNIVERSITY OF WISCONSIN-MADISON",
    "project_title": "A multidimensional investigation of social support for transgender and nonbinary people and its impacts on health and well-being: Measurement development using community engagement",
    "cancellation_source": "Self and HHS reported",
    "lat": 43.068519,
    "lon": -89.400858
}, {
    "FIPS": 55025,
    "reporter_url": "https://reporter.nih.gov/project-details/10913548",
    "award_remaining": 1326556.1399999999,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF WISCONSIN-MADISON",
    "project_title": "A longitudinal study investigating TDM and adolescent health and development: Brain, Behavior and well-Being",
    "cancellation_source": "HHS reported",
    "lat": 43.068519,
    "lon": -89.400858
}, {
    "FIPS": 55079,
    "reporter_url": "https://reporter.nih.gov/project-details/10908986",
    "award_remaining": 785698.28,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF WISCONSIN MILWAUKEE",
    "project_title": "The Impact of Minority Stress on Alcohol-Related Sexual Assault among Sexual Minority College Students: An Intersectional, Mixed-Methodological Study",
    "cancellation_source": "HHS reported",
    "lat": 43.075704,
    "lon": -87.877999
}, {
    "FIPS": 55079,
    "reporter_url": "https://reporter.nih.gov/project-details/10886031",
    "award_remaining": 243736.87,
    "termination_date": "2025-03-21",
    "org_name": "MEDICAL COLLEGE OF WISCONSIN",
    "project_title": "3T-Prevent: Piloting a multi-level, combination intervention strategy to expand HIV and bacterial STI prevention",
    "cancellation_source": "HHS reported",
    "lat": 43.04575,
    "lon": -88.020374
}, {
    "FIPS": 55025,
    "reporter_url": "https://reporter.nih.gov/project-details/10327846",
    "award_remaining": 5033041.46,
    "termination_date": "2025-03-24",
    "org_name": "UNIVERSITY OF WISCONSIN-MADISON",
    "project_title": "PanCorVac (Center for Pan-Coronavirus Vaccine Development)",
    "cancellation_source": "HHS reported",
    "lat": 43.068519,
    "lon": -89.400858
}, {
    "FIPS": 55025,
    "reporter_url": "https://reporter.nih.gov/project-details/10669608",
    "award_remaining": 267664.75,
    "termination_date": "2025-03-24",
    "org_name": "UNIVERSITY OF WISCONSIN-MADISON",
    "project_title": "Coronavirus RNA synthesis by multicomponent protein machines",
    "cancellation_source": "HHS reported",
    "lat": 43.068519,
    "lon": -89.400858
}, {
    "FIPS": 55079,
    "reporter_url": "https://reporter.nih.gov/project-details/10625526",
    "award_remaining": 1335246.5700000001,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF WISCONSIN MILWAUKEE",
    "project_title": "Alcohol, minority stress, and intimate partner violence: Temporal and prospective associations in sexual minority young adults",
    "cancellation_source": "HHS reported",
    "lat": 43.075704,
    "lon": -87.877999
}, {
    "FIPS": 55079,
    "reporter_url": "https://reporter.nih.gov/project-details/10900276",
    "award_remaining": 0.0,
    "termination_date": "2025-03-21",
    "org_name": "SOCIETY OF BEHAVIORAL MEDICINE",
    "project_title": "Society of Behavioral Medicine 2024 Annual Meeting & Scientific Sessions",
    "cancellation_source": "HHS reported",
    "lat": 43.041215,
    "lon": -87.904829
}, {
    "FIPS": 55079,
    "reporter_url": "https://reporter.nih.gov/project-details/11046891",
    "award_remaining": 413510.27,
    "termination_date": "2025-03-21",
    "org_name": "UNIVERSITY OF WISCONSIN MILWAUKEE",
    "project_title": "Using digital photovoice to explore the relationships between social media content and suicidality among transgender adolescents",
    "cancellation_source": "HHS reported",
    "lat": 43.075704,
    "lon": -87.877999
}, {
    "FIPS": 55079,
    "reporter_url": "https://reporter.nih.gov/project-details/10923472",
    "award_remaining": 15900.99,
    "termination_date": "2025-03-18",
    "org_name": "MEDICAL COLLEGE OF WISCONSIN",
    "project_title": "Understanding Patient Level Implementation Determinants Related to Long-acting Injectable HIV Pre-Exposure Prophylaxis among Young Men Who Have Sex with Men Living in Rural Areas",
    "cancellation_source": "HHS reported",
    "lat": 43.04575,
    "lon": -88.020374
}, {
    "FIPS": 55079,
    "reporter_url": "https://reporter.nih.gov/project-details/11036897",
    "award_remaining": 779771.0,
    "termination_date": "2025-03-21",
    "org_name": "MEDICAL COLLEGE OF WISCONSIN",
    "project_title": "Cardiometabolic Impact of Gender-Affirming Hormone Therapy in Transmasculine Young Adults",
    "cancellation_source": "HHS reported",
    "lat": 43.04575,
    "lon": -88.020374
}, {
    "FIPS": 55079,
    "reporter_url": "https://reporter.nih.gov/project-details/10802311",
    "award_remaining": 273951.08,
    "termination_date": "2025-03-27",
    "org_name": "MARQUETTE UNIVERSITY",
    "project_title": "U-RISE at Marquette University",
    "cancellation_source": "Self reported",
    "lat": 43.038728,
    "lon": -87.923307
}];


export const GRANT_LOSSES = grant_losses.filter(g => g)