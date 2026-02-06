import {
    MoorhenMolecule, addMolecule,
    removeMolecule, MoorhenMap, addMap, removeMap, hideMolecule, hideMap, setActiveMap,
} from 'moorhen';

import path from 'path-browserify';

import { structureFactors } from './PanDDA2Constants';

function tableIdxToEvent(idx, pandda_inspect_state) {
    console.log(pandda_inspect_state.data);
    console.log(idx);
    const record = pandda_inspect_state.data[idx];
    console.log(record);
    return {
        args: pandda_inspect_state.args,
        ligandFiles: pandda_inspect_state.ligandFiles,
        dtag: record.dtag,
        event_idx: record.event_idx,
        site: record.site_idx,
        bdc: record['1-BDC'],
        x: record.x,
        y: record.y,
        z: record.z,
        z_blob_peak: record.z_peak,
        z_blob_size: record.cluster_size,
        resolution: record.high_resolution,
        map_uncertainty: record.map_uncertainty,
        r_work: record.r_work,
        r_free: record.r_free,

        event_comment: record['Comment'],
        event_interesting: record['Interesting'],
        ligand_placed: record['Ligand Placed'],
        ligand_confidence: record['Ligand Confidence'],
    };
}

async function loadMoleculeFromPath(commandCentre, glRef, dispatch, mol_path, mol_name, cifs) {

    if (path && mol_name) {

        const newMolecule = new MoorhenMolecule(commandCentre, glRef);
        console.log(`Getting data from: ${mol_path}`)

        const data = await window.electronAPI.getFileFromPath({ path: mol_path });
        console.log(data);

        if (data == null) {
            return null;
        }

        const chunkSize = 65536
        let pdbStr: string = ""
        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            pdbStr += String.fromCharCode.apply(null, chunk);
        }
        console.log(pdbStr);
        console.log(commandCentre);
        console.log(glRef);
        console.log('await load molecule from string...');
        try {
            await newMolecule.loadToCootFromString(pdbStr, mol_name);
        } catch (error) {
            throw error;
        }
        console.log(newMolecule);

        console.log('Adding ligands...')
        if (cifs.length > 0) {
            for (const _cifFilePathIndex in cifs) {
                console.log(`Loading cif from ${cifs[_cifFilePathIndex]}`);
                const ligandData = await window.electronAPI.getFileFromPath({ path: cifs[_cifFilePathIndex] });
                console.log(ligandData);
                const chunkSize = 65536
                let ligandString: string = ""
                for (let i = 0; i < ligandData.length; i += chunkSize) {
                    const chunk = ligandData.slice(i, i + chunkSize);
                    ligandString += String.fromCharCode.apply(null, chunk);
                }
                console.log(ligandString);
                await newMolecule.addDict(ligandString)
            };
        }

        console.log(newMolecule);

        console.log('await draw molecule...');
        await newMolecule.fetchIfDirtyAndDraw('CBs');

        // Dispatch the new molecule to Moorhen
        console.log('await dispatch molecule...');

        await dispatch(addMolecule(newMolecule));

        return newMolecule;

    }

}

export async function loadMoleculeData(commandCentre, glRef, dispatch, mol_path, cifs) {

        console.log(`Getting data from: ${mol_path}`)

        const data = await window.electronAPI.getFileFromPath({ path: mol_path });
        console.log(data);

        if (data == null) {
            return null;
        }

        const chunkSize = 65536
        let pdbStr: string = ""
        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            pdbStr += String.fromCharCode.apply(null, chunk);
        }
        console.log(pdbStr);
        console.log(commandCentre);
        console.log(glRef);
        console.log('await load molecule from string...');

        return pdbStr;
}

export async function loadMoleculeFromData(commandCentre, glRef, dispatch, mol_data, mol_name, cifs) {

    if (path && mol_name) {

        const newMolecule = new MoorhenMolecule(commandCentre, glRef);
        
        try {
            await newMolecule.loadToCootFromString(mol_data, mol_name);
        } catch (error) {
            throw error;
        }
        console.log(newMolecule);

        console.log('Adding ligands...')
        if (cifs.length > 0) {
            for (const _cifFilePathIndex in cifs) {
                console.log(`Loading cif from ${cifs[_cifFilePathIndex]}`);
                const ligandData = await window.electronAPI.getFileFromPath({ path: cifs[_cifFilePathIndex] });
                console.log(ligandData);
                const chunkSize = 65536
                let ligandString: string = ""
                for (let i = 0; i < ligandData.length; i += chunkSize) {
                    const chunk = ligandData.slice(i, i + chunkSize);
                    ligandString += String.fromCharCode.apply(null, chunk);
                }
                console.log(ligandString);
                await newMolecule.addDict(ligandString)
            };
        }

        console.log(newMolecule);

        console.log('await draw molecule...');
        await newMolecule.fetchIfDirtyAndDraw('CBs');

        // Dispatch the new molecule to Moorhen
        console.log('await dispatch molecule...');

        await dispatch(addMolecule(newMolecule));

        return newMolecule;

    }

}

async function loadMapFromPath(commandCentre, glRef, dispatch, map_path, map_name, ) {

    if (path && map_name) {

        const newMap = new MoorhenMap(commandCentre, glRef);
        console.log(map_path);
        console.log(`Loading map from: ${map_path}`);
        const data = await window.electronAPI.getFileFromPath({ path: map_path });
        console.log(data);
        console.log('await load map...');
        await newMap.loadToCootFromMapData(data, map_name, false);
        newMap.isEM = false;
        // if (!(coord == null)) {
        //     newMap.mapCentre = coord;
        //     console.log('await centre map...');

        //     await newMap.centreOnMap();
        // }

        // Dispatch the new molecule to Moorhen
        console.log('await dispatch map...');
        await dispatch(addMap(newMap));

        console.log(`setting active map: ${newMap.molNo}`);
        await dispatch(setActiveMap(newMap));
    }

}

export async function loadMTZData(commandCentre, glRef, dispatch, map_path, coord) {
        const data = await window.electronAPI.getFileFromPath({ path: map_path });
        console.log(data);
        const newMap = new MoorhenMap(commandCentre, glRef);

        for (var index in structureFactors) {
            try {
                console.log(`Trying to open mtz with ${structureFactors[index].f} ${structureFactors[index].phi}`);
                const selectedColumns = { 
                    F: structureFactors[index].f, 
                    PHI: structureFactors[index].phi, 
                    Fobs: null, 
                    SigFobs: null, 
                    FreeR: null, 
                    isDifference: false, 
                    useWeight: false, 
                    calcStructFact: false 
                }
                await newMap.loadToCootFromMtzData(data, 'map_name', selectedColumns);
                console.log(newMap);
                break;
            }
            catch (error) {
                console.log(error);
            }
        }
        return newMap;

}

export async function loadMTZFromData(commandCentre, glRef, dispatch, newMap, map_name, coord) {

    // const newMap = new MoorhenMap(commandCentre, glRef);

    // console.log('await load map...');
    // for (var index in structureFactors) {
    //     try {
    //         console.log(`Trying to open mtz with ${structureFactors[index].f} ${structureFactors[index].phi}`);
    //         const selectedColumns = { 
    //             F: structureFactors[index].f, 
    //             PHI: structureFactors[index].phi, 
    //             Fobs: null, 
    //             SigFobs: null, 
    //             FreeR: null, 
    //             isDifference: false, 
    //             useWeight: false, 
    //             calcStructFact: false 
    //         }
    //         await newMap.loadToCootFromMtzData(data, map_name, selectedColumns);
    //         console.log(newMap);
    //         break;
    //     }
    //     catch (error) {
    //         console.log(error);
    //     }
    // }
    // newMap.isEM = false;
    // if (!(coord) == null) {
    //     newMap.mapCentre = coord;
    //     console.log('await centre map...');

    //     await newMap.centreOnMap();
    // }

    // Dispatch the new molecule to Moorhen
    console.log('await dispatch map...');
    await dispatch(addMap(newMap));

    console.log(`setting active map: ${newMap.molNo}`);
    await dispatch(setActiveMap(newMap));
    }




async function loadMTZFromPath(commandCentre, glRef, dispatch, map_path, map_name, coord) {

    if (path && map_name) {

        const newMap = new MoorhenMap(commandCentre, glRef);

        const data = await window.electronAPI.getFileFromPath({ path: map_path });
        console.log(data);

        console.log('await load map...');
        for (var index in structureFactors) {
            try {
                console.log(`Trying to open mtz with ${structureFactors[index].f} ${structureFactors[index].phi}`);
                const selectedColumns = { 
                    F: structureFactors[index].f, 
                    PHI: structureFactors[index].phi, 
                    Fobs: null, 
                    SigFobs: null, 
                    FreeR: null, 
                    isDifference: false, 
                    useWeight: false, 
                    calcStructFact: false 
                }
                await newMap.loadToCootFromMtzData(data, map_name, selectedColumns);
                console.log(newMap);
                break;
            }
            catch (error) {
                console.log(error);
            }
        }
        // newMap.isEM = false;
        // if (!(coord) == null) {
        //     newMap.mapCentre = coord;
        //     console.log('await centre map...');

        //     await newMap.centreOnMap();
        // }

        // Dispatch the new molecule to Moorhen
        console.log('await dispatch map...');
        await dispatch(addMap(newMap));

        console.log(`setting active map: ${newMap.molNo}`);
        await dispatch(setActiveMap(newMap));
    }

}


async function updateData(dispatch) {
    dispatch(
        {
            'type': 'updateData',
        }
    );

}

async function saveData(pandda_inspect_state) {
    await window.electronAPI.saveData({ data: pandda_inspect_state.data });
}

async function removeMolJS(coot_dispatch, _mol) {
    console.log(`removing mol ${_mol.molNo}`);
    await coot_dispatch(hideMolecule({ molNo: _mol.molNo }));
    await coot_dispatch(removeMolecule(_mol));
}
async function removeMapJS(coot_dispatch, _map) {
    console.log(`removing map ${_map.molNo}`);
    await coot_dispatch(hideMap({ molNo: _map.molNo }));
    await coot_dispatch(removeMap(_map));
}

async function updateCentre(state, dataIdx, landmarkIdx, mol) {
    console.log(`Updating centre to: dataIdx: ${dataIdx}; landmarkIdx: ${landmarkIdx}`)
    if (typeof state.inputData[dataIdx].landmarks[landmarkIdx] === 'undefined') {
        return false;
    }
    let chain = state.inputData[dataIdx].landmarks[landmarkIdx][0];
    let res = state.inputData[dataIdx].landmarks[landmarkIdx][1];
    let cid = `//${chain}/${res}`;
    console.log(`cid: ${cid}`);
    console.log(mol);
    await mol.centreOn(cid);
    return true;
}

export async function getData() {

}

export async function loadXtalData(
    cootInitialized, 
    glRef, 
    commandCentre, 
    molecules, 
    maps, 
    coot_dispatch, 
    dispatch, 
    state,
    dataIdx,
    landmarkIdx
) {
    console.log('Loading molecule if possible...');

    if (cootInitialized && glRef.current && commandCentre.current && (!(typeof state.inputData[1] === 'undefined'))) {
        console.log('   Loading molecule!')
        // console.log(molecules);
        // console.log(maps);
        // console.log('Awaiting delete molecules...');
        await molecules.moleculeList.map((_mol) => {
            removeMolJS(coot_dispatch, _mol);
        });
        // console.log('Awaiting delete maps...');
        // console.log(maps);
        await maps.map((_map) => {
            removeMapJS(coot_dispatch, _map);
        });

        // Create the new molecule
        let newMolecule;
        let newMoleculeData;

        console.log(`Loading from dataIdx: ${dataIdx}`);
        console.log(state.inputData);
        console.log(state.inputData[dataIdx]);
        const mol_name = state.inputData[dataIdx].dtag;
        const mol_path = state.inputData[dataIdx].pdb;
        // console.log(`Loading mol from ${mol_path}`)
        // console.log('Awaiting load molecule...');
        // console.log(state.ligandFiles.get(mol_name));
        if (typeof state.nextMoleculeData[mol_path] === 'undefined') {
            newMoleculeData = await loadMoleculeData(commandCentre, glRef, coot_dispatch, mol_path, []);
        } else {
            newMoleculeData = await state.nextMoleculeData[mol_path];
        }
        newMolecule = await loadMoleculeFromData(commandCentre, glRef, coot_dispatch, newMoleculeData, mol_name, []);

        // console.log(`newMolecule is ${newMolecule}`);    
        console.log('New molecule');
        console.log(newMolecule);
        console.log(state);
        console.log(dataIdx);
        console.log(landmarkIdx);
        let gotLandmark = await updateCentre(state, dataIdx, landmarkIdx, newMolecule);
        if (!gotLandmark) {
                alert('Got no landmarks for this dataset! Skip to next one!');
            }

        const map_name = mol_name;
        const map_path = state.inputData[dataIdx].xmap;
        try {
            
            let nextXMapData;
            // console.log(`Loading map from ${map_path}`)
            // console.log('Awaiting load map...');
            // console.log(`Centering ${[pandda_inspect_state.x, pandda_inspect_state.y, pandda_inspect_state.z]}`);
            // console.log(`Loading: ${map_path} as ${map_name}`);
            if (typeof state.nextXMapData[map_path] === 'undefined') {
                nextXMapData = await loadMTZData(commandCentre, glRef, coot_dispatch, map_path, []);
            } else {
                nextXMapData = await state.nextXMapData[map_path];
            }
            await loadMTZFromData(commandCentre, glRef, coot_dispatch, nextXMapData, map_name, null);
        console.log('completed loading event data');
        } catch (error) { 
            console.log(error);
        }

        console.log('completed setting active map');

        dispatch(
            {
                'type': 'setActiveProteinMol',
                'val': newMolecule.molNo,
            }
        );
        dispatch(
            {
                'type': 'finishedLoading'
            }
        );

        dispatch(
            {
                'type': 'unloadData',
                'mol_path': mol_path,
                'map_path': map_path
            }
        );
        if (!(typeof state.inputData[dataIdx+1] === 'undefined')) {
            const molPath = state.inputData[dataIdx+1].pdb;
            const mapPath = state.inputData[dataIdx+1].xmap;
            
            let molDataFuture = loadMoleculeData(commandCentre, glRef, coot_dispatch, molPath, []);
            let xmapDataFuture = loadMTZData(commandCentre, glRef, coot_dispatch, mapPath, []);
            dispatch(
                {
                    'type': 'preloadData',
                    'molPath': molPath,
                    'mapPath': mapPath,
                    'molDataFuture': molDataFuture,
                    'xmapDataFuture': xmapDataFuture
                }
            );
        }


    }
}

async function saveModel(molecules, pandda_inspect_state) {
    const molPath = path.join(pandda_inspect_state.args, 'processed_datasets', pandda_inspect_state.dtag, 'modelled_structures', `${pandda_inspect_state.dtag}-pandda-model.pdb`);
    const activeMol = molecules.moleculeList.filter((_mol) => { return _mol.molNo == pandda_inspect_state.activeProteinMol; })[0];
    const molPDB = await activeMol.getAtoms();
    console.log(`Saving model to: ${molPath}`);
    await window.electronAPI.saveModel(
        {
            path: molPath,
            pdb: molPDB,
        }
    );
}




export async function handleNextLandmark(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, setIsLoading) {
    console.log('Select event');
    async function nextLandmark() {
        let dataIdx = state.dataIdx;
        let landmarkIdx = state.landmarkIdx;
        let landmarks = state.inputData[dataIdx].landmarks;
        console.log(`dataIDX: ${dataIdx}; landmarkIdx: ${landmarkIdx}; landmarks: ${landmarks}`)
        console.log('Next landmark function state:');
        console.log(state);
        
        // Handle if moving onto new data
        if (typeof landmarks[landmarkIdx+1] === 'undefined') {
            // console.log('Moving to new data!');
            // const nextDataIdx = dataIdx + 1;
            // const nextLandmarkIdx = 1;
            // if (typeof state.inputData[nextDataIdx] === 'undefined') {
            //     alert('No more data!');
            //     dispatch(
            //         {
            //             'type': 'finishedLoading'
            //         }
            //     );
            //     setIsLoading(false);
            // } else {
            //     dispatch(
            //     {
            //         type: 'handleChangeDataLandmark',
            //         commandCentre: commandCentre,
            //         glRef: glRef,
            //         dataIdx: nextDataIdx,
            //         landmarkIdx: nextLandmarkIdx,
            //     });
            //     await loadXtalData(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, nextDataIdx, nextLandmarkIdx);
            //     dispatch(
            //         {
            //             'type': 'finishedLoading'
            //         }
            //     );
            //     setIsLoading(false);

        // }
            await handleNextData(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, setIsLoading);
        } 
        // Otherwise handle moving to next annotation in view
        else {
            console.log('New landmark same data!');
            const nextDataIdx = dataIdx;
            const nextLandmarkIdx = landmarkIdx + 1;
            console.log(`Before dispatch landmark idx: ${state.landmarkIdx}`)
            dispatch(
                {
                    type: 'handleChangeDataLandmark',
                    commandCentre: commandCentre,
                    glRef: glRef,
                    dataIdx: nextDataIdx,
                    landmarkIdx: nextLandmarkIdx,
                }
            );
            console.log(`After dispatch landmark idx: ${state.landmarkIdx}`)

            dispatch(
                {
                    'type': 'finishedLoading'
                }
            );
            const activeMol = molecules.moleculeList.filter(
                (_mol) => { return _mol.molNo == state.activeProteinMol; })[0];
            console.log(`Centering on mol: ${activeMol}`);
            let gotLandmark = await updateCentre(state, nextDataIdx, nextLandmarkIdx, activeMol);
            if (!gotLandmark) {
                alert('Got no landmarks for this dataset! Skip to next one!');
            }
            setIsLoading(false);
        }
        console.log(state);
        // await updateData(state);
        // await saveData(state);
        // console.log(state);

        
    }
    nextLandmark();
}

export async function handlePreviousLandmark(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, setIsLoading) {
console.log('Select event');
    async function previousLandmark() {
        let dataIdx = state.dataIdx;
        let landmarkIdx = state.landmarkIdx;
        let landmarks = state.inputData[dataIdx].landmarks;
        console.log(`dataIDX: ${dataIdx}; landmarkIdx: ${landmarkIdx}; landmarks: ${landmarks}`)
        console.log('Next landmark function state:');
        console.log(state);
        
        // Handle if moving onto previous data
        if (typeof landmarks[landmarkIdx-1] === 'undefined') {
        //     console.log('Moving to new data!');
        //     const previousDataIdx = dataIdx - 1;
        //     const previousLandmarkIdx = 1;
        //     if (typeof state.inputData[previousDataIdx] === 'undefined') {
        //         alert('No more data!');
        //         setIsLoading(false);
        //     } else {
        //         dispatch(
        //         {
        //             type: 'handleChangeDataLandmark',
        //             commandCentre: commandCentre,
        //             glRef: glRef,
        //             dataIdx: previousDataIdx,
        //             landmarkIdx: previousLandmarkIdx,
        //         });
        //         await loadXtalData(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, previousDataIdx, previousLandmarkIdx);
        //         setIsLoading(false);
        // }
            await handlePreviousData(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, setIsLoading)
        } 
        // Otherwise handle moving to next annotation in view
        else {
            console.log('New landmark same data!');
            const previousDataIdx = dataIdx;
            const previousLandmarkIdx = landmarkIdx - 1;
            console.log(`Before dispatch landmark idx: ${state.landmarkIdx}`)
            dispatch(
                {
                    type: 'handleChangeDataLandmark',
                    commandCentre: commandCentre,
                    glRef: glRef,
                    dataIdx: previousDataIdx,
                    landmarkIdx: previousLandmarkIdx,
                }
            );
            console.log(`After dispatch landmark idx: ${state.landmarkIdx}`)

            dispatch(
                {
                    'type': 'finishedLoading'
                }
            );
            const activeMol = molecules.moleculeList.filter(
                (_mol) => { return _mol.molNo == state.activeProteinMol; })[0];
            console.log(`Centering on mol: ${activeMol}`);
            let gotLandmark = await updateCentre(state, previousDataIdx, previousLandmarkIdx, activeMol);
            if (!gotLandmark) {
                alert('Got no landmarks for this dataset! Skip to next one!');
            }
            setIsLoading(false);
        }
        console.log(state);
    }
    previousLandmark();
}

export async function handleNextData(
    cootInitialized, glRef, commandCentre, molecules, maps, 
    coot_dispatch, dispatch, state, setIsLoading) {
    // Get the next data
    console.log('Select event');
    async function nextData() {
        let dataIdx = state.dataIdx;
        let landmarkIdx = state.landmarkIdx;
        let landmarks = state.inputData[dataIdx].landmarks;
        console.log(`dataIDX: ${dataIdx}; landmarkIdx: ${landmarkIdx}; landmarks: ${landmarks}`)
        console.log('Next landmark function state:');
        console.log(state);
        
        // Handle if moving onto new data
        console.log('Moving to new data!');
        const nextDataIdx = dataIdx + 1;
        const nextLandmarkIdx = 1;
        if (typeof state.inputData[nextDataIdx] === 'undefined') {
            alert('No more data!');
            setIsLoading(false);

        } else {
            dispatch(
            {
                type: 'handleChangeDataLandmark',
                commandCentre: commandCentre,
                glRef: glRef,
                dataIdx: nextDataIdx,
                landmarkIdx: nextLandmarkIdx,
            });
            await loadXtalData(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, nextDataIdx, nextLandmarkIdx);
            setIsLoading(false);
        }
        console.log(state);
        // await updateData(state);
        // await saveData(state);
        // console.log(state);

        
    }
    nextData();
}

export async function handlePreviousData(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, setIsLoading,) {
// Get the next data
    console.log('Select event');
    async function previousData() {
        let dataIdx = state.dataIdx;
        let landmarkIdx = state.landmarkIdx;
        let landmarks = state.inputData[dataIdx].landmarks;
        console.log(`dataIDX: ${dataIdx}; landmarkIdx: ${landmarkIdx}; landmarks: ${landmarks}`)
        console.log('Next landmark function state:');
        console.log(state);
        
        // Handle if moving onto new data
        console.log('Moving to new data!');
        const previousDataIdx = dataIdx - 1;
        const previousLandmarkIdx = 1;
        if (typeof state.inputData[previousDataIdx] === 'undefined') {
            alert('No more data!');
            setIsLoading(false);
        } else {
            dispatch(
            {
                type: 'handleChangeDataLandmark',
                commandCentre: commandCentre,
                glRef: glRef,
                dataIdx: previousDataIdx,
                landmarkIdx: previousLandmarkIdx,
            });
            await loadXtalData(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, previousDataIdx, previousLandmarkIdx);
            setIsLoading(false);
        }
        console.log(state);
        // await updateData(state);
        // await saveData(state);
        // console.log(state);

        
    }
    previousData();
}

export async function handleNextUnviewed(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, setIsLoading) {
    let changed = false;
    async function nextUnviewed() {
        let outputDataIdxs = {};
        for (var key in state.outputData) {
            outputDataIdxs[state.outputData[key].dataIdx] = true;
        };
        
        for (var key in state.inputData) {
            if (typeof outputDataIdxs[key] === 'undefined') {
                let nextDataIdx = key;
                let nextLandmarkIdx = 1;
                dispatch(
                {
                    type: 'handleChangeDataLandmark',
                    commandCentre: commandCentre,
                    glRef: glRef,
                    dataIdx: nextDataIdx,
                    landmarkIdx: nextLandmarkIdx,
                });
                await loadXtalData(
                    cootInitialized, glRef, commandCentre, molecules, maps, 
                    coot_dispatch, dispatch, state, nextDataIdx, nextLandmarkIdx);
                setIsLoading(false);
                changed = true;
                break;
            }

        }
        if (!changed) {
            alert('All data processed!');
        }
    setIsLoading(false);

    }
    nextUnviewed();
}




function handleSetInitialData(dispatch, df) {
    dispatch(
        {
            type: 'handleSetInitialData',
            df: df
        });
}


export async function handleGetArgs(dispatch, pandda_inspect_state) {
    if (pandda_inspect_state.data.length == 0) {
        const args = await window.electronAPI.getArgs();
        dispatch(
            {
                type: 'handleGetArgs',
                args: args
            });
    }
}

export async function getInputData(dispatch, state) {
    if (state.inputData.length == 0) {
        const inputData = await window.electronAPI.getInputData();
        dispatch(
            {
                type: 'handleGetInputData',
                inputData: inputData
            });
    }
}

export async function getOutputData(dispatch, pandda_inspect_state) {
    if (pandda_inspect_state.data.length == 0) {
        const outputData = await window.electronAPI.getOutputData();
        dispatch(
            {
                type: 'handleGetOutputData',
                outputData: outputData
            });
    }
}

export async function getInitialState(dispatch, state) {
    
    if (state.inputData.length == 0) {
        const args = await window.electronAPI.getArgs(null);
        let inputData = await window.electronAPI.getInputData(null);
        let outputData = await window.electronAPI.getOutputData(null);
        console.log('Requested data');
        console.log(args);
        console.log(inputData);
        console.log(outputData);
        dispatch(
            {
                type: 'handleGetInitialState',
                args: args,
                inputData: inputData,
                outputData: outputData
            });
    }


}

export async function handleTruePositive(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, setIsLoading) {

        async function _handleTruePositive() {
        dispatch(
            {
                type: 'updateOutputData',
                dataIdx: state.dataIdx,
                landmarkIdx: state.landmarkIdx,
                annotation: 'truePositive'
            }
        );
        await window.electronAPI.saveOutputData({ 
            dataIdx: state.dataIdx,
            landmarkIdx: state.landmarkIdx,
            annotation: 'truePositive' 
            }
        );
        await handleNextLandmark(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, setIsLoading);
        dispatch(
            {
                'type': 'finishedLoading'
            }
        );
    }
    _handleTruePositive();
}

export async function handleFalsePositive(cootInitialized, glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, setIsLoading) {
    async function _handleFalsePositive() {
        dispatch(
            {
                type: 'updateOutputData',
                dataIdx: state.dataIdx,
                landmarkIdx: state.landmarkIdx,
                annotation: 'falsePositive'
            }
        );
        await window.electronAPI.saveOutputData({ 
            dataIdx: state.dataIdx,
            landmarkIdx: state.landmarkIdx,
            annotation: 'falsePositive' 
            }
        );
        await handleNextLandmark(
            cootInitialized, 
            glRef, commandCentre, molecules, maps, coot_dispatch, dispatch, state, setIsLoading);
        dispatch(
                {
                    'type': 'finishedLoading'
                }
            );
        }

    _handleFalsePositive();
}

