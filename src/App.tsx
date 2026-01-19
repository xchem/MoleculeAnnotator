import { useRef, useEffect } from 'react';
import { MoorhenContainer, MoorhenReduxStore } from 'moorhen';
import { Provider } from 'react-redux';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { useImmerReducer } from 'use-immer';

import './App.css';
import './moorhen.css';

import { PanDDAInspectEventHandlers } from './PanDDAInspectTypes';
import { initialPanDDAInspectState } from './PanDDA2Constants';

import { PanDDAInspect } from './PanDDAInspect';
import { panDDAInspectReducer } from './PanDDAInspectReducer'
import {
  handleNextLandmark,
  handlePreviousLandmark,
  handlePreviousData,
  handleNextData,
  handleNextUnviewed,
  getInputData,
  getOutputData,
  handleGetArgs,
  loadXtalData,
  handleFalsePositive,
  handleTruePositive,
  getInitialState
} from './PanDDAInspectEffects'


const MyMoorhenContainer = (props) => {

  const setDimensions = () => {
    return [Math.ceil(window.innerWidth * 0.8), window.innerHeight]
  }

  return <MoorhenContainer
    setMoorhenDimensions={setDimensions}
    {...props}
  />
}

function MoorhenController() {
  // Moorhen wrapper containing pandda inspect controls
  // console.log(initialPanDDAInspectState);

  // Core react state
  const [state, dispatch] = useImmerReducer(panDDAInspectReducer, initialPanDDAInspectState);

  // Effect to get outputdata
  useEffect(
    () => {
      getInitialState(dispatch, state);
      console.log('# Got initial state!')
    }, []
  )


  // console.log('pandda inspect data');
  // console.log(state.dataIdx);
  // console.log(state.landmarkIdx);
  // console.log(state.inputData);
  // console.log(state.outputData)

  // Setup moorhen variables that event handlers will need
  const glRef = useRef(null);
  const timeCapsuleRef = useRef(null);
  const commandCentre = useRef(null);
  const moleculesRef = useRef(null);
  const mapsRef = useRef(null);
  const collectedProps = {
    glRef, timeCapsuleRef, commandCentre, moleculesRef, mapsRef,
  };
  const cootInitialized = useSelector((coot_state: any) => coot_state.generalStates.cootInitialized);
  const molecules = useSelector((state: any) => state.molecules);
  const maps = useSelector((state: any) => state.maps);
  const coot_dispatch = useDispatch();

  // Define the vent handlers
  const pandda_inspect_event_handlers = {
    handleNextLandmark: (setIsLoading) => { handleNextLandmark(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, setIsLoading) },
    handlePreviousLandmark: (setIsLoading) => { handlePreviousLandmark(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, setIsLoading) },
    handlePreviousData: (setIsLoading) => { handlePreviousData(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, setIsLoading) },
    handleNextData: (setIsLoading) => { handleNextData(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, setIsLoading) },
    handleNextUnviewed: (setIsLoading) => { handleNextUnviewed(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, setIsLoading) },

    handleFalsePositive: (setIsLoading) => { handleFalsePositive(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, setIsLoading) },
    handleTruePositive: (setIsLoading) => { handleTruePositive(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, setIsLoading) },

  };

  // Effect to load events
  useEffect(
    () => {
      console.log('# Getting initial data...');
      loadXtalData(
        cootInitialized, 
        glRef, 
        commandCentre, 
        molecules, 
        maps,
        coot_dispatch, 
        dispatch, 
        state,
        state.dataIdx,
        state.landmarkIdx
      );
      console.log('# Got initial data!');

    },
    [cootInitialized]
  )


  // console.log('Getting initial pandda inspect state');
  // console.log(state);

  // console.log('Getting initial pandda handlers');
  // console.log(pandda_inspect_event_handlers);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={0} columns={10}>
        <Grid size={8}>
          <MyMoorhenContainer {...collectedProps} />
        </Grid>
        <Grid size={2}>
          <PanDDAInspect
            state={state}
            handlers={pandda_inspect_event_handlers}
          ></PanDDAInspect>
        </Grid>
      </Grid>
    </Box>
  );

}

function App() {

  return (
    <div className="App">
      <Provider store={MoorhenReduxStore}>
        <MoorhenController></MoorhenController>
      </Provider>

    </div>
  );
}

export default App;


