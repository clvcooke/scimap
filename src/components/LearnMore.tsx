import {
    Accordion,
    AccordionItem,
    Container,
    Title,
    Text,
    useMantineTheme,
} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';


function LearnMore() {
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

    return (
        <Container size="md">
            <Title mt="md" mb="sm">
                Understanding NIH Funding
            </Title>

            <Accordion variant="contained" radius="md">
                <AccordionItem value="what-does-nih-do">
                    <Accordion.Control>
                        <Title order={isMobile ? 4 : 3}>What does the NIH do?</Title>
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
                            breakthroughs</a> like new treatments for cancer and Type-1 diabetes.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="how-much-nih-contrib">
                    <Accordion.Control>
                        <Title order={isMobile ? 4 : 3}>
                            How does the NIH contribute to the U.S. economy?
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            NIH funding is an <b>excellent financial investment</b>. Less than 1% of the total federal
                            budget goes to the NIH, but this small investment has a big impact. Every dollar invested in
                            scientific research through NIH produces, on average, $2.56 of economic activity in return
                            – a gain of <b>over 250%</b>.
                        </Text>
                        <Text ta={"left"} mt={"sm"}>
                            NIH funding supports universities, hospitals, research institutions, and businesses across
                            the U.S. In 2024, the NIH directly supported nearly <b>half a million jobs</b> and generated
                            <b> billions of dollars</b> in new economic activity in the U.S.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="proposed-changes">
                    <Accordion.Control>
                        <Title order={isMobile ? 4 : 3}>
                            What are the changes to NIH funding?
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            Currently, the White House has ordered <b>major changes to NIH funding</b>, which would <b>take
                            back
                            funds</b> that were already promised to the states. States have sued to challenge the order,
                            arguing that the changes are <b>unlawful</b>.
                        </Text>
                        <Text ta={"left"} mt="sm">
                            One of the changes would greatly reduce NIH funding that covers <a
                            href={"https://research.unc.edu/2025/02/13/true-costs-of-conducting-research/"}
                            target={"_blank"}>"indirect costs"</a> of
                            research. These funds indirectly support research by helping pay for essential facilities,
                            special equipment, skilled staff, and safety checks that are shared across many research
                            projects. Medical research would not be possible without funding to cover indirect costs.
                        </Text>
                        <Text ta={"left"} mt="sm">
                            Other threats to research include a proposal to reduce the National Science Foundation’s
                            budget by 66%, and ongoing cancellations of specific research grants.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="what-if-cuts">
                    <Accordion.Control>
                        <Title order={isMobile ? 4 : 3}>
                            What would happen if NIH funding is cut?
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
                            The U.S. could lose its standing as a world leader in medical research, science, and
                            technology.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
            </Accordion>
        </Container>
    );
}

export default LearnMore;
