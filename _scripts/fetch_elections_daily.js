const config = require('../config.json');
const fs = require('node:fs');

async function fetch_elections(){
    // Get old elections cache file
    //let savedElections = fs.readFileSync(__dirname+'/../data/elections.json');

    // If it screws up, restart from scratch
    /*if(!savedElections){
        savedElections = JSON.parse("[]");
    }else{
        try{
            savedElections = JSON.parse(savedElections);
        }catch{
            savedElections = JSON.parse("[]");;
        }
    }*/

    // Go through all 5 radios
    let stillGivesResults = true;
    let dateIterator = 0;
    while(stillGivesResults){
        let date = new Date();
        date.setDate(date.getDate() - dateIterator);
        console.log(date.toString());
        for(var i=1; i<=5; i++){
            try{
                // Fetch of data
                let month = ('0' + (date.getMonth()+1)).slice(-2)
                let day = ('0' + (date.getDate())).slice(-2)
                let fetchURL = 'https://library.rainwave.cc/api/elections?day='+date.getFullYear()+'-'+month+'-'+day+'&sid='+i
                const response = await fetch(fetchURL,{
                    method: 'GET',
                })
                if(!response.ok){
                    throw new Error(`response status: ${response.status}`)
                }
                const json = await response.json();
                let iSched = 0;
                if(json.sched_history.length){
                    json.sched_history.forEach((el)=>{
                        iSched++;
                        let electionDate = new Date(el.start_actual*1000);
                        let electionMonth = ('0' + (electionDate.getMonth()+1)).slice(-2)
                        let electionDay = ('0' + (electionDate.getDate())).slice(-2)
                        let savedElections = '';
                        try{
                            savedElections = fs.readFileSync(__dirname+'/../data/elections/'+electionDate.getFullYear()+'-'+electionMonth+'-'+electionDay+'.json')
                        }catch(err){
                            console.log('New month!')
                        }

                        // If it screws up, restart from scratch
                        if(!savedElections){
                            savedElections = JSON.parse("[]");
                        }else{
                            try{
                                savedElections = JSON.parse(savedElections);
                            }catch{
                                savedElections = JSON.parse("[]");;
                            }
                        }
                        //console.log(el);
                        // Checks which person won or lost, depending on the value in entry_votes.
                        // Decided that an election vote via no votes cast doesn't count.
                        let losers = [];
                        el.songs.forEach((song)=>{
                            if(song.entry_position==0){
                                winner = song.id;
                            }else{
                                losers.push(song.id);
                            }
                            let filename = __dirname+'/../data/songs/'+song.id+'.json';
                            //if (!fs.existsSync(filename)) {
                                fs.writeFileSync(filename,JSON.stringify({
                                    id:song.id,
                                    album:song.album,
                                    artist:song.artist,
                                    title:song.title,
                                    rating:song.rating
                                }));
                            //}
                        })
                        
                        // Push the result to the array
                        savedElections.push({
                            time:el.start_actual,
                            election_id:el.id,
                            winner:winner,
                            losers:losers
                        });

                        // Remove dupe elections
                        let seenElections = [];
                        let cleanedElections = [];
                        savedElections.forEach((el)=>{
                            if(!seenElections.includes(el.election_id)){
                                seenElections.push(el.election_id);
                                cleanedElections.push(el);
                            }
                        })
                        savedElections.sort((a,b)=>a.time-b.time);
                        
                        try{
                            let write = JSON.stringify(cleanedElections);
                            fs.writeFileSync(__dirname+'/../data/elections/'+electionDate.getFullYear()+'-'+electionMonth+'-'+electionDay+'.json',write);
                        }catch(err){
                            console.error(err);
                        }
                        console.log('Written : '+Math.round(iSched/json.sched_history.length*100)+'% ('+iSched+'/'+json.sched_history.length+') '+date.toString()+' Station: '+i)
                    })
                }else{
                    stillGivesResults = false;
                }
            }catch(error){
                console.error(error.message)
            }
        }
        dateIterator++;
    }

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
function auto_fetch_elections(){
    fetch_elections();
    setInterval(()=>{
        fetch_elections();
    },1000*60*5);
}

// Make it possible to call both functions from the package.json
for(var i=0;i<process.argv.length;i++){
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
module.exports.auto_fetch_elections = auto_fetch_elections