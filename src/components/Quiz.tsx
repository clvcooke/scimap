import {useEffect, useState} from 'react';
import {
    Container,
    Stepper,
    Button,
    Slider,
    Text,
    Group,
    Card,
    Stack,
    Combobox,
    TextInput,
    useCombobox,
    NumberInput, Modal, Title
} from '@mantine/core';
import {isMobile} from "react-device-detect";
import {STATE_ARRAY, STATE_LOSSES} from "../data/state-losses.ts";
import { trackEvent } from "../utils/analytics.ts";
import SharePage from "./SharePage.tsx";


function ApprovalSlider({value, onChange}: { value?: number; onChange: (newValue: number) => void; }) {
    const marks = [
        {value: 0, label: 'Strongly Disapprove'},
        {value: 5, label: 'Neutral'},
        {value: 10, label: 'Strongly Approve'},
    ];
    return (
        <Stack py={"lg"} px={"xl"} gap={'xs'}>
            <Slider
                value={value ?? 5}
                onChange={onChange}
                step={1}
                min={0}
                max={10}
                marks={marks}
            />
        </Stack>
    );
}


interface LossGuessProps {
    stateValue: string;
    lossGuess?: number;
    setLossGuess: (value: number | undefined) => void;
}

function LossGuess({stateValue, lossGuess, setLossGuess}: LossGuessProps) {
    return (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
            <Stack gap="md">
                <Text ta='left' size="md">
                    The White House has <b>ordered major changes to NIH funding</b>, which would <b>take back
                    funds</b> that were
                    already promised to the states. States have sued to challenge the order, arguing that the changes
                    are <b>unlawful</b>.
                </Text>

                <Text ta='left' size="md">
                    One of the changes would greatly reduce NIH funding that covers <b>"indirect costs"</b> of research.
                    These funds indirectly support research by helping pay for essential facilities, special equipment,
                    skilled staff, and safety checks that are shared across many research projects.
                </Text>

                <Text ta='left' size="md">
                    Medical and health research <b>would not be possible</b> without funding to cover indirect costs.
                    Universities, hospitals, and other institutions that receive NIH grants would <b>lose money that is
                    crucial</b> for operating and conducting research.
                </Text>

                <Text ta='left' size="md">
                    In <b>{stateValue}</b>, changes to federal research funding would result in <b>economic losses</b>.
                </Text>

                <NumberInput
                    label="Can you guess how many millions of dollars would be lost in your state?"
                    placeholder="Millions of dollars"
                    ta={"left"}
                    size="lg"
                    value={lossGuess}
                    onChange={(value) => setLossGuess(value as number)}
                    min={0}
                    max={10_000}
                    clampBehavior="strict"
                    step={1}
                    allowNegative={false}
                    prefix="$"
                    suffix=" million"
                />
            </Stack>
        </Card>
    );
}

interface ResultsDisplayProps {
    stateValue: string;
    lossGuess: number;
    jobLoss: number;
    actualLoss: number;
    approvalRating: number | undefined;
    setApprovalRating: (value: number | undefined) => void;
}

function ResultsDisplay({
                            stateValue,
                            lossGuess,
                            jobLoss,
                            actualLoss,
                            approvalRating,
                            setApprovalRating,
                        }: ResultsDisplayProps) {
    return (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
            <Stack gap="0" mb={'md'}>
                <Text ta="left" size="lg" fw={500}>
                    Results for {stateValue}
                </Text>
                <Text ta="left">
                    <b>Your guess:</b> ${lossGuess} million.
                </Text>
                <Text ta="left">
                    <b>Answer:</b> ${actualLoss} million.
                </Text>
            </Stack>
            <Stack gap="sm">
                <Text ta="left">
                    In <b>{stateValue}</b>, the changes to federal funding for research are projected to cause a loss
                    of <b>${actualLoss} million</b> for the state economy.
                </Text>
                <Text ta="left">
                    The changes would also result in the loss of approximately <b>{jobLoss} jobs</b> in your state.
                </Text>
                <Text ta="left">
                    After learning about impact for your state, how much do you <b>approve or disapprove</b> of proposed
                    changes to federal funding for scientific research?
                </Text>
                <ApprovalSlider value={approvalRating} onChange={setApprovalRating}/>
            </Stack>
        </Card>
    );
}


// @ts-expect-error: error
function Quiz({setActiveTab}) {
    const [active, setActive] = useState(0);
    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    const [initialApprovalRating, setInitialApprovalRating] = useState<number>();
    const [finalApprovalRating, setFinalApprovalRating] = useState<number>();
    const [lossGuess, setLossGuess] = useState<number>();
    const canSubmit = finalApprovalRating !== undefined && lossGuess !== undefined && initialApprovalRating !== undefined;
    const [stateValue, setStateValue] = useState('');
    const [showShare, setShowShare] = useState(false);

    const handleSubmit = () => {
        // Track quiz submission with all the details as a JSON string in the label
        trackEvent(
            'Quiz',
            'QuizSubmissionV1',
            JSON.stringify({
                initialApprovalRating,
                lossGuess,
                finalApprovalRating,
                stateValue,
            })
        );
        setShowShare(true);
    };

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const shouldFilterOptions = !STATE_ARRAY.some((item) => item === stateValue);

    const filteredOptions = shouldFilterOptions
        ? STATE_ARRAY.filter((item) => item.toLowerCase().includes(stateValue.toLowerCase().trim()))
        : STATE_ARRAY;

    const options = filteredOptions.map((item) => (
        <Combobox.Option value={item} key={item}>
            {item}
        </Combobox.Option>
    ));

    const stepOneDisabled = !STATE_ARRAY.includes(stateValue) || initialApprovalRating === undefined;
    const stepTwoDisabled = lossGuess === undefined;

    useEffect(() => {
        // we need to wait for options to render before we can select first one
        combobox.selectFirstOption();
    }, [stateValue, combobox]);

    return (
        <Container size="lg" p={"lg"} style={{width: '100%'}}>
            <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false} size={isMobile ? 'xs' : 'md'}>
                <Stepper.Step label="Overview">
                    {active === 0 && (
                        <Card shadow="sm" padding="xl" radius="md" withBorder>
                            <Text size="md" mb={"sm"} ta="left">
                                How would <b>your state be impacted</b> by changes to NIH funding? <b>Take the
                                quiz</b> to find out!
                            </Text>
                            <Combobox
                                onOptionSubmit={(optionValue) => {
                                    setStateValue(optionValue)
                                    combobox.closeDropdown();
                                }}
                                store={combobox}
                            >
                                <Combobox.Target>
                                    <TextInput
                                        label="In which U.S. state or territory do you currently reside?"
                                        placeholder="Select a state"
                                        value={stateValue}
                                        onChange={(event) => {
                                            setStateValue(event.currentTarget.value);
                                            combobox.openDropdown();
                                        }}
                                        onClick={() => combobox.openDropdown()}
                                        onFocus={() => combobox.openDropdown()}
                                        onBlur={() => combobox.closeDropdown()}
                                    />
                                </Combobox.Target>
                                <Combobox.Dropdown>
                                    <Combobox.Options mah={300} style={{overflowY: 'auto'}}>
                                        {options.length === 0 ?
                                            <Combobox.Empty>Nothing found</Combobox.Empty> : options}
                                    </Combobox.Options>
                                </Combobox.Dropdown>
                            </Combobox>
                            <Text mt={"lg"}>
                                Currently, how much do you approve or disapprove of proposed decreases to federal
                                funding for scientific research?
                            </Text>
                            <ApprovalSlider value={initialApprovalRating}
                                            onChange={(value) => setInitialApprovalRating(value)}/>
                        </Card>

                    )}
                </Stepper.Step>
                <Stepper.Step label="Guess">
                    {active === 1 && (
                        <div>
                            <LossGuess lossGuess={lossGuess} setLossGuess={setLossGuess} stateValue={stateValue}/>
                        </div>
                    )}
                </Stepper.Step>
                <Stepper.Step label="Results">
                    {active === 2 && lossGuess !== undefined && (
                        <div>
                            <ResultsDisplay
                                stateValue={stateValue}
                                lossGuess={lossGuess}
                                actualLoss={Math.round(STATE_LOSSES[stateValue].loss / 1_000_000)}
                                jobLoss={Math.round(STATE_LOSSES[stateValue].jobs_loss)}
                                approvalRating={finalApprovalRating}
                                setApprovalRating={setFinalApprovalRating}
                            />
                        </div>
                    )}
                </Stepper.Step>
                <Stepper.Completed>
                    Complete
                </Stepper.Completed>
            </Stepper>
            <Group justify="center" mt="xl">
                {active < 2 && (
                    <>
                        {active > 0 && <Button variant="default" onClick={prevStep}>Back</Button>}
                        <Button disabled={
                            (active === 0 && stepOneDisabled) ||
                            (active === 1 && stepTwoDisabled)
                        } onClick={nextStep}>Next step</Button>
                    </>
                )}
                {active === 2 && (
                    <Button disabled={!canSubmit} onClick={handleSubmit}>Submit</Button>
                )}
            </Group>
            <Modal closeOnClickOutside={false} centered withinPortal={false} opened={showShare} onClose={() => {
                setShowShare(false)
                setActiveTab('map');
            }}
                   title={<Title size="xl" ta="center">Response submitted. Next, share your state impact:</Title>}>
                {active === 2 && <SharePage title={
                    `${stateValue} could lose ${Math.round(STATE_LOSSES[stateValue].loss / 1_000_000)} million due to federal health research cuts. Visit scienceimpacts.org to learn more.`
                }/>}
            </Modal>

        </Container>
    );
}

export default Quiz;
