# Science & Community Impacts Mapping Project (SCIMaP)

This repo powers the website at [https://scienceimpacts.org/](https://scienceimpacts.org/).

SCIMaP is an interdisciplinary project that aims to help Americans explore how science and health research fuels the economy, supports jobs, and improves health outcomes. Through interactive, data-driven visualizations, we show the impacts of scientific research and how proposed changes to federal funding can affect science, the economy, and healthcare.

## The Team

We are an interdisciplinary team of researchers from the University of Maryland, College Park (Dr. Joshua Weitz and Dr. Mallory Harris), the University of Pennsylvania (Dr. Alyssa Sinclair, Dr. Emily Falk, and Dr. Danielle Cosme), the University of Utah (Dr. Angela Fagerlin), the Georgia Institute of Technology (Dr. Clio Andris), and University of Oregon (Dr. Ellen Peters). We have expertise in different areas—biology, psychology, neuroscience, communication, and geographic information science— united by our common goal.

## Mission

The White House has ordered large cuts to federal funding for scientific research. These changes include a proposal to reduce support for all health-related research nationwide, and cancellations of many grants for specific research projects. We aim to share how these proposed changes impact science, the economy, and healthcare.

Our [recent correspondence piece](https://www.nature.com/articles/s41562-025-02238-x) published in Nature Human Behaviour describes our approach to communicating the impact of these funding cuts nationwide.

## Data and Methodology

We track the impact of funding cuts in three main areas:

*   **Cancelled and Frozen Grants:** We track NIH grants that have been cancelled or frozen using the [Grant Watch database](https://grant-watch.us/nih-data.html).
*   **Indirect Costs:** We estimate the future impact of proposed changes that would cap funding for indirect costs at 15%.
*   **Proposed FY2026 Budget:** We compare the proposed NIH FY 2026 budget to the FY2024 budget to estimate the proportion of funding lost.

We use a multiplier of 2.56 to estimate the local economic impact of these cuts, based on a [recent report](https://www.unitedformedicalresearch.org/wp-content/uploads/2025/03/UMR_NIH-Role-in-Sustaining-US-Economy-FY2024-2025-Update.pdf). Our data and code are [publicly available here](http.doi.org/10.17605/OSF.IO/H398E).

For a more detailed methodology, please see our preprint on [medrxiv](https://www.medrxiv.org/content/10.1101/2025.07.24.25332092v1).

## Codebase Overview

This repository is organized as follows:

*   `src/`: Contains the frontend React application, built with Vite.
*   `python/`: Includes Python scripts and notebooks for data processing and analysis.
*   `functions/`: Holds Cloudflare serverless functions.

The project uses the following technologies:

*   **Hosting:** Cloudflare Pages and Workers
*   **Map Rendering:** Deck.GL
*   **Geospatial Data:** Titiler and various Python libraries
*   **Frontend:** React, TypeScript, Vite

## Contact Us

For questions, comments, and press inquiries, please email [contact@scienceimpacts.org](mailto:contact@scienceimpacts.org).

To receive email updates about major website releases, reports, and publications, [please sign up here](https://upenn.co1.qualtrics.com/jfe/form/SV_5vDEXlLWG9IyWmW).

## News and Policy Mentions

SCIMaP has been featured in a variety of news outlets and policy discussions. For a full list, please see the "News and Policy Mentions" section on our [About page](https://scienceimpacts.org/).

## Data Updates

SCIMaP updates its data and visualization to reflect the current state of funding cuts. For the full data history, you can reference the [publicly available data at the Open Science Framework link](http://doi.org/10.17605/OSF.IO/H398E).
