# Elo calculator for Rainwave

This script fetches elections on Rainwave.cc, and then applies an ELO calculation on all of them.

Needs NodeJS and a config.json file, with user id and API key to work.

## Scripts

All scripts can be called from bash using `npm run [...]`

### full_beans

Does all other scripts in order.

### fetch_elections (deprecated)

Fetches elections via /info. Only gets the last 5.

### fetch_elections_day

Fetches elections via the daily archive. Then rolls back days until the archive is passed through. Writes in /data/songs

### calculate_elo

Passes through the elections and calculates elo. Writes in /data/elo to keep track at what elo something is currently.

### check_missing_songs

Does a lap through all of the cached songs and if some songs referred in elo are missing, fetch their information.

### build_export_csv

With everything now setup, creates a human readable csv with the elos pushed day to day.

### biggest_differences_score

Do a calculation and sort to find the songs that are outliers; between their user vote score and the percentile position they are in ELO.

### average_for_album and average_for_artist

Calculate average score for artists/albums, and output a sorted list. (Minimum 2 songs for that artist/album)

### make_message

Make message for sharing in discord.

## TODO

- Fix weekly/monthly results
- Figure out possibility to automatically put the results into a graph.