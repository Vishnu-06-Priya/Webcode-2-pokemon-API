"use strict";
const body = document.body;
const contentDiv = document.createElement("div");
contentDiv.classList.add("content-responsive");
body.append(contentDiv);

// Section 1:-  To get the 50 pokemon Names from pokeapi
async function getPokemonNames() {
  try {
    let res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50");
    let data = await res.json();

    let pageContent = data.results;
    getPokemonData(pageContent, 1);
    //  To create page buttons
    function createButtons(name) {
      let ButtonName = name;
      ButtonName = document.createElement("button");
      ButtonName.setAttribute("id", `${name}`);
      ButtonName.setAttribute("name", "pageButtons");
      ButtonName.innerText = `${name}`;
      return ButtonName;
    }

    let buttonBox = document.createElement("div");
    buttonBox.classList.add("buttons");
    buttonBox.setAttribute("id", "allButtons");
    const pages = ["First", "Previous"];
    for (let i = 1; i <= 10; i++) pages.push(i);
    pages.push("Next");
    pages.push("Last");
    for (let buttons of pages) {
      buttons = createButtons(buttons);
      buttonBox.append(buttons);
    }
    body.append(buttonBox);
    // adding page click functionality
    const btngroup = document.getElementsByName("pageButtons");
    let currentPage = 1;
    for (let buttons of btngroup) {
      buttons.addEventListener("click", () => {
        let temp = document.getElementById(currentPage.toString());
        let pageNumber;
        contentDiv.innerHTML = ``;
        switch (buttons.id) {
          case "First":
            pageNumber = 1;
            currentPage = 1;
            break;
          case "Last":
            pageNumber = 10;
            currentPage = 10;
            break;
          case "Previous":
            if (currentPage > 1) {
              pageNumber = currentPage - 1;
              currentPage = currentPage - 1;
            } else {
              pageNumber = currentPage;
            }
            break;
          case "Next":
            if (currentPage < 10) {
              pageNumber = currentPage + 1;
              currentPage = currentPage + 1;
            } else {
              pageNumber = currentPage;
            }
            break;
          default:
            currentPage = parseInt(buttons.id);
            pageNumber = currentPage;
        }
        let finish = document.getElementById(pageNumber);
        temp.classList.remove("active");
        finish.classList.add("active");
        getPokemonData(pageContent, pageNumber);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

getPokemonNames();
// Section-2:- To get the data for each pokemon data
async function getPokemonData(arrayData, page) {
  try {
    let start = page * 5 - 5;
    let end = page * 5;
    arrayData = arrayData.slice(start, end);
    arrayData.forEach(async (element) => {
      let pokemonName = element.name;

      // contentDiv.innerHTML = ``;
      let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      let data = await res.json();
      // let name = PokemonName;
      let pokemonImageSource = data.sprites.other.dream_world.front_default;
      let pokemonAbilities = [];
      let pokemonWeight = data.weight;
      let pokemonMoves = [];
      data.abilities.forEach((element) => {
        pokemonAbilities.push(element.ability.name);
      });
      data.moves.forEach((element) => {
        pokemonMoves.push(element.move.name);
      });
      const card = document.createElement("div");
      card.classList.add("card");
      const details = document.createElement("div");
      details.classList.add("details");
      const name = document.createElement("div");
      name.classList.add("name");
      name.innerHTML = `Name: <span>${pokemonName}</span>`;
      const image = document.createElement("img");
      image.setAttribute("src", `${pokemonImageSource}`);
      image.setAttribute("alt", `${pokemonName}`);
      card.append(image, details);
      const abilities = document.createElement("div");
      abilities.classList.add("abilities");
      abilities.innerText = "Abilities:";
      pokemonAbilities.forEach((ele) => {
        const listItem = document.createElement("li");
        listItem.innerText = ele;
        abilities.append(listItem);
      });
      const weight = document.createElement("div");
      weight.classList.add("weight");
      weight.innerHTML = `Weight: <span>${pokemonWeight} hg</span>`;
      const button = document.createElement("button");
      button.classList.add("moves");
      button.textContent = "click for Moves";
      // Moves button
      button.addEventListener("click", () => {
        const movesDiv = document.createElement("div");
        movesDiv.classList.add("moves-responsive");
        contentDiv.classList.add("hidden");
        document.getElementById("allButtons").classList.add("hidden");
        let tableArea = document.createElement("div");
        tableArea.classList.add("tableArea");
        let tableTitle = document.createElement("div");
        tableTitle.classList.add("tableTitle");
        tableTitle.innerText = "Moves";
        movesDiv.append(tableTitle);
        let table = document.createElement("table");
        table.classList.add("table", "table-bordered");
        let tableBody = document.createElement("TBODY");
        tableBody.setAttribute("id", "t-body");
        table.append(tableBody);
        for (let moves of pokemonMoves) {
          let currentRow = document.createElement("TR");
          let data1 = document.createElement("TD");
          data1.innerText = `${moves}`;
          currentRow.append(data1);
          tableBody.append(currentRow);
          table.append(tableBody);
          tableArea.append(table);
          movesDiv.append(tableArea);
          body.append(movesDiv);
        }
        let infoArea = document.createElement("div");
        infoArea.classList.add("infoArea");

        const reloadButton = document.createElement("button");
        reloadButton.classList.add("reload");
        reloadButton.innerText = "return";
        reloadButton.addEventListener("click", () => {
          location.reload();
        });

        infoArea.append(image, name);
        infoArea.append(reloadButton);
        movesDiv.append(infoArea);
      });
      details.append(name, abilities, weight, button);
      contentDiv.append(card);
    });
  } catch (err) {
    console.error(err);
  }
}
