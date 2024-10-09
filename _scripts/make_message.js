const fs = require('node:fs');

make_message();
function make_message(){
    let results = '';
    try{
        results = fs.readFileSync(__dirname+'/../data/_results/results-endresult.json');
        results = JSON.parse(results);
    }catch(err){
        console.error(err);
    }

    let quickMessage = '';
    for(let i=0;i<5;i++){
        quickMessage += results[i]["title"] + ' of '+results[i]["album"] + ' ('+results[i]['Current score']+')\n\r';
    }
    fs.writeFileSync(__dirname+'/../data/_results/quickrank-message.txt',quickMessage);
}