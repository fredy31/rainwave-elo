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