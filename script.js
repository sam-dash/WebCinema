const apiKey = "22e83f0d-f14f-42fc-ab77-bd7491e04bed"

const apiUrlTop = "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_MOVIES"
const apiUrlFindById ="https://kinopoiskapiunofficial.tech/api/v2.2/films/"
const apiUrlKeyword = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword="

const newElement = (tagName, className) => {
    const element = document.createElement(tagName)
    element.classList.add(className)
    return element
}

const getTopMovies = async () => {
    try {
        // Получаем api
        const response1 = await fetch(apiUrlTop, { headers: { 'accept': 'application/json','X-API-KEY': apiKey}})
        const topMovie = await response1.json();
        console.log(topMovie)
        
        const mainContainer = document.querySelector('.main__container');
        const searchContainer = document.querySelector('.search__container')
        const search = document.querySelector('.header__search')
        const btn = document.querySelector('.header__button')
        let currentFilm = ""


        const mainMovieCard = (dataFilm, container) => {

            const kinopoiskIdTop = dataFilm.kinopoiskId || dataFilm.filmId;
            let genre = ''
            if (dataFilm.genres) {
                genre = dataFilm.genres.slice(0, 2).map(genreObj => genreObj.genre).join(', ')
            }
            
            const mainMovieCard = newElement('div', 'main__movie-card')
            mainMovieCard.innerHTML = `
            <img class="main__movie-card-img" src="${dataFilm.posterUrlPreview}" alt="${dataFilm.nameRu}">
            <p class="main__card-rating">${dataFilm.rating || dataFilm.ratingKinopoisk}</p>
            <p class="main__card-name">${dataFilm.nameRu}</p>
            <p class="main__genres">${genre}</p>`
            
            //  Скрыть null рейтинг
            if (dataFilm.ratingKinopoisk === null) {
                const cardRating = mainMovieCard.querySelector('.main__card-rating');
                cardRating.style.visibility = 'hidden';
            }
                
            container.appendChild(mainMovieCard)


            // Функция с информационной карточкой о фильме
            const infoCardMovie = async (kinopoiskIdTop) => {

                const response2 = await fetch(apiUrlFindById + kinopoiskIdTop, { headers: { 'accept': 'application/json','X-API-KEY': apiKey}})
                const findById = await response2.json()

                const mainCardWindow = newElement('div', 'main__card-window')
                mainCardWindow.innerHTML = `
                <div class="main__window-wrapper">
                    <img class="main__window-close" src="images/Close.svg" alt="Закрыть описание">
                    <section class="main__window-poster">
                        <img src="${findById.posterUrl}" alt="${findById.nameRu}">
                    </section>
                    <section class="main__window-parameters">
                        <p class="main__card-name">${findById.nameRu}</p>
                        <p class="main__year-of-production">Год выпуска: ${findById.year}</p>
                        <p class="main__country">Страна:  ${findById.countries.map(countries => countries.country)}</p>
                        <p class="main__genre">Жанр: ${findById.genres.map(countries => countries.genre)}</p>
                        <p class="main__age">Возраст: ${findById.ratingAgeLimits}</p>
                        <p class="main__description"> Описание: ${findById.description}</p>
                    </section>
                </div>`

                container.appendChild(mainCardWindow)

                if (findById.ratingAgeLimits === null){
                    mainCardWindow.querySelector('.main__age').style.display = 'none'
                }

                const mainWindowCloseButtons = mainCardWindow.querySelectorAll('.main__window-close')

                mainWindowCloseButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        mainCardWindow.style.display = 'none';
                    })
                })
            }
            mainMovieCard.addEventListener('click', () => infoCardMovie(kinopoiskIdTop))
        }


        // Перебираем все карточки топа фильмов
        topMovie.items.forEach((card) => {
            mainMovieCard (card, mainContainer)
        })
        

        // Поиск фильма по названию
        const checkMovie = async (currentFilm) => {
            const response3 = await fetch(apiUrlKeyword + currentFilm + `&page=1`, { headers: { 'accept': 'application/json','X-API-KEY': apiKey}})
            const searchMovie = await response3.json();
            console.log(searchMovie)


            // mainMovieCard(checkMovieData)
            searchMovie.films.forEach((filmName) => {
                mainMovieCard (filmName, searchContainer)
            })
        }

        btn.addEventListener('click', () => {
            mainContainer.style.display = 'none'
            searchContainer.style.display = 'flex'
            currentFilm = search.value
            checkMovie(currentFilm)
            search.value = ''
        })

        search.addEventListener('keydown', event => {
            if (event.keyCode === 13) {
                mainContainer.style.display = 'none'
                searchContainer.style.display = 'flex'
                currentFilm = search.value
                checkMovie(currentFilm)
                search.value = ''
            }
        })


        
        
        
        
        
    } catch (error) {
        console.log('Произошла ошибка:', error.message)
    }
}

getTopMovies()
        


        
        
        
