const userFavorites = fetchChoicesFromLocalStorage();
console.log(userFavorites)

const movieGenreArray = createObjectGenres("tv");
const seriesGenreArray = createObjectGenres("movie");


createFavoritesCards();


function createFavoritesCards(mediaObjects) {
    for ( let mediaObject of userFavorites ) {
        
        fetchMediaFromID(mediaObject.id, mediaObject.type);
    }
}



function fetchChoicesFromLocalStorage() {
    const userData = localStorage.getItem("userChoices");
    return JSON.parse(userData);
}

function fetchMediaFromID(id, type) {
    const apiKey = `019e3db391209165d704763866329bb3`;
    const language = `en-US`;

    const resultsBox = document.querySelector("#favorites-show");

    let link = `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=${language}`;
    fetch(link).then( function (response) {
        return response.json();
    }).then( function(data) {
        let dataArray = [];
        
        const favoritesBox = document.querySelector("#favorites-box");
        favoritesBox.innerHTML = ``;

        createCardsWithId(data);
    })
    .catch( (error) => {
        // console.log("ERROR: ", error)
        // const resultsBox = document.querySelector("#results-box");
        // showErrorMessageGraphics(resultsBox);
    });

}

function createCardsWithId(dataSet) {

    const favoritesBox = document.querySelector("#favorites-box");
    
    let posterSize = 300; 

    // Nothing found, this shouldn't be necessary
    // if ( dataSet.results.length === 0 ) {

    //     resultsBox.innerHTML = ``;
    //     showErrorMessageGraphics(resultsBox);

    // } else {

    // }

    genre_labels = [];

    for ( let genreId of dataSet.genres ) {
        genre_labels.push(getGenreLabelFromId(genreId.id).toLowerCase())
    }

    if ( dataSet.poster_path ) {
        posterUrl = `https://image.tmdb.org/t/p/w${posterSize}/${dataSet.poster_path}`;
    } else {
        posterUrl = `./img/image_unavailable.png`;
    }


    const description = dataSet.overview;

    favoritesBox.innerHTML +=
        `
        <div class="media-card" id="media-card-${dataSet.id}" onmouseover="showBacksideCard(event, ${dataSet.id})">
            <img src="${posterUrl}" alt="Poster picture of ${dataSet.title}" class="poster-pic" id="poster-pic-${dataSet.id}">
            <div class="hidden-text" id="hidden-text-${dataSet.id}">
                <p>${description}</p>
                <hr>
            </div>
            <div class="media-card-text" id="media-card-text-${dataSet.id}">
                <h3>${dataSet.title} (${dataSet["release_date"].substring(0,4)})</h3>
                <p class="type-text"><span class="bold uppercase">Type:</span> ${dataSet.media_type}</p>            
                <p><span class="bold uppercase">Genres:</span> ${genre_labels.join(", ")}</p>            
                <div id="in-card-icons">
                    <p>${dataSet.vote_average}</p>
                    <p>${dataSet.vote_count}</p>
                    <img onclick="addToFavoritesList(event)" id="heart-icon-${dataSet.id}" class="heart-icons" src="./img/heart.png" alt="Hollow heart icon">

                </div>
            </div>
        </div>

        `

        

    // document.getElementById("show-more-container").style.visibility = "visible";

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

