import {Container, Title, Text, useMantineTheme, Accordion, AccordionItem} from '@mantine/core';
import {useMediaQuery} from "@mantine/hooks";

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
                        <Title order={isMobile ? 4 : 3}>Vision</Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            Science transforms our world, advances the economy, and saves lives. However, the process
                            and impacts of science can be hidden from the public. Through interactive visualizations, we
                            aim to showcase how scientific research fuels the economy, supports jobs, and improves
                            health for all Americans.
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
                            cancellations of many grants for specific research projects. Our mission is to demonstrate
                            how these proposed changes impact science, the economy, and healthcare.
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
                            We are an interdisciplinary team of researchers from the University of Maryland - College
                            Park (Dr. Joshua Weitz), the University of Pennsylvania (Dr. Alyssa Sinclair & Dr. Emily
                            Falk), and the Georgia Institute of Technology (Dr. Clio Andris). We have expertise in
                            different areas—biology, psychology, neuroscience, communication, and geographic information
                            science—but we are united by our vision and goals.
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
                            Currently, we are focusing on the impact of proposed <a
                            href={"https://grants.nih.gov/grants/guide/notice-files/NOT-OD-25-068.html"}
                            target={"_blank"}> cuts to the NIH indirect cost rate</a>.
                            These cuts would reduce funding for “indirect costs” of research, like essential staff,
                            equipment, and facilities. At many institutions, &gt;50% of research funding is used for
                            indirect costs. The proposed changes would cap funding for indirect costs at 15%, taking
                            back hundreds of millions of dollars that were promised to the states. States have sued to
                            challenge the order, arguing that the changes are unlawful. Currently, a federal judge has
                            issued an injunction to temporarily block the changes.
                        </Text>
                        <Text ta={"left"} mt="sm">
                            We source our data from a <a href={"https://report.nih.gov/award/index.cfm"}
                                                         target={"_blank"}>public database of NIH grants</a>. We
                            estimate the economic impact of
                            NIH grants (or reductions in NIH funding) <a
                            href={"https://www.forbes.com/sites/michaeltnietzel/2025/03/12/nih-grants-fueled-95-billion-in-economic-activity-finds-new-report/"}
                            target={"_blank"}>based
                            on a recent report</a>, which found that every
                            dollar invested in NIH generated $2.56 in new economic activity in 2024. To estimate the
                            number of jobs that would be lost if NIH funding is cut, we used the ratio of the number of
                            jobs supported / research funds awarded in the 2024 fiscal year. We also use <a
                            href={"https://lehd.ces.census.gov/data/"}
                            target={"_blank"}>Census data on
                            where U.S. commuters live and work</a> to estimate how economic activity generated in each
                            county can spread to adjacent counties.
                        </Text>
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
