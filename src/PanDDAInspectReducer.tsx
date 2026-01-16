import { original, current } from 'immer';

function updateEvent(draft, record) {
    console.log('Updating record...');
    console.log(record);
    draft.dtag = record.dtag;
    draft.event_idx = record.event_idx;

    draft.site = record.site_idx;
    draft.bdc = record['1-BDC'];
    draft.x = record.x;
    draft.y = record.y;
    draft.z = record.z;
    draft.z_blob_peak = record.z_peak;
    draft.z_blob_size = record.cluster_size;
    draft.resolution = record.high_resolution;
    draft.map_uncertainty = record.map_uncertainty;
    draft.r_work = record.r_work;
    draft.r_free = record.r_free;

    draft.event_comment = record['Comment'];
    draft.event_interesting = record['Interesting'];
    draft.ligand_placed = record['Ligand Placed'];
    draft.ligand_confidence = record['Ligand Confidence'];
}

function updateSite(draft, record) {
    draft.site_name = record['Name'];
    draft.site_comment = record['Comment'];
}


export function panDDAInspectReducer(draft, action) {
    switch (action.type) {

        case 'handleSetInitialData': {
            console.log('Setting initial data');
            // Get the first input annotation without an output annotation
            
            draft.data = action.inputData;
            const record = action.df[0];
            updateEvent(draft, record);
            console.log('Set initial data');
            break;
        }

        case 'handleGetArgs': {
            console.log('Setting args');
            draft.args = action.args;
            console.log('Set args');
            break;
        }
        case 'handleGetInputData': {
            console.log('Setting args');
            draft.inputData = action.inputData;
            console.log('Set InputData');
            break;
        }
        case 'handleGetOutputData': {
            console.log('Setting args');
            draft.outputData = action.outputData;


            console.log('Set outputData');
            break;
        }
        case 'handleGetInitialState': {
            draft.args = action.args;
            draft.inputData = action.inputData;
            draft.outputData = action.outputData;
            console.log('Handling set initial state');
            console.log(action.args);
            console.log(action.inputData);
            console.log(action.outputData);

            for (let i = 1; i < action.inputData.length; i += 1) {
                if (typeof action.outputData[i] === 'undefined') {
                    draft.dataIdx = i;
                    draft.landmarkIdx = 1;
                }
            }
            break;
        }
        case 'handleGetLigandFiles': {
            console.log('getting ligand files');
            draft.ligandFiles = action.ligandFiles;
            console.log('set ligand files');
            break;
        }
        case 'setActiveProteinMol': {
            console.log(`setting active protein mol to: ${action.val}`);
            draft.activeProteinMol = action.val;
            console.log('set active protein mol');
            break;
        }
        case 'setActiveLigandMol': {
            console.log(`setting active ligand mol to: ${action.val}`);
            draft.activeLigandMol = action.val;
            console.log('set active ligand mol');
            break;
        }
        case 'updateData': {
            console.log('Updating data in working table...')
            draft.data[draft.table_idx]['Comment'] = draft.event_comment;
            draft.data[draft.table_idx]['Interesting'] = draft.event_interesting;
            draft.data[draft.table_idx]['Ligand Placed'] = draft.ligand_placed;
            draft.data[draft.table_idx]['Ligand Confidence'] = draft.ligand_confidence;
            console.log('Updated!')
            console.log(current(draft.data[draft.table_idx]));
            break;
        }

        case 'updateSiteData': {
            console.log('Updating data in working table...')
            draft.siteData[parseInt(draft.site)]['Name'] = draft.site_name;
            draft.siteData[parseInt(draft.site)]['Comment'] = draft.site_comment;
            console.log('Updated!')
            console.log(current(draft.siteData[draft.site]));
            break;
        }

        // Event control
        case 'handleSelectEvent': {
            console.log(`Selecting event...`);
            let new_index = action.value;
            console.log(`Next event is ${new_index}...`);
            draft.table_idx = new_index;
            const record = draft.data[new_index];
            updateEvent(draft, record);
            const siteRecord = draft.siteData.filter((_siteRecord) => { return (parseInt(_siteRecord.site_idx) == record.site_idx) })[0];
            updateSite(draft, siteRecord);
            break;
        }
        case 'handleChangeDataLandmark': {
            // console.log(`Next event from ${draft.table_idx}...`);
            // console.log(`loading status: ${draft.loading}`);
            // if (draft.loading == true) {
            //     console.log('Still loading data! Skipping!');
            //     break;
            // } else {
            //     console.log('Ready to begin loading new data!');
            // }

            draft.dataIdx = action.dataIdx;
            draft.landmarkIdx = action.landmarkIdx;
            draft.loading = true;

            break;
        }

        case 'handleNextUnviewed': {
            const data = original(draft.data);
            console.log(data);
            // console.log(original(draft.table_idx));
            const nextUnviewedEvents = data.filter((_record) => {
                return ((!_record['Viewed']) && (_record[''] > draft.table_idx));
            }
            );
            console.log(nextUnviewedEvents);
            if (nextUnviewedEvents.length == 0) {
                alert('No unviwed events of higher number remain!');
            } else {
                const newRecordIDX = nextUnviewedEvents[0][''];
                console.log(`New index is: ${newRecordIDX}...`);
                const record = data[newRecordIDX];
                updateEvent(draft, record);
                const siteRecord = draft.siteData.filter((_siteRecord) => { return (parseInt(_siteRecord.site_idx) == record.site_idx) })[0];
                updateSite(draft, siteRecord);
                draft.table_idx = newRecordIDX;

            }
            break;
        }
        case 'handleNextUnmodelled': {
            const data = original(draft.data)
            console.log(data);

            const nextUnviewedEvents = draft.data.filter((_record) => {
                return ((!_record['Ligand Placed']) && (_record[''] > draft.table_idx));
            }
            );
            console.log(nextUnviewedEvents);

            if (nextUnviewedEvents.length == 0) {
                alert('No unmodelled events of higher number remain!');
            } else {
                const newRecordIDX = nextUnviewedEvents[0][''];
                console.log(`New index is: ${newRecordIDX}...`);
                const record = draft.data[newRecordIDX];
                updateEvent(draft, record);
                const siteRecord = draft.siteData.filter((_siteRecord) => { return (parseInt(_siteRecord.site_idx) == record.site_idx) })[0];
                updateSite(draft, siteRecord);
                draft.table_idx = newRecordIDX;

            }
            break;
        }
        case 'handleNextEventDontSave': {

            console.log(`Next event from ${draft.table_idx}...`);
            let new_index = 0;
            if (draft.table_idx == (draft.data.length - 1)) {
                new_index = 0;
            } else {
                new_index = draft.table_idx + 1;
            }
            console.log(`Next event is ${new_index}...`);

            const record = draft.data[new_index];
            updateEvent(draft, record);
            const siteRecord = draft.siteData.filter((_siteRecord) => { return (parseInt(_siteRecord.site_idx) == record.site_idx) })[0];
            updateSite(draft, siteRecord);
            draft.table_idx = new_index;

            break;
        }


        // Model control


        // Annotation

        case 'handleSetEventComment': {

            if ((typeof action.value) != undefined) {
                draft.event_comment = action.value;
            }
            break;
        }


        case 'handleSetEventComment': {

            if ((typeof action.value) != undefined) {
                draft.event_comment = action.value;
            }
            break;
        }

        // handleSetInteresting
        case 'handleSetInteresting': {
            if ((typeof action.value) != undefined) {

                draft.event_interesting = action.value;
            }
            break;
        }
        // handleSetPlaced
        case 'handleSetPlaced': {
            if ((typeof action.value) != undefined) {

                draft.ligand_placed = action.value;
            }
            break;
        }
        // handleSetConfidence
        case 'handleSetConfidence': {
            if ((typeof action.value) != undefined) {

                draft.ligand_confidence = action.value;
            }
            break;
        }
        // handleSetSiteName
        case 'handleSetSiteName': {
            if ((typeof action.value) != undefined) {
                draft.site_name = action.value;
            }
            break;
        }
        // handleSetSiteComment
        case 'handleSetSiteComment': {
            if ((typeof action.value) != undefined) {
                draft.site_comment = action.value;
            }
            break;
        }

        case 'finishedLoading': {
            console.log('Finished loading!');
            draft.loading = false;
            break;
        }

        case 'updateOutputData': {
            if (draft.loading == true) {
                console.log('Still loading data! Skipping!');
                break;
            } else {
                console.log('Ready to begin loading new data!');
            }

            draft.dataIdx = action.dataIdx;
            draft.landmarkIdx = action.landmarkIdx;
            draft.loading = true;
            if (typeof draft.outputData[action.dataIdx] === 'undefined') {
                draft.outputData[action.dataIdx] = {}
            }
            draft.outputData[action.dataIdx][action.landmarkIdx] = action.annotation


            break;
        }

        // Misc
        //handleLoadInputMTZ
        //handleLoadGroundState
        //handleLoadInputStructure
        //handleCreateNewLigand
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}