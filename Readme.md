TO start the app

- npm start

/api/game/create -> game_id ->POST
/api/game/{game_id}/ticket/{user_name}/generate -> ticket_id ->POST
/ticket/{ticket_id} -> just print html table with ticket -> GET
/api/game/{game_id}/number/random -> pick random number for game without duplicates ->GET
/api/game/{game_id}/numbers -> returns all numbers picked for this game until now ->GET
/api/game/{game_id}/stats -> stats of the game {numbers drawn/no of tickets/no of users} ->GET

Following modules are used

- npm install tambola (to create ticketSequnce and randomNumbers)
- npm install table (to print ticket in table format)
