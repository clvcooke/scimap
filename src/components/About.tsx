import {Container, Title, Text, useMantineTheme, Accordion, AccordionItem} from '@mantine/core';
import {useMediaQuery} from "@mantine/hooks";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

function About() {
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

    return (
        <Container size="md">
            <Title mt="md" mb="sm">
                The Science & Community Impacts Mapping Project (SCIMaP)
            </Title>

            <Accordion variant="contained" radius="md">
                <AccordionItem value="what-does-nih-do">
                    <Accordion.Control>
                        <Title order={isMobile ? 4 : 3}>Goal</Title>
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

                <AccordionItem value="proposed-changes">
                    <Accordion.Control>
                        <Title order={isMobile ? 4 : 3}>
                            The Team
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            We are an interdisciplinary team of researchers from the University of Maryland, College
                            Park (Dr. Joshua Weitz), the University of Pennsylvania (Dr. Alyssa Sinclair, Dr. Emily
                            Falk, and Dr. Danielle Cosme), the University of Utah (Dr. Angela Fagerlin), and the Georgia
                            Institute of Technology (Dr. Clio Andris). We
                            have expertise in different areas—biology, psychology, neuroscience, communication, and
                            geographic information science— united by our common goal.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>

                <AccordionItem value="is-funding-nih-good">
                    <Accordion.Control>
                        <Title order={isMobile ? 4 : 3}>
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
                <AccordionItem value="is-funding-nih-good2">
                    <Accordion.Control>
                        <Title order={isMobile ? 4 : 3}>
                            Data Sources
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            We source our data from a <a href={"https://reporter.nih.gov/advanced-search"}
                                                         target={"_blank"}>public database of NIH grants</a> that were
                            active in 2024. We estimate the economic impact of NIH grants (or reductions in NIH
                            funding) <a
                            href={"https://www.unitedformedicalresearch.org/annual-economic-report/"}>based
                            on a recent
                            report</a>, which found that every dollar invested in NIH generated $2.56 in new economic
                            activity in 2024. To estimate the number of jobs that would be lost if NIH funding is cut,
                            we used the ratio of the number of jobs supported / research funds awarded in the 2024
                            fiscal year. We also use <a href={"https://lehd.ces.census.gov/data/"}>Census data on where
                            U.S. commuters live and work</a> to estimate how
                            economic activity generated in each county can spread to adjacent counties.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>


                <AccordionItem value="what-if-cuts">
                    <Accordion.Control>
                        <Title order={isMobile ? 4 : 3}>
                            Method
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            Currently, we are focusing on the impact of <a
                            href={"https://grants.nih.gov/grants/guide/notice-files/NOT-OD-25-068.html"}
                            target={"_blank"}>proposed cuts to the NIH indirect cost rate</a>.
                            These cuts would reduce funding for “indirect costs” of research, like essential staff,
                            equipment, and facilities. At many institutions, indirect costs are 40%-60% of the budget
                            allocated to direct costs of research. The proposed changes would cap funding for indirect
                            costs at 15%, taking back billions of dollars that were promised to the states. States have
                            sued to challenge the order, arguing that the changes are unlawful. Currently, a federal
                            judge has issued an injunction to temporarily block the changes. To estimate decreases in
                            funding, we calculate the difference between current funding for indirect costs and proposed
                            funding with a 15% maximum for current NIH grants.
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
                                src="https://data.scienceimpacts.org/methodsFig.png"
                                width="50%"
                            />
                        </Zoom>
                    </Accordion.Panel>
                </AccordionItem>

                <AccordionItem value="data-sources">
                    <Accordion.Control>
                        <Title order={isMobile ? 4 : 3}>
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
            </Accordion>
        </Container>
    );
}

export default About;
