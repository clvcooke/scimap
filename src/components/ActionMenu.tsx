import {Tabs} from '@mantine/core';

function ActionMenu() {
    return (
        <Tabs color="teal" variant="pills" radius="xs" defaultValue="map">
            <Tabs.List>
                <Tabs.Tab value="map">
                    Map
                </Tabs.Tab>
                <Tabs.Tab value="quiz">
                    Quiz
                </Tabs.Tab>
                <Tabs.Tab value="learn">
                    Learn More
                </Tabs.Tab>
            </Tabs.List>
        </Tabs>
    );
}

export default ActionMenu;