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
import {trackEvent} from "../utils/analytics.ts";
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

function LossGuessCancelled({stateValue, lossGuess, setLossGuess}: LossGuessProps) {
    return (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
            <Stack gap="md">
                <Text ta='left' size="md">
                    The White House has ordered <b>major changes to NIH funding</b>, which would <b>take back
                    funds</b> that were
                    already promised to the states. States have sued to challenge the orders, arguing that the changes
                    are <b>unlawful</b>. Universities, hospitals, and other institutions that receive NIH grants
                    would <b>lose
                    money that is crucial</b> for operating and conducting research.
                </Text>

                <Text ta='left' size="md">
                    Many NIH grants for health research have been cancelled, interrupting ongoing studies and clinical
                    trials. These cancelled grants will cause economic losses in your state.
                </Text>

                <Text ta='left' size="md">
                    Can you guess how many <b>millions of dollars</b> will be lost due to cancelled grants
                    in <b>{stateValue}</b>?
                </Text>

                <NumberInput
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

function LossGuessIndirect({stateValue, lossGuess, setLossGuess}: LossGuessProps) {
    return (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
            <Stack gap="md">
                <Text ta='left' size="md">
                    Another change would greatly reduce NIH funding that covers <b>"indirect costs"</b> of research.
                    These
                    funds help pay for essential facilities, special equipment, skilled staff, and safety checks that
                    are shared across many research projects.
                </Text>

                <Text ta='left' size="md">
                    Cutting funding for indirect costs of research would cause ongoing economic losses in your state
                    every year.
                </Text>

                <Text ta='left' size="md">
                    Can you guess how many <b>millions of dollars</b> would be lost every year in <b>{stateValue}</b> if
                    funding for indirect costs is cut?
                </Text>

                <NumberInput
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
    lossGuessCancelled: number;
    lossGuessIndirect: number;
    jobLossCancelled: number;
    jobLossIndirect: number;
    actualCancelledLoss: number;
    actualIndirectLoss: number;
    approvalRating: number | undefined;
    setApprovalRating: (value: number | undefined) => void;
}

function ResultsDisplay({
                            stateValue,
                            lossGuessCancelled,
                            lossGuessIndirect,
                            jobLossCancelled,
                            jobLossIndirect,
                            actualCancelledLoss,
                            actualIndirectLoss,
                            approvalRating,
                            setApprovalRating,
                        }: ResultsDisplayProps) {
    return (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
            <Stack>
                <Stack gap="xs">
                    <Text ta="left" size="lg" fw={500}>
                        Cancelled NIH Grants:
                    </Text>
                    <Text ta="left" ml={'md'}>
                        You guessed that <b>{stateValue}</b> would lose <b>${lossGuessCancelled} million</b> due to
                        cancelled grants.
                    </Text>
                    <Text ta="left" ml={'md'}>
                        Currently, cancelled grants in <b>{stateValue}</b> are projected to cause losses
                        of <b>${actualCancelledLoss} million</b> and <b>{jobLossCancelled} jobs</b>.
                    </Text>
                </Stack>
                <Stack gap="xs">
                    <Text ta="left" size="lg" fw={500}>
                        Cutting Funding for Indirect Costs:
                    </Text>
                    <Text ta="left" ml={'md'}>
                        You guessed that <b>{stateValue}</b> will lose <b>${lossGuessIndirect} million</b> each year if
                        funding for indirect costs is cut.
                    </Text>
                    <Text ta="left" ml={'md'}>
                        Each year, <b>{stateValue}</b> is projected to
                        lose <b>${actualIndirectLoss} million</b> and <b>{jobLossIndirect} jobs</b> if funding for
                        indirect costs is cut.
                    </Text>
                </Stack>
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
    const [lossGuessCancelled, setLossGuessCancelled] = useState<number>();
    const [lossGuessIndirect, setLossGuessIndirect] = useState<number>();
    const canSubmit = finalApprovalRating !== undefined && lossGuessCancelled !== undefined && lossGuessIndirect !== undefined && initialApprovalRating !== undefined;
    const [stateValue, setStateValue] = useState('');
    const [showShare, setShowShare] = useState(false);

    const handleSubmit = () => {
        // Track quiz submission with all the details as a JSON string in the label
        trackEvent(
            'Quiz',
            'QuizSubmissionV1',
            JSON.stringify({
                initialApprovalRating,
                lossGuess: lossGuessIndirect,
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
    const stepTwoDisabled = lossGuessCancelled === undefined;
    const stepThreeDisabled = lossGuessIndirect === undefined;

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
                                        label="Which U.S. state do you live in?"
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
                                How much do you <b>approve</b> or <b>disapprove</b> of the <b>decreases</b> to federal
                                funding for scientific research?
                            </Text>
                            <ApprovalSlider value={initialApprovalRating}
                                            onChange={(value) => setInitialApprovalRating(value)}/>
                        </Card>

                    )}
                </Stepper.Step>
                <Stepper.Step label="Cancelled Grants">
                    {active === 1 && (
                        <div>
                            <LossGuessCancelled lossGuess={lossGuessCancelled} setLossGuess={setLossGuessCancelled}
                                                stateValue={stateValue}/>
                        </div>
                    )}
                </Stepper.Step>
                <Stepper.Step label="Indirect Costs">
                    {active === 2 && (
                        <div>
                            <LossGuessIndirect lossGuess={lossGuessIndirect} setLossGuess={setLossGuessIndirect}
                                               stateValue={stateValue}/>
                        </div>
                    )}
                </Stepper.Step>
                <Stepper.Step label="Results">
                    {active === 3 && lossGuessIndirect !== undefined && lossGuessCancelled !== undefined && (
                        <div>
                            <ResultsDisplay
                                stateValue={stateValue}
                                lossGuessCancelled={lossGuessCancelled}
                                lossGuessIndirect={lossGuessIndirect}
                                actualCancelledLoss={Math.round(STATE_LOSSES[stateValue].loss / 1_000_000)}
                                actualIndirectLoss={Math.round(STATE_LOSSES[stateValue].loss / 1_000_000)}
                                jobLossCancelled={Math.round(STATE_LOSSES[stateValue].jobs_loss)}
                                jobLossIndirect={Math.round(STATE_LOSSES[stateValue].jobs_loss)}
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
                {active < 3 && (
                    <>
                        {active > 0 && <Button variant="default" onClick={prevStep}>Back</Button>}
                        <Button disabled={
                            (active === 0 && stepOneDisabled) ||
                            (active === 1 && stepTwoDisabled) ||
                            (active === 2 && stepThreeDisabled)
                        } onClick={nextStep}>Next step</Button>
                    </>
                )}
                {active === 3 && (
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
