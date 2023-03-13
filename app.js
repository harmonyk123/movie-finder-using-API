const website = "https://api.themoviedb.org/3/search/movie"

const APIKEY = "c4bc571471c2807e7f91b7f978e76c8f"

const searchform = document.querySelector('#searchform')

const handleOnSubmit = (event) => {
    event.preventDefault();
    
    const searchInput = document.getElementById("searchbox");
    
    const movieName = searchInput.value.trim();

    const movieInfoContainer = document.querySelector('#infoContainer')
    const movieInfoContainerTop = document.querySelector('#infoContainerTop')
    
    if (!movieName) {
        // handleError();
    } else {
        showMovieInfo(movieName);
        movieInfoContainer.innerHTML = ""
        movieInfoContainerTop.innerHTML = ""
    }
    };

const findMovieInformation = async (movieName) => {
    const randomPage = Math.ceil(Math.random()*5)

    try {
        const url = `${website}?api_key=${APIKEY}&language=en-US&include_adult=false&page=${randomPage}&query=${movieName}`
    
        const response = await fetch(url);
    
        if (response.status !== 200) {
            throw new Error(`API Error, response status = ${response.status}`)
        } else {
        const data = await response.json();
        // console.log(url)
        return data.results.splice(0, 5);
        }
    } catch (e) {
        console.error(e.message);
    }
    };
    
const showMovieInfo = async (movieName) => {
    const resultsArray = await findMovieInformation(movieName);
    const imageMaker = `http://image.tmdb.org/t/p/w185`


    const movieContainer = document.querySelector('#films')
    let index = 1
        // Render title cards
    movieContainer.innerHTML = resultsArray.filter((movie) => {return movie.title}).map( movie => {
        return`
    <div class="film card centerthis testclass" id="${'film'+index}">
        <img src="${movie.poster_path?`${imageMaker}${movie.poster_path}`: "https://via.placeholder.com/185x278?text=No+Image+Found"}">
        <button
        class="movieButton" 
        style="margin-top: 1rem;" 
        data-movietitle="${movie.title}"
        data-movieoverview="${movie.overview}"
        >
        ${movie.title}
        </button>
    </div>
    `}).join('\n')
    makeButtons()



}
        // More information buttons, back buttons are done much later. (line 121-125)
const makeButtons = () => {
    const buttons = [...document.querySelectorAll('.movieButton')]
    buttons.map( 
        button => button.addEventListener("click",informationPresent)
        )
}
        // Hides/shows each card (any amount) and also toggles the "more information" window
const hideStuff = () => {
    const hidden = document.querySelectorAll('#film1');
    for (let i = 0; i < hidden.length; i++) {
        hidden[i].classList.toggle('hidden')
    }

    const infoHide = document.querySelector('#infoContainer')
    infoHide.classList.toggle('hidden')

}
        // Overview cards, must start as hidden (see line 115 - 116)
const movieInfoComponent = (movie) => {
    return `
    <div class="card-body">
    <h4 class=card-title h5 h4-sm hidden">${movie.title}</h4>
    <p class=card-text">${movie.overview}</p>
    <button
    class="backButton">
    Back
    </button>
    </div>
    `
}
        // On click action 
const informationPresent = (event) => {
    const movieInfoContainer = document.querySelector('#infoContainer')
    const movieInfoContainerTop = document.querySelector('#infoContainerTop')
    
    const title = event.target.getAttribute("data-movietitle")
    const overview = event.target.getAttribute("data-movieoverview")
    // ^ on event (being clicked), get attribute movietitle & movieoverview
    // v Pass information to callback fn to render cards
    movieInfoContainer.innerHTML = movieInfoComponent({title, overview})
    movieInfoContainerTop.innerHTML = movieInfoComponent({title, overview})

    hideStuff()
        // Couldn't figure this one out, #infoContainer required two clicks to show if user does not remove hidden first (but only the first time)
        // This is just a work around
    const infoHide = document.querySelector('#infoContainer')
    infoHide.classList.remove('hidden')
        // The back buttons don't exist when cards are first rendered, so they are selected here instead. 
    const buttons = [...document.querySelectorAll('.backButton')]
    buttons.map( 
        button => button.addEventListener("click", hideStuff)
        )
}

searchform.addEventListener("submit", handleOnSubmit);
