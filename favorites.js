const userFavorites = fetchChoicesFromLocalStorage();

createFavoritesCards();


function createFavoritesCards(idArray) {
    for ( let mediaId of userFavorites ) {
        fetchMediaFromID(mediaId);


    }


}



function fetchChoicesFromLocalStorage() {
    const userData = localStorage.getItem("userChoices");
    return JSON.parse(userData);
}

function fetchMediaFromID(id) {
    const apiKey = `019e3db391209165d704763866329bb3`;
    const language = `en-US`;

    const resultsBox = document.querySelector("#favorites-show");

    let link = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=${language}`;
    fetch(link).then( function (response) {
        return response.json();
    }).then( function(data) {
        let dataArray = [];
        

        // createCardsWithMedia(data);
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

        resultsBox.style.flexDirection = "row";
        resultsBox.style.alignItems = "baseline";

        let objectsArraySorted = createArrayWithRelevantInfo(dataSet);

        objectsArraySorted.forEach( element => {

            if ( element[1].img ) {
                posterUrl = `https://image.tmdb.org/t/p/w${posterSize}/${element[1].img}`;
            } else {
                posterUrl = `./img/image_unavailable.png`;
            }

            const description = element[1].overview;
            resultsBox.innerHTML +=
                `
                <div class="media-card" id="media-card-${element[1].id}" onmouseover="showBacksideCard(event, ${element[1].id})">
                    <img src="${posterUrl}" alt="Poster picture of ${element[1].title}" class="poster-pic" id="poster-pic-${element[1].id}">
                    <div class="hidden-text" id="hidden-text-${element[1].id}">
                        <p>${description}</p>
                        <hr>
                    </div>
                    <div class="media-card-text" id="media-card-text-${element[1].id}">
                        <h3>${element[1].title} (${element[1]["release_date"].substring(0,4)})</h3>
                        <p><span class="bold uppercase">Genres:</span> ${element[1].genre_labels.join(", ")}.</p>            
                        <div id="in-card-icons">
                            <p>${element[1].vote_average}</p>
                            <p>${element[1].vote_count}</p>
                            <img onclick="addToFavoritesList(event)" id="heart-icon-${element[1].id}" class="heart-icons" src="./img/heart.png" alt="Hollow heart icon">

                        </div>
                    </div>
                </div>
 
            `
            
        });

        document.getElementById("show-more-container").style.visibility = "visible";

        

}