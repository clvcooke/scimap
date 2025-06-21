import {Container, Button, Stack, Text, Box} from '@mantine/core';
import {TabOption} from "./ActionMenu.tsx";

interface OptionItem {
    title: string;
    description: string;
    tabOption: TabOption
}

const options: OptionItem[] = [
    {
        title: 'Take Action',
        description: 'Resources for action on this issue',
        tabOption: 'action',
    },
    {
        title: 'Quiz',
        description: 'Test your knowledge',
        tabOption: 'quiz',
    },
    {
        title: 'About',
        description: 'Learn more about the team and the methods used',
        tabOption: "about",
    },
];

export const More = ({setTab}: {setTab: (tab: TabOption) => void}) => {

    return (
        <Container p="md">
            <Stack gap="lg">
                {options.map((option, index) => (
                    <Button
                        key={index}
                        onClick={() =>setTab(option.tabOption)}
                        fullWidth
                        variant="light"
                        size="lg"
                        styles={(theme) => ({
                            root: {
                                height: 'auto',
                                padding: theme.spacing.md,
                                textAlign: 'left',
                            },
                            inner: {
                                justifyContent: 'flex-start',
                            },
                        })}
                    >
                        <Box>
                            <Text fw={600} size="md">
                                {option.title}
                            </Text>
                            <Text size="sm" c="dimmed">
                                {option.description}
                            </Text>
                        </Box>
                    </Button>
                ))}
            </Stack>
        </Container>
    );
};