
const fs = require('node:fs');
const config = require('../config.json');

check_missing_songs();
async function check_missing_songs(){
    let directory = __dirname+'/../data/elo/';
    var i=0;
    var fine=0;
    // Do a lap around the songs. If some elo files do not have their equivalent 
    // in the song folder, fetch its information.
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            if(file != '.gitignore'){
                if(!fs.existsSync(directory+'../songs/'+file)){
                    let songID = file.split('.');
                    fetchInfoOfSong(songID[0]);
                    i++;
                }
                fine++;
            }
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
    if(!response.ok){
        throw new Error(`response status: ${response.status}`)
    }
    const song = await response.json();
    let filename = __dirname+'/../data/songs/'+songID+'.json';
    let trackinfo = {
        id:song.song.id,
        album:song.song.albums[0].name,
        artist:song.song.artists[0].name,
        title:song.song.title,
    };
    if (!fs.existsSync(filename)) {
        fs.writeFileSync(filename,JSON.stringify(trackinfo));
    }
}