const fs = require('node:fs');
const path = require("path");

elo_cleanup();
function elo_cleanup(){
    console.log('Cleanup of the ELOs')
    let directory = __dirname+'/../data/elo/';
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
    
        for (const file of files) {
            //console.log(file);
            if(file != '.gitignore'){
                fs.unlink(path.join(directory, file), (err) => {
                    if (err) throw err;
                });
            }
        }
    });
    setTimeout(()=>{
        fs.readdir(directory, (err, files) => {
            if (err) throw err;
            if(files.length <= 1){
                console.log('Cleanup done! Starting calculations');
                elo_calculator();
            }else{
                console.log('Still '+files.length+' to delete! Please wait!');
                elo_cleanup();
            }
        })
    },1000)
}
async function elo_calculator(){
    let directory = __dirname+'/../data/elections/';
    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        let iday = 0;
        for (const file of files) {
            let i = 0;
            iday++;
            if(file != '.gitignore'){
                let elections = fs.readFileSync(__dirname+'/../data/elections/'+file);
                elections = JSON.parse(elections);
                elections.forEach(el => {
                    let winnerScore = 1000;
                    let winnerMod = 0;
                    let winnerArray = [];
                    if (fs.existsSync(__dirname+'/../data/elo/'+el.winner+'.json')) {
                        let winner = fs.readFileSync(__dirname+'/../data/elo/'+el.winner+'.json')
                        winnerArray = JSON.parse(winner);
                        winnerScore = winnerArray[winnerArray.length-1].score;
                    }
                    el.losers.forEach(loser => {
                        let loserScore = 1000;
                        let loserArray = [];
                        if (fs.existsSync(__dirname+'/../data/elo/'+loser+'.json')) {
                            let loserData = fs.readFileSync(__dirname+'/../data/elo/'+loser+'.json')
                            loserArray = JSON.parse(loserData);
                            loserScore = loserArray[loserArray.length-1].score;
                        }
                        let mod = calcElo(winnerScore,loserScore);
                        winnerMod += mod;
                        loserArray.push({
                            time:el.time,
                            score:loserScore-mod
                        })
                        fs.writeFileSync(__dirname+'/../data/elo/'+loser+'.json',JSON.stringify(loserArray));
                    });
                    winnerScore = parseInt(winnerScore)+parseInt(winnerMod);
                    winnerArray.push({
                        time:el.time,
                        score:winnerScore
                    });
                    fs.writeFileSync(__dirname+'/../data/elo/'+el.winner+'.json',JSON.stringify(winnerArray));
                    i++;
                    console.log(Math.round(i/(elections.length)*100)+'% ('+i+"/"+elections.length + ') of day done! Day '+iday+'/'+files.length+'. ' +el.winner + ' Wins! New score is '+winnerScore+'. '+file);
                })
            }
        }
    });
}

function calcElo(winner,loser){
    // Calculation from https://www.omnicalculator.com/sports/elo#how-to-find-elo-rating-change
    let modifier = loser-winner;
    modifier = modifier / 400;
    modifier = 10^modifier;
    modifier = modifier + 1;
    modifier = 1 / modifier;
    modifier = Math.round(modifier * 100);
    return modifier;
}