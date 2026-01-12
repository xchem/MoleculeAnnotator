const path = require("path");
const express = require('express');
const process = require('process');
const fs = require("fs");

const yargs = require('yargs');

let handlerMap = {
    'get-args': HandleGetArgs,
}

async function HandleGetArgs(event,) {
    return path.resolve(yargs(process.argv.slice(1)).parse()._[0])
}

export { handlerMap }