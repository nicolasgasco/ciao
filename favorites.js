let userFavorites = fetchChoicesFromLocalStorage();

const movieGenreArray = createObjectGenres("tv");
const seriesGenreArray = createObjectGenres("movie");


document.querySelector("#man-empty-box").addEventListener("mouseover", function () {
    document.querySelector("#man-empty-box").setAttribute("src", "./img/nothing_found.gif");
});


window.onload = function () {
    wipeCleanResultsArea();
    // Using .length gives and error
    if ( userFavorites[0] ) {
        createFavoritesCards();
    } else {
        showEmptyPageText()
    }
}

function createFavoritesCards(mediaObjects) {
    for ( let mediaObject of userFavorites ) {
        fetchMediaFromID(mediaObject.id, mediaObject.type);
    }
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

        createCardsWithId(data, type);

    })
    .catch( (error) => {
        console.log("ERROR: ", error)
        const favoritesBox = document.querySelector("#favorites-box");
        showErrorMessageGraphics(favoritesBox);
    });

}

function createCardsWithId(dataSet, type) {

    const favoritesBox = document.querySelector("#favorites-box");
    
    let posterSize = 300; 

    // Creating gerne_labels if not empty
    genre_labels = [];
    if ( dataSet.genres ) {
        for ( let genreId of dataSet.genres ) {
            genre_labels.push(getGenreLabelFromId(genreId.id).toLowerCase())
        }
    }  

    // Sometimes genre is not provided
    let genreLabelsLine;
    if ( genre_labels.length !== 0 ) {
        genreLabelsLine = `<p><span class="bold uppercase">Genres:</span> ${genre_labels.join(", ")}</p>`
    } else {
        genreLabelsLine = `<p><span class="bold uppercase">Genres:</span> no info available</p>`
    }

    // Release_date is first_air_date for series
    let mediaDate = ( dataSet.release_date == undefined ) ? dataSet.first_air_date : dataSet.release_date;

    // Title is called name for TV series
    let mediaTitle = ( dataSet.title == undefined ) ? dataSet.name : dataSet.title;

    // Sometimes dates can be missing
    let titleWithDate;
    if ( mediaDate ) {
        titleWithDate = `<h3>${mediaTitle} (${mediaDate.substring(0,4)})</h3>`;
    } else {
        titleWithDate = `<h3>${mediaTitle}</h3>`;
    }

    // Creating correct poster path
    let posterUrl;
    if ( dataSet.poster_path ) {
        posterUrl = `https://image.tmdb.org/t/p/w${posterSize}/${dataSet.poster_path}`;
    } else {
        posterUrl = `./img/image_unavailable.png`;
    }


    const description = dataSet.overview;

    const mediaType = type;

    favoritesBox.innerHTML +=
                `
                <div class="media-card" id="media-card-${dataSet.id}">
                    <img src="${posterUrl}" alt="Poster picture of ${mediaTitle}" class="poster-pic" id="poster-pic-${dataSet.id}">
                    <div class="hidden-text" id="hidden-text-${dataSet.id}">
                        <p>${description}</p>
                    </div>
                    <hr>
                    <div class="media-card-text" id="media-card-text-${dataSet.id}">
                        ${titleWithDate}

                        <p class="type-text"><span class="bold uppercase">Type:</span> ${mediaType}</p>           
                        ${genreLabelsLine}
                        <div id="in-card-icons">
                            <p><span class="very-big">${dataSet.vote_average}</span><span class="very-small">/10</span></p>
                            <p><span class="very-big">${dataSet.vote_count}</span> <span class="very-small">votes</span></p>
                            <img onclick="removeFromFavoritesList(event)" id="favorite-icon-${dataSet.id}" class="heart-icons" src="./img/favourite.png" alt="Favorite icon">
                        </div>
                    </div>
                </div>
 
            `

    if ( !isTouchEnabled() ) {
        document.querySelectorAll(".media-card").forEach( card => {
            card.addEventListener("mouseover", showBacksideCard);
        });
    } else {
        document.querySelectorAll(".poster-pic").forEach( pic => {
            pic.addEventListener("click", showBacksideCard);
        });
    };

}

function fetchChoicesFromLocalStorage() {
    const userData = localStorage.getItem("userChoices");
    return JSON.parse(userData);
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

function showBacksideCard(e) {
    const id = e.currentTarget.id.split("-")[2];

    const mediaCard = document.querySelector(`#media-card-${id}`);
    const moviePoster = document.querySelector(`#poster-pic-${id}`);
    const hiddenText = document.querySelector(`#hidden-text-${id}`);
    const shownText = document.querySelector(`#media-card-text-${id}`);
    let hiddenParagraph = document.querySelector(`#hidden-text-${id} p`);
    
    moviePoster.removeEventListener("click", showBacksideCard);

    if ( !hiddenParagraph.innerText ) {
        hiddenParagraph.innerText = "No description available."
    } 
    moviePoster.style.display = "none";
    hiddenText.style.display = "block";

    hiddenText.style.overflow = "auto";

    if ( !isTouchEnabled() ) {

        mediaCard.addEventListener("mouseout", function () {
            hiddenText.style.display = "none";
            moviePoster.style.display = "inline";
        });
    } else {
        hiddenText.addEventListener("click", function () {
            hiddenText.style.display = "none";
            moviePoster.style.display = "inline";
            moviePoster.addEventListener("click", showBacksideCard);
        });
    }
}




function removeFromFavoritesList(e) {
    let heartIcon = e.target;
    heartIcon.removeEventListener("click", removeFromFavoritesList);


    const mediaId = e.target.id.split("-")[2];

    // Remove from list
    userFavorites = userFavorites.filter(item => item.id !== mediaId)
    
    document.getElementById(`media-card-${mediaId}`).remove();

    saveChoicesToLS();

    if ( userFavorites.length === 0 ) {
        showEmptyPageText();
    }
}

function saveChoicesToLS() {
    localStorage.setItem("userChoices", JSON.stringify(userFavorites));
}

function wipeCleanResultsArea() {
    const favoritesBox = document.querySelector("#favorites-box");
    favoritesBox.innerHTML = ``;
}

function showEmptyPageText() {
    document.querySelector("#error-box").style.display = "block";
}

function showErrorMessageGraphics(targetDiv) {
    targetDiv.style.flexDirection = "column";
    targetDiv.style.alignItems = "center";
    
    targetDiv.innerHTML =
    `
    <div id="search-error-container" class="search-container">
        <h2 class="uppercase">Oops! It looks like you know more than us on cinema...</h2>
        <p>(Either that or the film you're looking for doesn't exist.)</p>
        <img src="./img/no_data.gif" alt="Man puzzled in front of no data error" id="no-data-man">
    </div>
    `

    document.querySelector("#no-data-man").addEventListener("mouseover", function () {
        document.querySelector("#no-data-man").setAttribute("src", "./img/no_data.gif");
    });
}

function isTouchEnabled() { 
    return ( 'ontouchstart' in window ) ||  
           ( navigator.maxTouchPoints > 0 ) ||  
           ( navigator.msMaxTouchPoints > 0 ); 
} 

