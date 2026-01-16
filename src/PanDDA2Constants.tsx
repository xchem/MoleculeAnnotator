import { createTheme } from '@mui/material'

import { LigandConfidence, PanDDAInspectState, LigandPlaced, EventInteresting } from './PanDDAInspectTypes'

export const theme = createTheme({
    spacing: 4,
    typography: {
        // In Chinese and Japanese the characters are usually larger,
        // so a smaller fontsize may be appropriate.
        fontSize: 10,
    },
});


export const structureFactors = [
    { f: 'FWT', phi: 'PHWT' },
    { f: '2FOFCWT', phi: 'PH2FOFCWT' },
    { f: '2FOFCWT', phi: 'PHI2FOFCWT' },
    { f: '2FOFCWT_iso-fill', phi: 'PH2FOFCWT_iso-fill' },
    { f: '2FOFCWT_fill', phi: 'PH2FOFCWT_fill' },
] as const;

export const panddaInspectColumns = [
    'dtag',
    'event_idx',
    'bdc',
    'cluster_size',
    'global_correlation_to_average_map',
    'global_correlation_to_mean_map',
    'local_correlation_to_average_map',
    'local_correlation_to_mean_map',
    'site_idx',
    'x',
    'y',
    'z',
    'z_mean',
    'z_peak',
    'applied_b_factor_scaling',
    'high_resolution',
    'low_resolution',
    'r_free',
    'r_work',
    'analysed_resolution',
    'map_uncertainty',
    'analysed',
    'interesting',
    'exclude_from_z_map_analysis',
    'exclude_from_characterisation',
    '1-BDC',
    'Interesting',
    'Ligand Placed',
    'Ligand Confidence',
    'Comment',
    'Viewed'
] as const;

export type panddaInspectColumnTypes = [
    string,
    BigInt,
    number,
    BigInt,
    number,
    number,
    number,
    number,
    BigInt,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    boolean,
    boolean,
    boolean,
    boolean,
    number,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean
];

export const initialPanDDAInspectState = {
    dataIdx: 1,
    landmarkIdx: 1,
    annotation: '',
    inputData: [],
    outputData: [],
    args: {},
    activeProteinMol: null,
    activeLigandMol: null,
    loading: false
};