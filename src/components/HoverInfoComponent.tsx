import * as Popover from '@radix-ui/react-popover';

export type TileProperties = {
    FIPS: number;
    state: string;
    county: string;
    pop_2024: number;
    grant_funds: number;
    econ_loss: number;
    IDC_loss: number;
    jobs_loss: number;
    grant_funds_25k: number;
    econ_loss_25k: number;
    IDC_loss_25k: number;
    grant_funds_log: number;
    econ_loss_log: number;
    IDC_loss_log: number;
    fiscal_year: number;
    layerName: string;
};

export type HoverInfo = {
    properties: TileProperties;
    x: number;
    y: number;
}

type Props = {
    hoverInfo: HoverInfo | null;
};

export const HoverInfoComponent: React.FC<Props> = ({ hoverInfo }) => {
    if (!hoverInfo) {
        return null;
    }

    const { properties, x, y } = hoverInfo;

    const {
        county,
        state,
        pop_2024,
        grant_funds,
        econ_loss,
    } = properties;

    return (
        <Popover.Root open={!!hoverInfo}>
            <Popover.Anchor style={{ position: 'absolute', left: x, top: y }} />
            <Popover.Content
                className="radix-popover-content" // Add your styles for the popover content
                sideOffset={5} // Adjust the distance from the anchor
            >
                <h3>{county}, {state}</h3>
                <p>Population (2024): {pop_2024}</p>
                <p>Grant Funds: {grant_funds}</p>
                <p>Economic Loss: {econ_loss}</p>
                <Popover.Close>Close</Popover.Close>
            </Popover.Content>
        </Popover.Root>
    );
};
