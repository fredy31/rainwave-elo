
const fs = require('node:fs');
const config = require('../config.json');

check_missing_songs();
function check_missing_songs(){
    let directory = __dirname+'/../data/elo/';
    var i=0;
    var fine=0;
    // Do a lap around the songs. If some elo files do not have their equivalent 
    // in the song folder, fetch its information.
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        files.sort((a,b)=>Math.random()-Math.random());
        for (const file of files) {
            if(file != '.gitignore'){
                if(!fs.existsSync(directory+'../songs/'+file)){
                    let songID = file.split('.');
                    if(i<10){
                        fetchInfoOfSong(songID[0]);
                    }
                    i++;
                }
                fine++;
            }
        }
        if(i>10){
            setTimeout(()=>{
                check_missing_songs();
            },500)
        }
        console.log(i + ' missing songs found out of '+fine+'!')
    })
}

async function fetchInfoOfSong(songID){
    let fetchBody = 'user_id='+config.user_id+'&key='+config.key+'&sid=5&id='+songID;
    const response = await fetch('https://rainwave.cc/api4/song',{
        method: 'POST',
        body: fetchBody,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
    let filename = __dirname+'/../data/songs/'+songID+'.json'
    if(!response.ok){
        console.error('Error on Song ID '+songID);
        if (!fs.existsSync(filename.replace('.json','.txt'))) {
            fs.writeFileSync(filename.replace('.json','.txt'),'x');
        }
        return false;
        //throw new Error(`response status: ${response.status}`)
    }
    const song = await response.json();
    
    let trackinfo = '';
    //console.log(song);
    try{
        if(song.song.id){
            trackinfo = {
                id:song.song.id,
                album:song.song.albums[0].name,
                artist:song.song.artists[0].name,
                title:song.song.title,
                rating:song.song.rating
            };
            if (!fs.existsSync(filename)) {
                fs.writeFileSync(filename,JSON.stringify(trackinfo));
            }
        }else{
            console.log(songID + ': API returns an error.')
            /*trackinfo = {
                id:songID,
                album:'Invalid song',
                artist:'Invalid song',
                title:'Invalid song',
                rating:0
            };*/
            if (!fs.existsSync(filename.replace('.json','.txt'))) {
                fs.writeFileSync(filename.replace('.json','.txt'),'x');
            }
        }
    }catch(err){
        console.log(songID + ': API returns a 500 error.')
        //console.log(song);
        //console.log(err);
        if (!fs.existsSync(filename.replace('.json','.txt'))) {
            fs.writeFileSync(filename.replace('.json','.txt'),'x');
        }
    }
    
}