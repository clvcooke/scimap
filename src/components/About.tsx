import {Container, Title, Text, Accordion, AccordionItem} from '@mantine/core';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import {isMobile} from "react-device-detect";

const textOrder = isMobile ? 4 : 3;

function About() {

    return (
        <Container size="md">
            <Title mt="md" mb="sm">
                The Science & Community Impacts Mapping Project (SCIMaP)
            </Title>

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
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="current-impact-term-grants">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            Current Impact: Terminated Grants
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            Many NIH grants for health research have already been cancelled, interrupting ongoing
                            studies and clinical trials. To track terminated grants, we use the <a
                            href={"https://grant-watch.us/nih-data.html"} target={"_blank"}> Grant Watch database</a>,
                            which is based on reports from government sources and researchers. Please note that
                            terminations (and sometimes restorations) of grants are ongoing, so data are subject to
                            change. There can also be lags between when a grant is terminated or restored and when the
                            change appears in the database.
                        </Text>
                        <Text ta={"left"}>
                            For terminated grants, we assume that losses are equivalent to the remaining grant funds
                            that were not spent at the time of cancellation. Terminated grants from adjacent divisions
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
                            Another proposed change would greatly reduce NIH funding that covers <a
                            href={"https://grants.nih.gov/grants/guide/notice-files/NOT-OD-25-068.html"}
                            target={"_blank"}>“indirect costs” of
                            research</a>. Funding for indirect costs helps pay for essential facilities, equipment,
                            skilled
                            staff, and safety checks needed across many research projects. Medical research would not be
                            possible without funding to cover indirect costs.
                        </Text>
                        <Text ta={"left"}>
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
                            indirect costs as well as terminated grants, we multiply direct loss values by 2.56. This
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
                            Note that terminated grants do not count toward the estimates of future losses that would
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
                                                                 target={"_blank"}>publicly available here</a>.
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

                <AccordionItem value="data-sources">
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
                            <b>May 26, 2025</b>
                        </Text>
                        <Text ta={"left"}>
                            Terminated NIH grants are now included on the map, displaying current local economic losses
                            in the tooltip as well as blue bubbles listing the number of value of grants cancelled at
                            each institution. Prior estimates for annual future losses, based on proposed changes to
                            funding for indirect costs, have been renamed “future economic losses”.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
            </Accordion>
        </Container>
    )
        ;
}

export default About;
