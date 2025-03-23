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
                            The <b>National Institutes of Health</b> (NIH) provides funding for crucial scientific
                            research that addresses <b>leading health problems</b>, including cancer, diabetes,
                            dementia, heart
                            disease, stroke, mental illness, and more.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>

                <AccordionItem value="how-much">
                    <Accordion.Control>
                        <Title order={isMobile ? 4 : 3}>
                            How much federal funding goes to the NIH?
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            The federal government invests approximately $47 billion in the NIH, of which approximately
                            $37 billion is distributed nationally through research grant awards. This budget
                            represents &lt;1% of the total federal budget, but this small investment has a big impact.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
                <AccordionItem value="how-much">
                    <Accordion.Control>
                        <Title order={isMobile ? 4 : 3}>
                            How does the NIH contribute to the U.S. economy?
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            NIH funding is an <b>excellent financial investment</b>. Less than 1% of the total federal
                            budget
                            goes to the NIH, but this small-but-mighty investment has a big impact. Every dollar
                            invested in scientific research through NIH produces, on average, $2.56 of economic activity
                            in return – <b>over 250% gain</b>.
                        </Text>
                        <Text ta={"left"}>
                            NIH funding supports universities, hospitals, research institutions, and businesses across
                            the U.S. In 2024, the NIH directly supported over <b>408,000</b> jobs and generated
                            over <b>$94.5</b>
                            billion in new economic activity in the U.S.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>

                <AccordionItem value="proposed-changes">
                    <Accordion.Control>
                        <Title order={isMobile ? 4 : 3}>
                            What are the proposed changes to NIH funding?
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            Currently, the Whitehouse has ordered <b>major changes to NIH funding</b>, which
                            would <b>take back funds</b> that were already promised to the states. States have sued to
                            challenge the order, arguing that the changes are <b>unlawful</b>.
                        </Text>
                        <Text ta={"left"} mt="sm">
                            One of the changes would greatly reduce NIH funding that covers
                            <b>"indirect costs"</b> of research. Indirect costs include the
                            essential facilities, special equipment, skilled staff, and safety
                            checks required for medical research.
                        </Text>
                        <Text ta={"left"} mt="sm">
                            Medical research would not be possible without funding to cover
                            indirect costs. For example, when you donate to charity, some of
                            your money is used to cover indirect costs like staff, rent, and
                            supplies.
                        </Text>
                        <Text ta={"left"} mt="sm">
                            Other threats to research include a proposal to reduce the
                            National Science Foundation’s budget by 66%, and ongoing
                            cancellations of specific research grants.
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
                            Universities, hospitals, and businesses that receive NIH grants
                            would lose money that is crucial for operating and conducting
                            research. Many people would lose their jobs.
                        </Text>
                        <Text ta={"left"} mt="sm">
                            Medical research would be slowed, making it harder to cure
                            diseases and keep people healthy. The U.S. would lose its standing
                            as a world leader in medical research, science, and technology.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>

                <AccordionItem value="data-sources">
                    <Accordion.Control>
                        <Title order={isMobile ? 4 : 3}>
                            What are your data sources and how do you estimate impact?
                        </Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Text ta={"left"}>
                            We source our data from a <a href={"https://report.nih.gov/award/index.cfm"}>public database
                            of NIH grants</a>. We estimate the economic impact of NIH grants (or reductions in NIH
                            funding)
                            <a href={"https://www.forbes.com/sites/michaeltnietzel/2025/03/12/nih-grants-fueled-95-billion-in-economic-activity-finds-new-report/"}
                               target={"_blank"}>based
                                on a recent report</a>, which found that every dollar
                            invested in NIH generated $2.56 in new economic activity in 2024.
                            To estimate the number of jobs that would be lost if NIH funding is cut, we used the ratio
                            of the number of jobs supported / research funds awarded in the 2024 fiscal year. We also
                            use <a href={"https://lehd.ces.census.gov/data/"}
                                   target={"_blank"}>Census data on where U.S. commuters live and work</a> to estimate
                            how economic activity
                            generated in each county can spread to adjacent counties.
                        </Text>

                        <Text ta={"left"} mt="sm">
                            Currently, we are focusing on the impact of <a href={"https://grants.nih.gov/grants/guide/notice-files/NOT-OD-25-068.html"} target={"_blank"}>proposed cuts to the NIH indirect cost (IDC)
                            rate</a>. These cuts would reduce funding for “indirect costs” of research, like essential
                            staff, equipment, and facilities. At many institutions, &gt;50% of research funding is used for
                            indirect costs. The proposed changes would cap funding for indirect costs at 15%, taking
                            back hundreds of millions of dollars that were promised to the states. To estimate decreases
                            in funding, we calculate the difference between current IDC rates and a 15% IDC rate for
                            every current NIH grant.
                        </Text>
                    </Accordion.Panel>
                </AccordionItem>
            </Accordion>
        </Container>
    );
}

export default LearnMore;
