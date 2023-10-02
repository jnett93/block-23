const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2306-FTB-ET-WEB-PT';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;
const PLAYERS_API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;
const TEAMS_API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/teams`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(PLAYERS_API_URL);
        const players = await response.json();
        return players.data.players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${PLAYERS_API_URL}/${playerId}`);
        const player = await response.json();
        return player.data.player;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(PLAYERS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerObj)
        });
        const data= await response.json();

        return data;
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        console.log(`${PLAYERS_API_URL}/${playerId}`);
        const response = await fetch(`${PLAYERS_API_URL}/${playerId}`, {
            method: 'DELETE'
        });
        const player = await response.json();
        return player;
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

const renderSinglePlayerById = async (playerId) => {
    try {
        const player = await fetchSinglePlayer(playerId);
        return renderSinglePlayer(player);
    } catch (err) {
        console.error(err);
    }
};

const renderSinglePlayer = async (player) => {
    try {
        playerContainer.innerHTML = "";
        const playerDetailsElement = document.createElement('div');
        playerDetailsElement.classList.add('playerDetails');
        playerDetailsElement.innerHTML = `
            <h2>${player.name}</h2>
            <p>${player.id}</p>
            <p>${player.breed}</p>
            <p>${player.status}</p>
            <img src="${player.imageUrl}" alt="img"/>
            <button class="close-button">Close</button>
            `;
        playerContainer.appendChild(playerDetailsElement);

            // add event listener to close button
        const closeButton = playerDetailsElement.querySelector('.close-button');
        closeButton.addEventListener('click', async () => {
            playerDetailsElement.remove();
            const players = await fetchAllPlayers();
            renderAllPlayers(players);
        });
    } catch (err) {
        console.error(
            `Whoops, trouble rendering player #${playerId}!`,
            err
        );
    }

}

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {
        playerContainer.innerHTML = "";
        playerList.forEach((player) => {
            const playerElement = document.createElement('div');
            playerElement.classList.add('player');
            playerElement.innerHTML = `
                <h2>${player.name}</h2>
                <p>${player.id}</p>
                <p>${player.breed}</p>
                <p>${player.status}</p>
                <img src="${player.imageUrl}" alt="img"/>
                <button class="details-button" data-id="${player.id}">See Details</button>
                <button class="delete-button" data-id="${player.id}">Remove from roster</button>
                `;
            playerContainer.appendChild(playerElement);

            // see details
            const detailsButton = playerElement.querySelector('.details-button');
            detailsButton.addEventListener('click', async (event) => {
                // your code here
                event.preventDefault();
                renderSinglePlayerById(player.id);

            });

            // delete 
            const deleteButton = playerElement.querySelector('.delete-button');
            deleteButton.addEventListener('click', async (event) => {
                // your code here
                event.preventDefault();
                console.log("removePlayer", player.id);
                await removePlayer(player.id);
                playerElement.remove();
                const players = await fetchAllPlayers();
                renderAllPlayers(players);
            });
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

const fetchAllTeams = async () => {
    try {
        const response = await fetch(TEAMS_API_URL);
        const teams = await response.json();
        return teams.data.teams;
    } catch (err) {
        console.error('Uh oh, trouble fetching teams!', err);
    }
}

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        const newPlayerForm = document.querySelector('#new-player-form');
        newPlayerForm.innerHTML = `
          <form>
            <label for="name">Name</label>
            <input type="text" name="name" id="name" />
            <label for="breed">Breed</label>
            <input type="text" name="breed" id="breed" />
            <label for="status">Status</label>
            <input type="text" name="status" id="status" />
            <label for="img">Image URL</label>
            <input type="text" name="img" id="img" />
            <!--<label for="teamId">Team</label>-->
            <!--<input type="text" name="teamId" id="teamId" />-->
            <button type="submit">Submit</button>
          </form>
          `;

          newPlayerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const breed = document.getElementById('breed').value;
            const status = document.getElementById('status').value;
            const imageUrl = document.getElementById('img').value;
            //const teamId = document.getElementById('teamId').value;
    
            const newPlayer = {
                name: name,
                breed: breed,
                status: status,
                imageUrl: imageUrl
                //teamId: teamId
            };
    
            await addNewPlayer(newPlayer);
            const players = await fetchAllPlayers();
            renderAllPlayers(players);
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();
}

init();