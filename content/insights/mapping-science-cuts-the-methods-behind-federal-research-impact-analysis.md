---
title: "Mapping Science Cuts: The Methods Behind Federal Research Impact Analysis"
slug: How SCIMaP researchers transform federal grant records into
  community-level visualizations of economic impact
date: MAY 6, 2026
author: SCIMaP Team
summary: The SCIMaP team explains the methods used to analyze the data behind
  mapping federal science cuts.
image: /images/image1.jpg
tags: []
figures:
  - image: /images/image1.jpg
    caption: "Figure 1: This map shows the baseline positive economic impact of
      science funding flowing outward from research institutions in the Houston,
      TX area. Baseline impact is calculated based on inflation-adjusted NIH and
      NSF funding from 2020-2024. The proposed FY2027 budget cuts would reduce
      the economic benefits of science funding spreading across communities."
---
When the federal government proposes deep cuts to scientific research funding, the consequences spread far beyond universities, research hubs, and urban areas. Jobs vanish. Communities lose economic stability. Clinical trials stall. Measuring the real-world impact of these cuts across the country is difficult. How do you estimate which regions will suffer the most? What do job losses look like when distributed across commuter networks?

The [Science & Community Impacts Mapping Project (SCIMaP) ](http://scienceimpacts.org)data team has developed methods to answer these questions. By combining geospatial analysis, economic modeling, and data on worker commuting patterns, they generate detailed projections of economic impact by state, county, and congressional district. 

**Geographic Mapping of Institutions Working on Federal Grants**

The first challenge is knowing where the money is actually going. The team uses GIS (geographic information systems) to geolocate each grant to census tracts, the smallest geographic unit the U.S. Census Bureau recognizes. This step is significant: it allows the team to map funding from the National Institutes of Health (NIH) and the National Science Foundation (NIH) to local areas, revealing funding patterns hidden within aggregate data.

**Converting Federal Funding into Economic Impact**

Once grants are geolocated, the data team estimates the economic benefits associated with federally funded R&D. As [Dr. Mallory Harris](https://scienceimpacts.org/about), SCIMaP’s senior data scientist, explains, “When these federal science agencies spend money to fund research, they create jobs, facilitate purchasing materials, train people, and encourage innovation. Together, federally funded R&D advances research and produces broader, near-term economic benefits.”

The team relied on well-established multipliers to convert federal funding awards into economic activity. Every dollar that the NIH invests in research, produces roughly $2.57 of economic activity in return.This multiplier varies by state and is often higher in rural areas and red states, demonstrating even greater economic gains from science funding. Likewise for every dollar NSF spends, there is roughly $2.64 of economic return on investment. The multipliers also help to translate spending into jobs by calibrating the jobs supported to economic activity.

**Accounting for Commuter Flows**

To reveal how cuts to grant at specific research institutions ripple out to impact surrounding communities, the SCIMaP team looks at where Americans live and work. The SCIMaP data team used the U.S. Census Bureau’s [Longitudinal Employer-Household Dynamics (LEHD)](https://lehd.ces.census.gov/) data to integrate realistic commuting patterns into their analysis. For example, a researcher employed at the [University of Cincinnati](https://www.uc.edu/) or the [Cincinnati Children’s Medical Center](https://www.cincinnatichildrens.org/) in Ohio, for example, might live in Cincinnati or in adjacent counties, a few or many miles away, perhaps even in another state; leading to economic impact in regions that extend well beyond the research institution. 

To model the impacts of commuter flows, SCIMaP uses open LEHD data at the census block level—the smallest geographic unit available. This data shows, for every block in the country, how many people commute in for work and where they are commuting from. The data accounts for employment in different industries across different “firms” (locations that employ workers).

The data team aggregated this block-level data up to Congressional Districts and counties, then distributed the economic losses from research funding cuts according to these commuter patterns. The result was striking. 

As SCIMaP’s GIS analyst, [Dr. Clio Andris](https://scienceimpacts.org/about) describes, “Places like Annapolis, Maryland would not have appeared as sites vulnerable to federal funding cuts when looking at institutions alone, but when we distributed the flows, we saw that federal grant support to institutions located in Baltimore and Washington, D.C. was impacting Annapolis and Anne Arundel County more broadly. When federal funding gets cut, the Annapolis community will feel the impact.”

Using Harris County, Texas (which includes the city of Houston), as another example (see figure 1) reveals the extent to which people commute in from adjacent counties to work at institutions including the [University of Texas MD Anderson Cancer Medical Center](https://www.mdanderson.org/about-md-anderson/our-locations/texas-medical-center.html), the [University of Houston](https://www.uh.edu/), [Baylor College of Medicine](https://www.bcm.edu/), and [Rice University](https://www.rice.edu/). As a result, cuts to these research centers affect more than the city of Houston directly, they affect locations where the researchers live and commute from.

**Choosing Geographic Scale**

The final methodological decision involved determining geographic scales to present: state, county and congressional districts. The team [presents data at all three scales](https://scienceimpacts.org/fy27). Regardless of which scale you choose, it is immediately apparent that research funding impacts are far more widespread than many assume. Funding impacts shows up almost everywhere—rural areas, suburbs, small cities, large metro areas. Ongoing and proposed cuts are not concentrated in a handful of cities, but rather spread out nationwide.

**Why This Matters**

This methodology reveals how federal investment in science has broad geographic effects on local communities. Funding cuts to a given university affects not just scientists, but all people who work, live, and spend money in surrounding communities. The analysis reveals that impacts are not limited to obvious research hotspots. Suburbs around major research centers, exurban areas, and regions within commuting distances of universities feel the effects. 

For example, SCIMaP estimates that the Mayo Clinic located in Minnesota District 1 could lose nearly $145 million in the proposed White House FY 2027 NSF and NIH budget and that would result  in more than 500 lost jobs. Likewise, In Tuscaloosa and Jefferson counties in Alabama near Birmingham, funding cuts would exceed $187 million and account for 800 lost jobs in the White House FY 2027 budget proposal. Finally, by translating abstract budget numbers into jobs lost and economic impact, the maps give policymakers and advocates concrete language for discussing what’s at stake in their communities.

The workflow is designed to be nimble. Because policy changes happen quickly, the SCIMaP team has developed analytical pipelines designed to assess impacts as new proposals emerge. The code and data is publicly available and includes reproducible methods to understand science funding’s real-world footprint amidst high volatility for America’s R&D ecosystem.
