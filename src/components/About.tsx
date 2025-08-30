import {Container, Title, Text, Accordion, AccordionItem, Group} from '@mantine/core';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import {isMobile} from "react-device-detect";
import NewsItem from "./NewsItem.tsx";

const textOrder = isMobile ? 4 : 3;

interface CopyrightHeaderProps {
    year?: number;
}

function CopyrightHeader({year = 2025}: CopyrightHeaderProps) {
    return (
        <Title order={6} mb="md">
            <Group gap={4} justify="center" wrap="nowrap">
                <Text component="a" href="https://scienceimpacts.org/" inherit>
                    SCIMaP
                </Text>
                <Text span inherit>
                    © {year} is licensed under
                </Text>
                <Text component="a" href="https://creativecommons.org/licenses/by/4.0/" inherit>
                    CC BY 4.0
                </Text>
                <img
                    src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"
                    alt="Creative Commons License"
                    style={{maxWidth: '1em', maxHeight: '1em'}}
                />
                <img
                    src="https://mirrors.creativecommons.org/presskit/icons/by.svg"
                    alt="Attribution License"
                    style={{maxWidth: '1em', maxHeight: '1em'}}
                />
            </Group>
        </Title>
    );
}

const newsItems: {
    date: string,
    title: string,
    url: string,
    isOngoing?: boolean
}[] = [
    {
        date: "Ongoing",
        title: "Stand Up for Science, \"Powered by SCIMaP\"",
        url: "https://www.standupforscience.net/resources",
        isOngoing: true
    },
    {
        date: 'July 29th, 2025',
        title: "SCIMaP Visualizes the True Cost of Science Funding Cuts",
        url: "https://www.the-scientist.com/scimap-visualizes-the-true-cost-of-science-funding-cuts-73211",
    },
    {
        date: "July 23rd, 2025",
        title: "Center for American Progress",
        url: "https://www.americanprogress.org/article/mapping-federal-funding-cuts-to-us-colleges-and-universities/"
    },
    {
        date: "July 23rd, 2025",
        title: "Your Local Epidemiologist",
        url: "https://yourlocalepidemiologist.substack.com/p/nih-the-quiet-engine-of-science-is"
    },
    {
        date: "July 23, 2025",
        title: "Inside Higher Education",
        url: "https://www.insidehighered.com/news/faculty-issues/research/2025/07/23/feds-axed-grants-across-red-blue-states-report-finds"
    },
    {
        date: "July 3rd, 2025",
        title: "STAT News",
        url: "https://www.statnews.com/2025/07/03/nih-cuts-grant-restoration-complicated-by-limits-to-court-order-trump-dei-restrictions/"
    },
    {
        date: "June 26, 2025",
        title: "Research!America",
        url: "https://www.researchamerica.org/marys-letters/whats-at-risk/"
    },
    {
        date: "June 20, 2025",
        title: "Tampa Bay Newspapers Weekly",
        url: "https://www.tbnweekly.com/opinion/article_acaccd5e-ef10-4434-8bb6-cadf464009f9.html"
    },
    {
        date: "June 18, 2025",
        title: "Association of Health Care Journalists",
        url: "https://healthjournalism.org/blog/2025/06/mapping-local-economic-consequences-of-federal-cuts-to-nih-how-they-did-it/"
    },
    {
        date: "June 2, 2025",
        title: "Becker's Hospital Review",
        url: "https://www.beckershospitalreview.com/hospital-management-administration/hhs-faces-31b-cuts-in-proposed-fy-26-budget-6-notes/"
    },
    {
        date: "April 27, 2025",
        title: "Houston Chronicle",
        url: "https://www.pressreader.com/usa/houston-chronicle-sunday/20250427/282071987764907?srsltid=AfmBOop1ZNOR-CGUQicuE6yLCwEGiKHhbzzOFTsF2b8vh_ikZ2JHgP72"
    },
    {
        date: "April 18, 2025",
        title: "Open Campus",
        url: "https://www.opencampus.org/2025/04/18/the-ripple-effect-of-cuts-to-nih-research-funding/"
    },
    {
        date: "April 17, 2025",
        title: "Axios Richmond",
        url: "https://www.axios.com/local/richmond/2025/04/17/trump-health-funding-cuts-virginia"
    },
    {
        date: "April 16, 2025",
        title: "Modern Healthcare",
        url: "https://www.modernhealthcare.com/politics-policy/nih-funding-cuts-counties-cook-suffolk"
    },
    {
        date: "April 11, 2025",
        title: "Axios Raleigh",
        url: "https://www.axios.com/local/raleigh/2025/04/11/nih-cuts-would-hurt-raleigh-durham-wake-orange"
    },
    {
        date: "April 9, 2025",
        title: "Axios",
        url: "https://www.axios.com/2025/04/09/nih-cuts-nationwide-impact-county-map"
    },
    {
        date: "April 2, 2025",
        title: "MassLive",
        url: "https://www.axios.com/2025/04/09/nih-cuts-nationwide-impact-county-map"
    },
    {
        date: "March 28, 2025",
        title: "Flowing Data",
        url: "https://flowingdata.com/2025/03/28/economic-impact-of-federal-health-research-cuts/"
    }
];


function About() {

    return (
        <Container size="md">
            <Title mt="md" mb={'sm'}>
                Science & Community Impacts Mapping Project (SCIMaP)
            </Title>
            <CopyrightHeader/>

            <Accordion variant="contained" radius="md">
                <AccordionItem value="goal">
                    <Accordion.Control>
                        <Title order={textOrder}>Goal</Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            Science transforms our world. However, the process of doing science and the impacts of
                            scientific research are often hidden from view. Through interactive, data-driven
                            visualizations, we aim to help Americans explore how science and health research fuels the
                            economy, supports jobs, and improves health outcomes.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>

                <AccordionItem value="team">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            The Team
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            We are an interdisciplinary team of researchers from the University of Maryland, College
                            Park (Dr. Joshua Weitz and Dr. Mallory Harris), the University of Pennsylvania (Dr. Alyssa
                            Sinclair, Dr. Emily
                            Falk, and Dr. Danielle Cosme), the University of Utah (Dr. Angela Fagerlin), the Georgia
                            Institute of Technology (Dr. Clio Andris), and University of Oregon (Dr. Ellen Peters). We
                            have expertise in different areas—biology, psychology, neuroscience, communication, and
                            geographic information science— united by our common goal.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>

                <AccordionItem value="mission">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            Mission
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            The White House has ordered large cuts to federal funding for scientific research. These
                            changes include a proposal to reduce support for all health-related research nationwide, and
                            cancellations of many grants for specific research projects. We aim to share how these
                            proposed changes impact science, the economy, and healthcare.
                        </Text>
                        <Text ta={"left"} mt={'sm'}>
                            Our <a href='https://www.nature.com/articles/s41562-025-02238-x' target='_blank'>recent
                            correspondence piece</a> published in Nature Human Behaviour describes our approach to
                            communicating the impact of these funding cuts nationwide.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="current-impact-term-grants">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            Current Impact: Cancelled and Frozen Grants
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            Many NIH grants for health research have already been cancelled (formally terminated) or
                            frozen (funds withheld without justification), interrupting ongoing
                            studies and clinical trials. To track canceled and frozen grants, we use the <a
                            href={"https://grant-watch.us/nih-data.html"} target={"_blank"}> Grant Watch database</a>,
                            which is based on reports from government sources and researchers. Please note that changes
                            to grants are ongoing, so data are subject to change. Grants that are restored or unfrozen
                            are removed from our loss estimates. There can also be lags between when a grant is affected
                            and when the change appears in the database.
                        </Text>
                        <Text ta={"left"} mt={'sm'}>
                            For cancelled and frozen grants, we assume that losses are equivalent to the remaining grant
                            funds
                            that were not spent at the time of cancellation. Cancelled and frozen grants from adjacent
                            divisions
                            within the same institution (e.g., the main campus and medical school of the same
                            university) are combined under one broader institution label (e.g., “Columbia University”).
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="future-impact-indirect-costs">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            Future Impact: Indirect Costs
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            One proposed change would greatly reduce NIH funding that covers <a
                            href={"https://grants.nih.gov/grants/guide/notice-files/NOT-OD-25-068.html"}
                            target={"_blank"}>“indirect costs” of
                            research</a>. Funding for indirect costs helps pay for essential facilities, equipment,
                            skilled
                            staff, and safety checks needed across many research projects. Medical research would not be
                            possible without funding to cover indirect costs.
                        </Text>
                        <Text ta={"left"} mt={'sm'}>
                            At many institutions, indirect costs are 40%-60% of the budget allocated to direct costs of
                            research. The proposed changes would cap funding for indirect costs at 15%, taking back
                            billions of dollars that were promised to the states. States have sued to challenge the
                            order, arguing that the changes are unlawful. Currently, a federal judge has issued <a
                            href={"https://storage.courtlistener.com/recap/gov.uscourts.mad.280590/gov.uscourts.mad.280590.25.0.pdf"}
                            target={"_blank"}>an
                            injunction</a> to temporarily block the changes. To estimate decreases in funding, we
                            calculate
                            the difference between current funding for indirect costs and proposed funding with a 15%
                            maximum for current NIH grants. We source our data from a <a target={"_blank"}
                                                                                         href={"https://report.nih.gov/award/index.cfm"}>public
                            database of NIH grants</a> that
                            were active in 2024.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="what-if-cuts">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            Estimating Local Economic Impact
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            For estimates of economic losses in communities, resulting from changes to funding for
                            indirect costs as well as cancelled/frozen grants, we multiply direct loss values by 2.56.
                            This
                            multiplier is derived from <a target={"_blank"}
                                                          href={"https://www.unitedformedicalresearch.org/wp-content/uploads/2025/03/UMR_NIH-Role-in-Sustaining-US-Economy-FY2024-2025-Update.pdf"}>a
                            recent report</a>, which found that every dollar invested in NIH
                            generated $2.56 in new economic activity in 2024. To estimate the number of jobs that would
                            be lost if NIH funding is cut, we used the ratio of the number of jobs supported / research
                            funds awarded in the 2024 fiscal year. We also use <a target={"_blank"}
                                                                                  href={"https://lehd.ces.census.gov/data/"}>Census
                            data on where U.S. commuters live
                            and work</a> to estimate how economic activity generated in each county can spread to
                            adjacent
                            counties.
                        </Text>
                        <Text ta={'left'} mt={'sm'}>
                            Note that cancelled and frozen grants do not count toward the estimates of future losses
                            that would
                            result from a 15% cap on indirect costs, to prevent double-counting. This means that
                            estimates of total loss are not necessarily the sum of future and current losses.
                        </Text>
                        <Text ta={"left"} mt="sm">
                            Our approach is similar to that implemented in <a
                            href={"https://www.nytimes.com/interactive/2025/02/13/upshot/nih-trump-funding-cuts.html"}
                            target={"_blank"}>The Upshot</a> and in policy analysis by higher
                            education specialist, <a
                            href={"https://jamessmurphy.com/2025/02/09/the-impact-of-an-nih-15-indirect-cost-rate/"}>James
                            Murphy</a>. Both of these analyses focused on institution-specific
                            and state-level impacts using similar approaches to estimate impacts of cuts to
                            NIH-negotiated indirect cost rates on medical research. Our approach combines these methods
                            with US census data and interactive visualizations to engage with impacts at county levels
                            nationwide. Our data and code are <a href={"http://doi.org/10.17605/OSF.IO/H398E"}
                                                                 target={"_blank"}>publicly available here</a>. Detailed
                            methodology is described in a preprint
                            available via <a href={"https://www.medrxiv.org/content/10.1101/2025.07.24.25332092v1"}
                                             target={"_blank"}>medrxiv</a>, entitled ‘Economic Loss due to Health
                            Funding
                            Cuts as Distributed Across Geospatial Units’, released on July 24,
                            2025
                        </Text>
                        <Text ta={"left"} mt="sm">
                            View an illustrated summary of our method here.
                        </Text>
                        <Zoom>
                            <img
                                alt="Calculation Methods"
                                src="https://data.scienceimpacts.org/methodsFigsV2.png"
                                width="50%"
                            />
                        </Zoom>
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="fy-2026">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            Proposed Impact: FY2026 Budget
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            We compare the proposed NIH FY 2026 <a target={"_blank"}
                                                                   href={"https://officeofbudget.od.nih.gov/pdfs/FY26/br/Overview%20of%20FY%202026%20Supplementary%20Tables.pdf"}>budget</a> to
                            the FY2024 budget to estimate the proportion
                            of funding lost. We calculate the inflation-adjusted five-year <a target={"_blank"}
                                                                                              href={"https://reporter.nih.gov/"}>average</a> of
                            funding across
                            active grants within a given Congressional District from FY2020-2024. We exclude FY2025 from
                            the analysis because grant terminations and freezes have reduced fund distribution compared
                            to historic levels. We exclude grant funding received from agencies outside of the NIH
                            (e.g., FDA and CDC). We similarly calculate reductions in funding for three ICs that would
                            be maintained under the proposed reorganization: the National Institute of Allergy and
                            Infectious Diseases (NIAID), the National Cancer Institute, and the National Institute on
                            Aging (NIA). We assume that cuts will be distributed evenly across regions and research
                            topics
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>

                <AccordionItem value="code-and-data">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            Code and Data
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            The code for this website is publicly available on <a
                            href="https://github.com/clvcooke/scimap" target="_blank" rel="noopener noreferrer">GitHub</a>.
                            This repository contains the frontend React application, Python scripts for data processing,
                            and Cloudflare serverless functions.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>

                <AccordionItem value="contact-us">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            Contact Us
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            For questions, comments, and press inquiries, please email <a
                            href="mailto:contact@scienceimpacts.org">contact@scienceimpacts.org</a>
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="in-the-news">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            News and Policy Mentions
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {newsItems.map(newsItem => (
                            <NewsItem key={newsItem.title} {...newsItem} />
                        ))}
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="data-updates">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            Updates
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            SCIMaP updates its data and visualization to reflect the current state of funding cuts. For
                            the full data history you can reference the <a
                            href={"http://doi.org/10.17605/OSF.IO/H398E"}>
                            publicly available data at the Open Science
                            Framework link</a>.
                        </Text>
                        <Text ta={'left'} mt={'sm'}>
                            <b>To receive email updates about major website releases, reports, and publications, <a
                                href={"https://upenn.co1.qualtrics.com/jfe/form/SV_5vDEXlLWG9IyWmW"}>please sign up
                                here</a>.</b>
                        </Text>
                        <Text ta={"left"} mt="sm">
                            <b>March 27, 2025</b>
                        </Text>
                        <Text ta={"left"}>
                            Initial release.
                        </Text>
                        <Text ta={"left"} mt="sm">
                            <b>April 9th, 2025</b>
                        </Text>
                        <Text ta={"left"}>
                            Congressional districts are now included in the map, and updates to state/county values have
                            been made based on improved commuter flow data from the US census.
                        </Text>
                        <Text ta={"left"} mt="sm">
                            <b>May 27, 2025</b>
                        </Text>
                        <Text ta={"left"}>
                            Terminated NIH grants are now included on the map, displaying current local economic losses
                            in the tooltip as well as blue bubbles listing the number and value of grants cancelled at
                            each institution. Prior estimates for annual future losses, based on proposed changes to
                            funding for indirect costs, have been renamed “future economic losses”.
                        </Text>
                        <Text ta={"left"} mt="sm">
                            <b>June 22, 2025</b>
                        </Text>
                        <Text ta={"left"}>
                            The effects of the proposed FY2026 budget are now included in a separate tab.
                        </Text>
                        <Text ta={"left"} mt="sm">
                            <b>June 30, 2025</b>
                        </Text>
                        <Text ta={"left"}>
                            Following an update to Grant Watch, we now track frozen grants in addition to cancelled
                            grants under current losses.
                        </Text>
                        <Text ta={"left"} mt="sm">
                            <b>August 14, 2025</b>
                        </Text>
                        <Text ta={"left"}>
                            We have revamped our FY26 map to improve the display of values, and added per-district fact sheet that can be viewed by clicking on a district. This change also updates the map to use the 119th Congressional Districts.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
            </Accordion>
        </Container>
    )
        ;
}

export default About;
