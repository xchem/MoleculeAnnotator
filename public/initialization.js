const yaml = require('js-yaml');
const fs = require('fs');
const { Sequelize, DataTypes } = require('sequelize');

function loadData(path) { 

    let data = {};

    try {
        data = JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch(error) {
        console.log(error)
    }

    return data;

}

async function getDB(out) {

    const sequelize = new Sequelize(
    {
      dialect:"sqlite",
      host:out,
    }
  );

    await sequelize.sync();
  
    sequelize.authenticate();
    console.log("Connected to DB");
    console.log(sequelize)

    const Annotation = sequelize.define('Annotation', {
        dataIdx: DataTypes.INTEGER,
        landmarkIdx: DataTypes.INTEGER,
        annotation: DataTypes.STRING,  
    });
    await sequelize.sync();

    console.log('Finding annotations!');
    const annotations = await Annotation.findAll();
    console.log(annotations);

    return sequelize;

}

async function getOutputData(dbPromise) {
    let db = await dbPromise; 
    const Annotation = db.define('Annotation', {
        dataIdx: DataTypes.INTEGER,
        landmarkIdx: DataTypes.INTEGER,
        annotation: DataTypes.STRING,  
    });
    const annotations = await Annotation.findAll();

    
    let outputData = {};
    for (var dbIdx in annotations) {
        console.log(annotations[dbIdx]);
        let annotation = await annotations[dbIdx];
        if (typeof outputData[annotation.dataIdx] === 'undefined') {
            outputData[annotation.dataIdx] = {};
        }
        outputData[annotation.dataIdx][annotation.landmarkIdx] = annotation.annotation

        
    }
    console.log('outputData')
    console.log(outputData);
    return outputData;
}


module.exports = {
    loadData,
    getDB,
    getOutputData
};
