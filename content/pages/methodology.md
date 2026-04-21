---
hero_title: "Methodology"
hero_subtitle: "How we track and analyze the impact of science funding cuts"

overview: "We source data on historical grants (active between Fiscal Year 2020 and Fiscal Year 2024) from the National Institutes of Health (NIH) and National Science Foundation (NSF) [NIH RePORTER](https://reporter.nih.gov/) and [NSF Awards Simple Search](https://www.nsf.gov/awardsearch/) respectively. Data on terminated grants are from [Grant Witness](https://grantwitness.org/)."

geolocating_intro: "We map grant data based on institutional coordinates provided by NIH (latitude, longitude) and institution name provided by NSF geolocated using the Google API and OpenStreetMap, assigning grants to census tracts using QGIS and ArcPro."
geolocating_details:
  - "Although satellite campuses and teaching hospitals located some distance from the main campus are sometimes disaggregated (e.g., University of Miami main campus versus University of Miami School of Medicine; The University of Texas at San Antonio Health Science Center versus The University of Texas San Antonio), the coordinates provided are often administrative buildings rather than particular research facilities."
  - "Some institutions may have research facilities spread throughout the region (e.g., Johns Hopkins and UCLA) or conduct projects in areas that are distant from the institution."

economic_multiplier_intro: "For estimates of economic impacts in communities, resulting from changes to scientific funding, we multiply raw dollar values by agency-specific multipliers."
economic_multiplier_details:
  - "For NIH, we apply state-specific economic multipliers derived from a [recent and widely-cited report](https://unitedformedicalresearch.org/wp-content/uploads/2025/01/UMR-The-Economic-Impact-of-NIH-in-2025_FINAL.pdf), which found that every dollar invested in NIH in 2025 generated between $1.97 and $5.30 (national average: $2.57) in new economic activity. To estimate the number of jobs lost due to funding cuts, we use the ratio of the number of jobs supported / research funds awarded in the 2025 fiscal year at the state level."
  - "For NSF, we apply a uniform national multiplier of $2.64 in new economic activity generated per dollar spent and $72,000 spent per job supported based on median estimates from a March 2026 [report](https://www.nsf.gov/evaluation/reports) from the Evaluation and Assessment Capability of the National Science Foundation."

commuter_flows_intro: "We redistribute losses across geographic units (e.g., counties and congressional districts) based on the number of commuters who live in a given unit and work in the census tract containing the point of the geolocated address of an affected institution."
commuter_flows_details:
  - "We use commuter flows for all job types (JT00) from the Origin-Destination Employment Statistics (LODES)-Longitudinal Employer Household Dynamics (LEHD) data set (version LODES8) provided by the U.S. Census."
  - "We use data from 2016, which includes all states (Michigan, Alaska and Mississippi have not had full coverage since 2016)."

baseline_intro: "To illustrate the historic benefits of scientific research funding and identify potential discrepancies in current funding compared to prior years, we retrieve all grants with budgets spanning FY2020 - FY2024 from NIH and NSF."
baseline_details:
  - "The total budget of grants with budget periods spanning multiple fiscal years are split across fiscal years, assuming spending is proportional to the fraction of the grant's award period in a given year. We then find the total spending within a given region per fiscal year and the average across the specified five-year period."
  - "In addition to total funding, we report baseline spending broken down by institutes and centers within the NIH or directorates within NSF."
  - "We include all eight NSF directorates, the Office of Integrative Activities, and the Office of International Science and Engineering within the Office of the Director. We include all NIH institutes, plus the National Center for Complementary and Integrative Health, the National Center for Advancing Translational Sciences, and the Fogarty International Center."

fy2027_intro: "The White House budget proposals for FY2027 include large cuts to both NIH and NSF. We estimate the economic losses associated with the proposed cuts by comparing the proposed budgets to historic funding."
fy2027_details:
  - "We compare the White House's proposed NSF FY2027 budget to the average FY2020 - FY2025 budgets by Office and Directorate to estimate the proportion of funding lost. We calculate averages for the Directorate for Technology, Innovation and Partnerships beginning in FY 2022, the first year that it received funding."
  - "We assume that cuts will be distributed evenly across regions and research topics and multiply the proportion of the budget cuts by Office or Directorate by the total commuter-adjusted funding in each region by Office/Directorate from FY2020 - FY2024 (excluding FY2025 due to disruptions to funding in the form of grant freezes and terminations). We report the total economic losses across Offices and Directorates."
  - "We proceed similarly for NIH, comparing the proposed FY2027 research budget to the FY2025 budget without disaggregating by Institutes and Centers. All dollar values are inflation-adjusted to 2026."

disrupted_intro: "Many NIH and NSF grants for biomedical and scientific research have already been cancelled (formally terminated) or frozen (funds withheld without justification), interrupting ongoing studies and clinical trials."
disrupted_details:
  - "To track cancelled and frozen grants, we use the [Grant Witness](https://grantwitness.org/) database, which is based on reports from government sources and researchers. For cancelled and frozen grants, we assume that losses are equivalent to the remaining grant funds that were not spent at the time of cancellation."
  - "For each week since grant terminations began on February 28, 2025, we report the realized losses (removing grants that had been unfrozen or reinstated) and cumulative impacts (all grants that were ever disrupted) through the specific week."
  - "Please note that changes to grants are ongoing, so data are subject to change. There can also be lags between when a grant is affected and when the change appears in the database."
  - "For a subset of multi-year supplements and subawards, only the budget for the current year is reported, leading us to underestimate the actual amount of funding lost."
  - "Cancelled and frozen grants from adjacent divisions within the same institution (e.g., the main campus and medical school of the same university) are combined under one broader institution label (e.g., \"Columbia University\")."

indirect_costs_intro: "Research grants include funding for research infrastructure (also known as indirect costs), which covers critical support such as facilities and safety checks. While NIH and NSF grants both include this funding, we focus only on NIH for this analysis."
indirect_costs_details:
  - "Indirect costs are calculated as some proportion of that grant's value, determined through negotiations between each institution and the NIH."
  - "A proposed change would have capped the indirect cost rate at 15%, well below current realized levels of approximately 45% of direct costs. That policy is currently blocked following an injunction by a federal judge."
  - "To estimate decreases in funding due to the proposed cap on indirect costs, we calculate the difference between funding for indirect costs across grants active in fiscal year 2024 and proposed funding with a 15% maximum."

data_sources:
  - name: "NIH RePORTER"
    url: "https://reporter.nih.gov/"
  - name: "NSF Awards Simple Search"
    url: "https://www.nsf.gov/awardsearch/"
  - name: "United for Medical Research"
    url: "https://unitedformedicalresearch.org/"
  - name: "NSF Economic Impacts: Literature Review"
    url: "https://www.nsf.gov/evaluation/reports"
  - name: "US Census - LODES"
    url: "https://lehd.ces.census.gov/data/"
  - name: "Grant Witness"
    url: "https://grantwitness.org/"
---
