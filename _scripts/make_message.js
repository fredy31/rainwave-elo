const fs = require('node:fs');

make_message();
function make_message(){
    let results = '';
    let quickMessage = '';

    // Results
    try{
        results = fs.readFileSync(__dirname+'/../data/_results/results-endresult.json');
        results = JSON.parse(results);
    }catch(err){
        console.error(err);
    }

    quickMessage += '### Best songs per score ###\n\r';
    for(let i=0;i<5;i++){
        quickMessage += results[i]["title"] + ' of '+results[i]["album"] + ' ('+results[i]['Current score']+')\n\r';
    }

    // Outliers
    try{
        results = fs.readFileSync(__dirname+'/../data/_results/biggest_differences_score.json');
        results = JSON.parse(results);
    }catch(err){
        console.error(err);
    }

    quickMessage += '### Biggest differences ###\n\r';
    for(let i=0;i<5;i++){
        quickMessage += results[i]["title"] + ' of '+results[i]["album"] + ' (Vote:'+results[i]['rating']+'; ELO:'+results[i]['rankscore']+'%; Difference of '+results[i]['scoreDiff']+')\n\r';
    }

    // Best Albums
    try{
        results = fs.readFileSync(__dirname+'/../data/_results/averages_album.json');
        results = JSON.parse(results);
    }catch(err){
        console.error(err);
    }

    quickMessage += '### Best Albums ###\n\r';
    for(let i=0;i<5;i++){
        quickMessage += results[i]["elementName"] + ' ('+results[i]['score']+') ['+results[i]['nbOfSongs']+' songs]\n\r';
    }

    // Best Artists
    try{
        results = fs.readFileSync(__dirname+'/../data/_results/averages_artist.json');
        results = JSON.parse(results);
    }catch(err){
        console.error(err);
    }

    quickMessage += '### Best Artists ###\n\r';
    for(let i=0;i<5;i++){
        quickMessage += results[i]["elementName"] + ' ('+results[i]['score']+') ['+results[i]['nbOfSongs']+' songs]\n\r';
    }

    fs.writeFileSync(__dirname+'/../data/_results/_quickrank-message.md',quickMessage);
}