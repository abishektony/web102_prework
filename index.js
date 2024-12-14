/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    // Loop over each item in the data
    for (const game of games) {
      // Create a new div element, which will become the game card
      const div1 = document.createElement('div');
  
      // Add the class game-card to the div
      div1.classList.add('game-card');
  
      // Set the inner HTML using a template literal to display some info about each game
      div1.innerHTML = `
        <img src="${game.img}" alt="${game.name}" class="game-image" height="150" />
        <h3>${game.name}</h3>
        <p><strong>Description:</strong> ${game.description}</p>
      `;
  
      // Append the game card to the games-container
      const gamesContainer = document.getElementById('games-container');
      gamesContainer.appendChild(div1);
    }
  }
  
  // Call the function using the correct variable
  addGamesToPage(GAMES_JSON);  

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((total, game) => {
    return total + game.backers;
  }, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `
<p>${totalContributions.toLocaleString()}</p>
`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce((total, game) => {
    return total + game.pledged;
  }, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `
    <p>$${totalRaised.toLocaleString()}</p>
  `;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const numGames = GAMES_JSON.length;
gamesCard.innerHTML = `
    <p>${numGames}</p>
  `;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let unFunded = GAMES_JSON.filter ( (game) => {
        return game.goal > game.pledged;
       });

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unFunded);

}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let fullyFunded = GAMES_JSON.filter ( (game) => {
        return game.goal <= game.pledged;
       });

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fullyFunded);

}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);

}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener('click', () => filterUnfundedOnly());
fundedBtn.addEventListener('click', () => filterFundedOnly());
allBtn.addEventListener('click', () => showAllGames());

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
let unFunded = GAMES_JSON.filter ( (game) => {
    return game.goal > game.pledged;
   });
const totally = unFunded.reduce((total, game) => {
    return total + game.backers;
  }, 0);

// create a string that explains the number of unfunded games using the ternary operator
const mes = `
    A total of $${totalRaised.toLocaleString()} has been raised for ${numGames} game${numGames === 1 ? '' : 's'}. 
    Currently, ${totally} game${totally === 1 ? '' : 's'} remain unfunded. 
    We need your help to fund these amazing projects!
  `;

// create a new DOM element containing the template string and append it to the description container
descriptionContainer.innerHTML = mes;

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...otherGames] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameElement = document.createElement('p');
firstGameElement.textContent = firstGame.name;
firstGameContainer.appendChild(firstGameElement);

// do the same for the runner up item
const secondGameElement = document.createElement('p');
secondGameElement.textContent = secondGame.name;
secondGameContainer.appendChild(secondGameElement);

const searchBar = document.getElementById('search-bar');

function search(event) {
    const searchFor = event.target.value.toLowerCase();

    // Filter games based on the search query
    const filteredGames = GAMES_JSON.filter((game) => {
        return game.name.toLowerCase().includes(searchFor);
    });
    
    deleteChildElements(gamesContainer);
    addGamesToPage(filteredGames);
}

searchBar.addEventListener('input', search);
