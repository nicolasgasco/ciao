const apiKey = `019e3db391209165d704763866329bb3`;
const language = `en-US`;

let genresArray = createObjectMovieGenres();


const searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", fetchMediaFromKeywords);

const searchBarTitle = document.querySelector("#search-bar");
searchBarTitle.addEventListener("change", fetchMediaFromKeywords);






function fetchMediaFromKeywords(e) {

    let query = searchBarTitle.value;


    let link = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=${language}&query=${query}&page=1&include_adult=false`;
    fetch(link).then( function (response) {
        return response.json();
    }).then( function(data) {
        createCardsWithMedia(data);


    })

}

function createCardsWithMedia(dataSet) {
    
    let resultsBox = document.querySelector("#results-box");
    let posterSize = 300; 

    resultsBox.innerHTML = ``;

    if ( dataSet.results.length === 0 ) {
        resultsBox.style.flexDirection = "column";
        resultsBox.style.alignItems = "center";
        
        resultsBox.innerHTML =
        `
        <h2>Oops! It looks like you know more than us on cinema...</h2>
        <small>(Either that or the media you're looking for doesn't exist.)</small>
        <img src="./img/nothing_found.png" alt="Illustration for nothing found">
        `

    } else {
        resultsBox.style.flexDirection = "row";
        resultsBox.style.alignItems = "baseline";

        let objectsArray = [];
        for ( media of dataSet.results) {
            
            if ( media.title ) {

                let mediaData = new Object()
                

                mediaData.title =  media.title;
                mediaData.id = media.id;
                mediaData.img = media.poster_path;
                mediaData.overview = media.overview;
                mediaData.release_date = media.release_date;
                // mediaData.popularity = media.popularity;

                mediaData.genre_labels = [];
                for ( let genreId of media.genre_ids ) {
                    mediaData.genre_labels.push(getGenreLabelFromId(genreId).toLowerCase())
                }

                mediaData.vote_average = media.vote_average;
                mediaData.vote_count = media.vote_count;
                
                let singleMedia = [media.vote_count, mediaData];
                objectsArray.push(singleMedia);

            }

            
        }
        let = objectsArraySorted = objectsArray.sort(function(a, b) {return b[0] - a[0];});
        
        objectsArraySorted.forEach( element => {

            if ( element[1].img ) {
                posterUrl = `https://image.tmdb.org/t/p/w${posterSize}/${element[1].img}`;
            } else {
                posterUrl = `./img/image_unavailable.png`;
            }

            const description = element[1].overview;
            resultsBox.innerHTML +=
                `
                <div class="media-card" id="${element[1].id}" onclick="showBacksideCard(event, ${element[1].id})">
                    <img src="${posterUrl}" alt="Poster picture of ${element[1].title}" class="poster-pic">
                    <p class="hidden-text" id="hidden-text-${element[1].id}">${description}</p>
                    <div class="media-card-text" id="media-card-text-${element[1].id}">
                        <h3>${element[1].title} (${element[1]["release_date"].substring(0,4)})</h3>
                        <p>Genres: ${element[1].genre_labels.join(", ")}.</p>            
                        <p>Vote: ${element[1].vote_average}</p>
                        <p>Vote count: ${element[1].vote_count}</p>
                    </div>
                </div>
 
            `

        });
        
    }
}

function showBacksideCard(e, id) {
    const mediaCard = e.currentTarget;
    const moviePoster = e.target;
    const hiddenText = document.querySelector(`#hidden-text-${id}`);
    const shownText = document.querySelector(`#media-card-text-${id}`);

    shownText.style.display = "none";
    hiddenText.style.display = "block";

    // hiddenText.addEventListener("click", function () {
    //     hiddenText.setAttribute("style", "display: none;");


    //     shownText.style.display = "block";
    // });

}


function createObjectMovieGenres() {
    let url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=${language}`
    let genresArray = []
    
    fetch(url)
    .then( res => res.json() )
    .then( data => {
        
        data.genres.forEach( genre => genresArray.push( {"id": genre.id, "name": genre.name} ));

        
    })
    return genresArray;
}


function getGenreLabelFromId(id) {
    for ( let index in genresArray ) {
        if ( genresArray[index]["id"] === id ) {
            return genresArray[index]["name"];
        }
    }
}


