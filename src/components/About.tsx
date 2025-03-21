import {Container, Paper, Title, Text, Anchor} from '@mantine/core';

// function About() {
//     return (
//         <Container>
//             <Title mt="md">
//                 About the Project
//             </Title>
//
//             <Paper withBorder shadow="md" p="md" mt="md">
//                 <Title order={2}>Our Team</Title>
//                 <Text>
//                     This project is led by a team of scientists who care about
//                     communicating the impact of federal funding cuts on science, health,
//                     and the economy. We are affiliated with institutions across the
//                     nation (University of Maryland - College Park, University of
//                     Pennsylvania, Georgia Institute of Technology, University of Utah, and
//                     University of Oregon). We study diverse topics, including
//                     neuroscience, biology, communication, psychology, and geographic
//                     information science.
//                 </Text>
//             </Paper>
//
//             <Paper withBorder shadow="md" p="md" mt="md">
//                 <Title order={2}>Data and Methodology</Title>
//                 <Text>
//                     We source our data from a <a href={"https://report.nih.gov/award/index.cfm"}>public database of NIH grants</a>. We estimate
//                     the economic impact of NIH grants (or reductions in NIH funding) <a href={"https://www.forbes.com/sites/michaeltnietzel/2025/03/12/nih-grants-fueled-95-billion-in-economic-activity-finds-new-report/"}>based
//                     on a recent report</a>, which found that every dollar invested in NIH
//                     generated{' '}
//                     <Text span fw={700}>
//                         $2.56 in new economic activity in 2024.
//                     </Text>{' '}
//                     To estimate the number of jobs that would be lost if NIH funding is
//                     cut, we used the ratio of the number of jobs supported / research
//                     funds awarded in the 2024 fiscal year.
//                 </Text>
//             </Paper>
//         </Container>
//     );
// }
//
// export default About;

function About() {
    return (
        <Container>
            <Title mt="md">
                The Science & Community Impacts Mapping Project (SCIMaP)
            </Title>

            <Paper withBorder shadow="md" p="md" mt="md">
                <Title order={2}>Ethos</Title>
                <Text ta={"left"}>
                    <Text span fw={700}>
                        Science transforms our world, advances the economy, improves
                        well-being, and saves lives.
                    </Text>{' '}
                    Yet the doing of science seems remote – involving a small relatively number
                    of people working in universities, hospitals, and research institutes
                    nationwide. There can be a substantial{' '}
                    <Text span fw={700}>
                        gap between the realized societal impacts of science and the
                        perception of ongoing changes to federal support for science and
                        scientists
                    </Text>
                    . SCIMaP is a multi-disciplinary initiative to directly explore this
                    perception gap and its consequences.
                </Text>
            </Paper>

            <Paper withBorder shadow="md" p="md" mt="md">
                <Title order={2}>Mission</Title>
                <Text ta={"left"}>
                    Driven by{' '}
                    <Text span fw={700}>
                        geolocated spatial datasets
                    </Text>{' '}
                    across a spectrum of impact indicators, including changes to funding,
                    programs, and employment, SCIMaP will explore attitudes and
                    perceptions of Americans to ongoing changes to federal support for
                    science and scientists.
                </Text>
            </Paper>

            <Paper withBorder shadow="md" p="md" mt="md">
                <Title order={2}>Vision</Title>
                <Text ta={"left"}>
                    SCIMaP will explore attitudes and perceptions of Americans to ongoing
                    changes of federal support for science and scientists. In doing so,
                    SCIMaP will personalize the impacts of changes taking place nationally,
                    building{' '}
                    <Text span fw={700}>
                        immersive data-driven visualizations
                    </Text>{' '}
                    of direct and downstream effects of proposed and realized changes to
                    government investment in science.
                </Text>
            </Paper>

            <Paper withBorder shadow="md" p="md" mt="md">
                <Title order={2}>The Team</Title>
                <Text ta={"left"}>
                    We are an interdisciplinary team of researchers from the University of Maryland, College Park, the University of Pennsylvania, the University of Oregon, the University of Utah, and the Georgia Institute of Technology.  Contact: Prof: Joshua S. Weitz (
                    <Anchor href="mailto:jsweitz@umd.edu">jsweitz@umd.edu</Anchor>)
                </Text>
            </Paper>
        </Container>
    );
}

export default About;
