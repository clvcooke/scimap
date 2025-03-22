import {Container, Paper, Title, Text, Anchor} from '@mantine/core';

function About() {
    return (
        <Container >
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
