const config = require('../config.json');
const fs = require('node:fs');

async function convert_to_per_day(){
    let savedElections = '';
    try{
        savedElections = fs.readFileSync(__dirname+'/../data/elections.json')
    }catch(err){
        console.log('Crash')
    }
    savedElections = JSON.parse(savedElections);
    let iSched = 0;
    savedElections.forEach((el)=>{
        iSched++;
        let electionDate = new Date(el.time*1000);
        let electionMonth = ('0' + (electionDate.getMonth()+1)).slice(-2)
        let electionDay = ('0' + (electionDate.getDate())).slice(-2)

        let dayElections = '';
        try{
            dayElections = fs.readFileSync(__dirname+'/../data/elections/'+electionDate.getFullYear()+'-'+electionMonth+'-'+electionDay+'.json')
            //dayElections = JSON.parse(dayElections);
        }catch(err){
            console.log('New month!')
        }

        // If it screws up, restart from scratch
        //console.log(dayElections);
        if(!dayElections){
            dayElections = JSON.parse("[]");
        }else{
            try{
                dayElections = JSON.parse(dayElections);
            }catch{
                dayElections = JSON.parse("[]");;
            }
        }

        dayElections.push(el);

        let seenElections = [];
        let cleanedElections = [];
        dayElections.forEach((el)=>{
            if(!seenElections.includes(el.election_id)){
                seenElections.push(el.election_id);
                cleanedElections.push(el);
            }
        })
        dayElections.sort((a,b)=>a.time-b.time);
        
        try{
            let write = JSON.stringify(cleanedElections);
            fs.writeFileSync(__dirname+'/../data/elections/'+electionDate.getFullYear()+'-'+electionMonth+'-'+electionDay+'.json',write);
        }catch(err){
            console.error(err);
        }

        console.log(Math.round(iSched/savedElections.length*100) + '% (' + iSched + '/' + savedElections.length+') '+electionDate.toString());
    })

    // Remove dupe elections
    /*let seenElections = [];
    let cleanedElections = [];
    savedElections.forEach((el)=>{
        if(!seenElections.includes(el.election_id)){
            seenElections.push(el.election_id);
            cleanedElections.push(el);
        }
    })
    savedElections.sort((a,b)=>a.time-b.time)

    const date = new Date();
    console.log('Currently saved elections: '+cleanedElections.length+' on '+date.toJSON());
    // Write the cache file.
    try{
        let write = JSON.stringify(cleanedElections);
        fs.writeFileSync(__dirname+'/../data/elections.json',write);
    }catch(err){
        console.error(err);
    }*/
}

// Do an auto run every 5 minutes.
// Set it and forget it mode to fetch data.
/*function auto_fetch_elections(){
    fetch_elections();
    setInterval(()=>{
        fetch_elections();
    },1000*60*5);
}*/

// Make it possible to call both functions from the package.json
/*for(var i=0;i<process.argv.length;i++){
    switch(process.argv[i]){
        case 'fetch_elections':
            fetch_elections();
            break;
        case 'auto_fetch_elections':
            auto_fetch_elections();
            break;
    }
}
module.exports.fetch_elections = fetch_elections
module.exports.auto_fetch_elections = auto_fetch_elections*/

convert_to_per_day();