let apiKey = `019e3db391209165d704763866329bb3`;

let searchBarTitle = document.querySelector("#search-bar");

searchBarTitle.onchange = fetchMediaFromKeywords;

let newArray = [];

function fetchMediaFromKeywords(e) {
    let language = `en-US`
    let query = e.target.value;


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

    let objectsArray = [];
    for ( media of dataSet.results) {
        console.log(media.tagline)
        
        if ( media.title ) {


            let mediaData = new Object()
            

            mediaData.title =  media.title;
            mediaData.id = Number(media.id);
            mediaData.img = media.poster_path;

            mediaData.release_date = media.release_date;
            // mediaData.popularity = media.popularity;
            mediaData.genre_ids = media.genre_ids;
            mediaData.vote_average = media.vote_average;
            mediaData.vote_count = media.vote_count;
            
            let singleMedia = [media.id, mediaData];
            objectsArray.push(singleMedia);
        }
    }
    let = objectsArraySorted = objectsArray.sort(function(a, b) {return b[0] - a[0];});
    
    objectsArraySorted.forEach( element => {

        resultsBox.innerHTML +=
        `
        <div class="media-card">

            <img src="https://image.tmdb.org/t/p/w${posterSize}/${element[1].img}" alt="Poster picture of ${element[1].title}" class="poster-pic">
            <div class="media-card-text">
                <h3>${element[1].title} (${element[1]["release_date"].substring(0,4)})</h3>
                <p>Genres: ${element[1].genre_ids}</p>            
                <p>Vote: ${element[1].vote_average}</p>
                <p>Vote count: ${element[1].vote_count}</p>
            </div>
        </div>
        `
    })
}

