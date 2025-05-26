import {
    Accordion,
    AccordionItem,
    Container,
    Title,
    Text,
} from '@mantine/core';
import {isMobile} from "react-device-detect";

const textOrder = isMobile ? 4 : 3;

function LearnMore() {
    return (
        <Container size="md">
            <Title mt="md" mb="sm">
                Understanding NIH Funding
            </Title>

            <Accordion variant="contained" radius="md">
                <AccordionItem value="what-does-nih-do">
                    <Accordion.Control>
                        <Title order={textOrder}>What does the NIH do?</Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            The <b>National Institutes of Health</b> (NIH) provides funding for crucial
                            research that addresses <b>leading health problems</b>, including cancer, diabetes,
                            dementia, heart disease, stroke, mental illness, and more.
                        </Text>
                        <Text ta={"left"} mt={"sm"}>
                            Research funded by the NIH has led to <a
                            href={"https://www.nih.gov/about-nih/what-we-do/impact-nih-research"} target={"_blank"}>major
                            breakthroughs</a> like prevention, treatment, and cures for heart disease, cancer, and type
                            1 diabetes.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="how-much-nih-contrib">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            How does the NIH contribute to the U.S. economy?
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            NIH funding is an <b>excellent financial investment</b>. Less than 1% of the total federal
                            budget
                            goes to the NIH, but this small investment has a big impact. Every dollar invested in
                            scientific research through NIH produces, on average, <b>$2.56</b> of economic activity in
                            return—a
                            gain of over <b>250%.</b>
                        </Text>
                        <Text ta={"left"} mt={"sm"}>
                            NIH funding supports universities, hospitals, research institutions, and businesses across
                            the U.S. and globally. In 2024, the NIH directly supported nearly <b>half a million
                            jobs</b> and
                            generated <b>billions of dollars</b> in new economic activity in the U.S.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="proposed-changes">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            What are the changes to NIH funding?
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            Currently, the White House has ordered <strong>major changes to NIH funding</strong>, which
                            would <strong>take back funds</strong> that were already promised to the states. States have
                            sued to challenge the order, arguing that the changes are <strong>unlawful</strong>
                        </Text>
                        <Text ta={"left"} mt="sm">
                            There are two major sources of cuts to NIH funding, which will result in current and future
                            losses. First, many NIH grants for health research have already been cancelled, interrupting
                            ongoing studies and clinical trials.
                        </Text>
                        <Text ta={"left"} mt="sm">
                            Second, another change would greatly reduce NIH funding that covers <a target={"_blank"}
                                                                                                   href="https://research.unc.edu/2025/02/13/true-costs-of-conducting-research/"><strong>"indirect
                            costs"</strong></a> of research. These funds indirectly support research by helping pay for
                            essential facilities, special equipment, skilled staff, and safety checks that are shared
                            across many research projects. Medical research is not possible without funding to cover
                            indirect costs.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="what-if-cuts">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            What will happen due to NIH funding cuts?
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            Universities, hospitals, research institutes, and businesses that receive NIH grants would
                            lose money that is crucial for research.
                        </Text>
                        <Text ta={"left"} mt="sm">
                            Across the nation, the proposed changes to federal funding for research are projected to
                            cause a loss of <b>billions of dollars</b> for the U.S. economy.
                        </Text>
                        <Text ta={"left"} mt="sm">
                            The changes would also result in the loss of <b>tens of thousands</b> of jobs in the U.S.
                        </Text>
                        <Text ta={"left"} mt="sm">
                            Medical research would be slowed, making it harder to cure diseases and keep people healthy.
                            Clinical trials will be disrupted, erasing opportunities for people to benefit from new
                            cures. The U.S. could lose its standing as a world leader in medical research, science, and
                            technology.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="what-other-cuts">
                    <Accordion.Control>
                        <Title order={textOrder}>
                            What other cuts are being made to scientific research?
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            In addition to the current and proposed cuts to NIH grants displayed on the map, the White
                            House has also proposed a 40% reduction in the NIH’s annual budget, which would further
                            reduce funding for health research.
                        </Text>
                        <Text ta={"left"} mt="sm">
                            SCIMaP currently focuses on cuts to NIH funding, but similar cuts have been proposed at the
                            <b>National Science Foundation</b> (NSF). Cuts include a proposal that would impose a 15%
                            cap on
                            indirect costs for grants from the National Science Foundation (NSF), and a proposal to
                            reduce the NSF budget by 66%. NSF’s mission is to “promote the progress of science; to
                            advance the national health, prosperity and welfare; and to secure the national defense.”
                        </Text>
                        <Text ta={"left"} mt="sm">
                            Other threats to research include cancellations of grants from other federal agencies,
                            elimination of doctoral student training opportunities, and mass layoffs of scientists and
                            staff working at NIH, CDC, and other health agencies. There are also widespread opportunity
                            costs due to cancelled funding opportunities, disrupted review of grant proposals, and funds
                            that are being withheld from institutions.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
            </Accordion>
        </Container>
    );
}

export default LearnMore;
