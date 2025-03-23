import {useState} from 'react';
import {Container, Stepper, Button, Slider, Text, Group, Card, Stack} from '@mantine/core';
import {isMobile} from "react-device-detect";

function ApprovalSlider({value, onChange}: { value?: number; onChange: (newValue: number) => void; }) {
    const labels = [
        'Strongly Disapprove',
        'Disapprove',
        'Neutral',
        'Approve',
        'Strongly Approve',
    ];

    let marks = [
        {value: 0, label: 'Strongly Disapprove'},
        {value: 2.5, label: 'Disapprove'},
        {value: 5, label: 'Neutral'},
        {value: 7.5, label: 'Approve'},
        {value: 10, label: 'Strongly Approve'},
    ];
    if (isMobile) {
        marks = [
            {value: 0, label: 'Strongly Disapprove'},
            {value: 5, label: 'Neutral'},
            {value: 10, label: 'Strongly Approve'},
        ]
    }


    return (
        <Stack p={"xl"} gap={'xs'}>
            <Text size="sm">
                Rate your support for the proposed changes to scientific research
            </Text>
            <Slider
                value={value}
                onChange={onChange}
                step={0.5}
                min={0}
                max={10}
                marks={marks}
                label={(value) => labels[value]}
            />
        </Stack>
    );
}


function Quiz() {
    const [active, setActive] = useState(0);
    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    const [selectedState, setSelectedState] = useState('');
    const [initialApprovalRating, setInitialApprovalRating] = useState<number>();
    const [finalApprovalRating, setFinalApprovalRating] = useState<number>();
    const [lossGuess, setLossGuess] = useState<number>();

    const handleSubmit = () => {
        // Gather all data: selectedState, approvalRating1, lossGuess, approvalRating2
        // Send to API (replace with your actual API endpoint)
        console.log({selectedState, initialApprovalRating, lossGuess, finalApprovalRating});
        setSelectedState("a")
        setFinalApprovalRating(10)
        setLossGuess(10)
    };

    return (
        <Container size="lg" p={"lg"} style={{width: '100%'}}>
            <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false} size={isMobile ? 'xs' : 'md'}>
                <Stepper.Step label="Overview">
                    {active === 0 && (
                        <Card shadow="sm" padding="xl" radius="md" withBorder>
                            {/* Wrap content in a Card for visual separation */}
                            {/*<StateSelector onChange={setSelectedState} />*/}
                            <ApprovalSlider value={initialApprovalRating}
                                            onChange={(value) => setInitialApprovalRating(value)}/>
                            <Group ta="right" mt="md">
                                {/* Use Group for easy button alignment */}
                                <Button
                                    disabled={!selectedState || initialApprovalRating === undefined}
                                    onClick={nextStep}
                                >
                                    Next
                                </Button>
                            </Group>
                        </Card>

                    )}
                </Stepper.Step>
                <Stepper.Step label="Guess">
                    {active === 1 && (
                        <div>
                            {/* Display State, Supporting Text, LossGuess component */}
                            <Button onClick={prevStep}>Back</Button>
                            <Button onClick={nextStep}>Next</Button>
                        </div>
                    )}
                </Stepper.Step>
                <Stepper.Step label="Feedbackl">
                    {active === 2 && (
                        <div>
                            {/* ResultsDisplay and ApprovalRating components */}
                            <Button onClick={prevStep}>Back</Button>
                            <Button onClick={nextStep}>Next</Button>
                        </div>
                    )}
                </Stepper.Step>
                <Stepper.Step label="Complete">
                    {active === 3 && (
                        <div>
                            {/* Completion component */}
                            <Button onClick={prevStep}>Back</Button>
                            <Button onClick={handleSubmit}>Submit</Button>
                        </div>
                    )}
                </Stepper.Step>
                <Stepper.Completed>
                    Complete
                </Stepper.Completed>
            </Stepper>
        </Container>
    );
}

export default Quiz;
