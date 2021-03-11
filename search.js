
let pageFetchedFromAPI = 1;
let newSearch = true;
let userFavorites = createChoicesArrayFromLocalStorage();

// In order for these to work, it must be either tv or movie (API terms)
let movieGenreArray = createObjectGenres("tv");
let seriesGenreArray = createObjectGenres("movie");


window.onunload = saveChoicesToLS;

// Even to trigger search trough button and search bar
const searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", fetchMediaFromKeywords);


const searchBarTitle = document.querySelector("#search-bar");
searchBarTitle.addEventListener("change", fetchMediaFromKeywords);




const showMoreButton = document.querySelector("#show-more-button");
showMoreButton.addEventListener("click", showNextPages);


const favoritesLinkButton = document.querySelector("#favorites-link-button");


function showNextPages() {

    pageFetchedFromAPI++
    const resultsBox = document.querySelector("#results-box");

    // In this version, page is not reset when fetching new results
    // resultsBox.innerHTML = ``;

    fetchMediaFromKeywords(event);

}


function fetchMediaFromKeywords(e) {
    const apiKey = `019e3db391209165d704763866329bb3`;
    const language = `en-US`;
    const resultsBox = document.querySelector("#results-box");
    const showMoreButton = document.querySelector("#show-more-container");
    
    if ( e.target.id === "search-bar" || e.target.id === "search-button" ) {
        resultsBox.innerHTML = ``;
        showMoreButton.style.visibility = "hidden";

    }

    let query = searchBarTitle.value;


    let link = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=${language}&query=${query}&page=${pageFetchedFromAPI}&include_adult=false`;
    fetch(link).then( function (response) {
        return response.json();
    }).then( function(data) {
        // let totalPagesToFetch = data.total_pages;

        createCardsWithMedia(data, pageFetchedFromAPI);
    })
    .catch( (error) => {
        console.log("ERROR: ", error)
        const resultsBox = document.querySelector("#results-box");
        showErrorMessageGraphics(resultsBox);
    });

}

function createCardsWithMedia(dataSet, page) {
    
    const resultsBox = document.querySelector("#results-box");
    let posterSize = 300; 

    // Nothing found
    if ( dataSet.results.length === 0 ) {

        resultsBox.innerHTML = ``;
        showErrorMessageGraphics(resultsBox);

    } else {
        // // This is if error message is shown on screen, another condition could be used
        // if ( resultsBox.children[0] && resultsBox.children[0].id === "search-error-container" ) {
        //     resultsBox.innerHTML = ``;
        // }


        resultsBox.style.flexDirection = "row";
        resultsBox.style.alignItems = "baseline";

        let objectsArraySorted = createArrayWithRelevantInfo(dataSet);

        let totalPagesToFetch = dataSet.total_pages;


        objectsArraySorted.forEach( element => {

            // Some posters are missing
            let posterUrl;
            if ( element[1].img ) {
                posterUrl = `https://image.tmdb.org/t/p/w${posterSize}/${element[1].img}`;
            } else {
                posterUrl = `./img/image_unavailable.png`;
            }

            const description = element[1].overview;

            // Sometimes dates can be missing
            let titleWithDate;
            if ( element[1].release_date ) {
                titleWithDate = `<h3>${element[1].title} (${element[1]["release_date"].substring(0,4)})</h3>`;
            } else {
                titleWithDate = `<h3>${element[1].title}</h3>`;
            }

            // Remember if film was liked or not
            let heartIcon;
            if ( checkifIdInLocalStorage(element[1].id) ) {
                heartIcon = `<img onclick="removeFromFavoritesList(event)" id="favorite-icon-${element[1].id}" class="heart-icons" src="./img/favourite.png" alt="Favorite icon">`;
            } else {
                heartIcon = `<img onclick="addToFavoritesList(event)" id="heart-icon-${element[1].id}" class="heart-icons" src="./img/heart.png" alt="Hollow heart icon">`;
            }

            resultsBox.innerHTML +=
                `
                <div class="media-card" id="media-card-${element[1].id}" onmouseover="showBacksideCard(event, ${element[1].id})">
                    <img src="${posterUrl}" alt="Poster picture of ${element[1].title}" class="poster-pic" id="poster-pic-${element[1].id}">
                    <div class="hidden-text" id="hidden-text-${element[1].id}">
                        <p>${description}</p>
                        <hr>
                    </div>
                    <div class="media-card-text" id="media-card-text-${element[1].id}">
                        ${titleWithDate}
                        <p class="type-text"><span class="bold uppercase">Type:</span> ${element[1].media_type}</p>            
                        <p><span class="bold uppercase">Genres:</span> ${element[1].genre_labels.join(", ")}</p>            
                        <div id="in-card-icons">
                            <p>${element[1].vote_average}</p>
                            <p>${element[1].vote_count}</p>
                            ${heartIcon}
                        </div>
                    </div>
                </div>
 
            `
            
        });
        console.log(page);
        console.log(totalPagesToFetch);

        // Hidden Show more button when there are no more results to fetch
        if ( page !== totalPagesToFetch ) {
            document.getElementById("show-more-container").style.visibility = "visible";
        } else {
            document.getElementById("show-more-container").style.visibility = "hidden";
            document.getElementById("no-more-to-show").style.visibility = "visible";
        }
        
    }
}

function showBacksideCard(e, id) {
    const mediaCard = document.querySelector(`#media-card-${id}`);
    const moviePoster = document.querySelector(`#poster-pic-${id}`);
    const hiddenText = document.querySelector(`#hidden-text-${id}`);
    const shownText = document.querySelector(`#media-card-text-${id}`);
    let hiddenParagraph = document.querySelector(`#hidden-text-${id} p`);

    if ( !hiddenParagraph.innerText ) {
        hiddenParagraph.innerText = "No description available."
    } 
    moviePoster.style.display = "none";
    hiddenText.style.display = "block";
    hiddenText.style.overflow = "auto";

    mediaCard.removeEventListener("mouseover", showBacksideCard);

    mediaCard.addEventListener("mouseout", function () {
        hiddenText.style.display = "none";
        moviePoster.style.display = "inline";
    });

}


function createObjectGenres(mediaType) {
    const apiKey = `019e3db391209165d704763866329bb3`;
    const language = `en-US`;
    let url = `https://api.themoviedb.org/3/genre/${mediaType}/list?api_key=${apiKey}&language=${language}`
    let genresArray = [];
    
    fetch(url)
    .then( res => res.json() )
    .then( data => {
        
        data.genres.forEach( genre => genresArray.push( {"id": genre.id, "name": genre.name} ) );
    
        
    })
    return genresArray;
}


function getGenreLabelFromId(id) {
    let result;
    for ( let index in movieGenreArray ) {
        if ( movieGenreArray[index]["id"] === id ) {
            result = movieGenreArray[index]["name"];
        }
    }

    if ( result ) {
        return result;
    } else {
        for ( let index in seriesGenreArray ) {
            if ( seriesGenreArray[index]["id"] === id ) {
                return seriesGenreArray[index]["name"];
            }
        }
    }
}


function showErrorMessageGraphics(targetDiv) {
    targetDiv.style.flexDirection = "column";
    targetDiv.style.alignItems = "center";
    
    targetDiv.innerHTML =
    `
    <div id="search-error-container">
        <h2>Oops! It looks like you know more than us on cinema...</h2>
        <small>(Either that or the film you're looking for doesn't exist.)</small>
        <img src="./img/nothing_found.png" alt="Illustration for nothing found" style="max-width: 70%">
    </div>
    `
}

function createArrayWithRelevantInfo(dataSet) {
    

    let objectsArray = [];
    for ( media of dataSet.results) {

        // Persons must be skipped
        if ( media.media_type === "person"  ) {
            continue
        } 

        // Title is called name for TV series
        let mediaTitle = ( media.title == undefined ) ? media.name : media.title;
        // Release_date is first_air_date for series
        let mediaDate = ( media.release_date == undefined ) ? media.first_air_date : media.release_date;
        

        let mediaData = new Object()
        
        mediaData.title =  mediaTitle;
        mediaData.release_date = mediaDate;
        mediaData.img = media.poster_path;
        mediaData.overview = media.overview;
        mediaData.id = media.id;
        mediaData.media_type = media.media_type;

        mediaData.genre_labels = [];

        for ( let genreId of media.genre_ids ) {
            mediaData.genre_labels.push(getGenreLabelFromId(genreId).toLowerCase())
        }

        mediaData.vote_average = media.vote_average;
        mediaData.vote_count = media.vote_count;
        
        let singleMedia = [media.vote_count, mediaData];
        objectsArray.push(singleMedia);


    }
    let = objectsArraySorted = objectsArray.sort(function(a, b) {return b[0] - a[0];});

    return objectsArraySorted;
}

function addToFavoritesList(e) {
    const heartIcon = e.target;
    heartIcon.removeAttribute("onclick");

    const mediaId = e.target.id.split("-")[2];
    // Tv or movie
    const mediaType = document.querySelector(".type-text").innerText.split(":")[1].substring(1);

    heartIcon.setAttribute("src", "./img/favourite.png");
    heartIcon.setAttribute("id", `favorite-icon-${mediaId}`);
    heartIcon.setAttribute("alt", "Favorite icon");

    console.log(!userFavorites.includes(mediaId))

    let mediaObject = {
        "id": mediaId,
        "type": mediaType,
    }
    userFavorites.push(mediaObject);

    // This condition should be useless
    // if ( !userFavorites.includes(mediaId) ) {
  
    // }

    heartIcon.addEventListener("click", removeFromFavoritesList);
}

function removeFromFavoritesList(e) {
    const heartIcon = e.target;
    heartIcon.removeEventListener("click", removeFromFavoritesList)

    
    heartIcon.setAttribute("src", "./img/heart.png");
    heartIcon.setAttribute("id", `heart-icon-${mediaId}`);
    heartIcon.setAttribute("alt", "Hollow heart icon");


    const mediaId = e.target.id.split("-")[2];

    // Remove from list
    userFavorites = userFavorites.filter(item => item.id !== mediaId)

    heartIcon.addEventListener("click", addToFavoritesList);
  
}


function saveChoicesToLS() {
    localStorage.setItem("userChoices", JSON.stringify(userFavorites));
}

function createChoicesArrayFromLocalStorage() {
    let userFavorites = []
    const userData = localStorage.getItem("userChoices");
    if ( userData !== null ) {
        JSON.parse(userData).forEach( el => userFavorites.push(el) );
    }
    return userFavorites;
}

function fetchChoicesFromLocalStorage() {
    const userData = localStorage.getItem("userChoices");
    return JSON.parse(userData);
}

function checkifIdInLocalStorage(id) {
    let userData = fetchChoicesFromLocalStorage();

    for ( let data of userData ) {
        if ( data.id == id ) {
            return true;
        }
    }
    return false;

}
// function removeSpecificItemFromArray(myArray, item) {
//     let result = [];
//     for (let el of myArray ) {
//         if ( item !== el ) {
//             result.push(item);
//         }
//     }
//     return result;
// }
