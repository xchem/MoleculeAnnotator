const path = require("path");
const express = require('express');
const process = require('process');
const fs = require("fs");

const yargs = require('yargs');
const yaml = require('js-yaml');

const { Sequelize, DataTypes } = require('sequelize');


async function handleGetArgs(event, action, state) {
    console.log('Handling input args...');
    console.log(state.args);
  return state.args;
}

async function handleGetInputData(event, action, state) {
    console.log('Handling input data request...');
    console.log(state.inputData);
    return state.inputData;
}

async function handleGetOutputData(event, action, state,) {
    console.log('Handling output data request...');
    console.log(await state.outputData);
    return await state.outputData;
}

// async function saveOutputData(event, action, state, ) {
//     // Save output data

//     if (typeof state.outputData[action.dataIdx] === 'undefined') {
//       state.outputData[action.dataIdx] = {};
//     }
//     state.outputData[action.dataIdx][action.landmarkIdx] = action.annotation;

//     try {
//       console.log(`Writing to path: ${state.args.out}`);
//       console.log(state.outputData);  
//       fs.writeFileSync(
//           state.args.out,
//           yaml.dump(state.outputData),
//     );
//     } catch(error) {
//         console.log(error);
//     }
// }

async function saveOutputData(event, action, state, ) {
    // Save output data

  let db = await state.db
  const Annotation = await db.define('Annotation', {
    dataIdx: DataTypes.INTEGER,
    landmarkIdx: DataTypes.INTEGER,
    annotation: DataTypes.STRING,  
  });

  const annotation = await Annotation.create({
    dataIdx: action.dataIdx,
    landmarkIdx: action.landmarkIdx,
    annotation: action.annotation
  });

  console.log('Finding annotations!');
  const annotations = await Annotation.findAll();
  console.log(annotations);
}



async function getFileFromPath(event, action, state) {
    // Load data from file
    console.log(`Load data action`);
    console.log(action);
    console.log(`Load data event`);
    console.log(event);
    if (fs.existsSync(action.path)) {
      const data = fs.readFileSync(action.path);
      return data;
    } else {
      console.log(`No such path: ${action.path}`);
      return null;
    }
  }


async function writeFileToPath(event, action, state) {
    // Write data to file
    fs.writeFileSync(action.path, action.pdb, {
      flag: "w"
    })
  }

// async function testWriteDatabase(event, action, state) {
//   let db = await state.db
//   const User = await db.define('User', {
//   username: DataTypes.STRING,
//   birthday: DataTypes.DATE,
//   });

//   const jane = await User.create({
//     username: 'janedoe',
//     birthday: new Date(1980, 6, 20),
//   });

//   console.log('Finding users!');
//   const users = await User.findAll();
//   console.log(users);

// }



let handlerMap = {
    'get-args': handleGetArgs,
    'get-input-data': handleGetInputData,
    'get-output-data': handleGetOutputData,
    'save-output-data': saveOutputData,
    'get-file-from-path': getFileFromPath,
    'write-file-to-path': writeFileToPath,
    // 'test-write-database': testWriteDatabase
}

module.exports = {
    handlerMap
};