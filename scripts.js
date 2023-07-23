let key = "a1bfba08"
let link = "https://www.omdbapi.com/?apikey=a1bfba08&"
let all_movies = []
let total_pages, movies_per_page = 15, curr_page = 1
let rate, comment
let movie_comment_data = JSON.parse(localStorage.getItem('comment')) || []

fetch_data(link+"s=fast and furious")

async function fetch_data(data){
    let movies = []
    let current_page = 1, temp
    while(1){
        const response = await fetch(`${data}&page=${current_page}`)
        let {Search, totalResults} = await response.json()
        current_page++;
        temp = totalResults
        movies.push(...Search)
        if((current_page-1)*10 >= totalResults)
            break
    }
    all_movies = movies
    total_pages = Math.ceil(temp/movies_per_page)
    page_numbers()
}

async function fetch_movie_data(data){
    const response = await fetch(`${link}i=${data}`)
    let x = await response.json()
    return x;
}

function dele(){
    document.querySelector('.movie_list').innerHTML = ''
}
function deme(){
    document.querySelector('.page_num').innerHTML = ''
}

function search_data(){
    let input = document.getElementById('search_input').value
    input = input.trim();
    fetch_data(link+"s="+input)
    curr_page = 1
}

function paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}

function page_numbers(){
    deme()
    if(curr_page != 1){
        let new_button_prev = document.createElement('button')
        new_button_prev.className = "page_button"
        new_button_prev.id = `prev`
        new_button_prev.innerHTML = "prev"
        new_button_prev.onclick = function(){
            if(curr_page > 1){
                curr_page--;
                movie_all = paginate(all_movies, movies_per_page, curr_page)
                page_numbers()
            }
        }
        document.querySelector('.page_num').appendChild(new_button_prev)
    }
    for(let i=1; i<=total_pages; i++){
        let new_button = document.createElement('button')
        new_button.className = "page_button"
        new_button.id = `page${i}`
        new_button.innerHTML = i
        new_button.name = i
        new_button.onclick = function(){
            curr_page = parseInt(new_button.name)
            movie_all = paginate(all_movies, movies_per_page, curr_page)
            page_numbers()
        }
        document.querySelector('.page_num').appendChild(new_button)
    }
    if(curr_page != total_pages){
        let new_button_next = document.createElement('button')
        new_button_next.className = "page_button"
        new_button_next.id = `prev`
        new_button_next.innerHTML = "next"
        new_button_next.onclick = function(){
            if(curr_page < total_pages){
                curr_page++;
                movie_all = paginate(all_movies, movies_per_page, curr_page)
                page_numbers()
            }
        }
        document.querySelector('.page_num').appendChild(new_button_next)
    }
    movie_all = paginate(all_movies, movies_per_page, curr_page)
    // console.log(movie_all)
    render_movies(movie_all)
}

function add_comment(i){
    rate = document.getElementById('rating_id').value
    comment = document.getElementById('comment_id').value
    document.getElementById('comment_div').style.display="none"
    document.getElementById('div_comment').style.display="block"
    movie_comment_data.push({id:i, comment:comment, rating:rate})
    localStorage.setItem('comment',JSON.stringify(movie_comment_data))
}

function find_id(id){
    movie_comment_data.forEach(element => {
        if(element.id === id){
            console.log("XXX")
            rate = element.rating
            comment = element.comment
            document.getElementById('comment_div').style.display="none"
            document.getElementById('div_comment').style.display="block"
        }
    });
}

function render_movies(movie_all){
    // console.log(movie_all, total_pages)
    dele()
    for(let i=0; i<movie_all.length; i++){
        let new_div = document.createElement('div')
        new_div.id = 'movie'
        let left_div = document.createElement('div')
        left_div.id = "left_div"
        let new_img = document.createElement('img')
        new_img.id = "movie_img"
        new_img.src = movie_all[i].Poster
        new_img.alt = "Movie poster"
        // console.log(movie_all[i].Poster)
        let title = document.createElement('button')
        title.className = "title_button"
        title.innerHTML = movie_all[i].Title
        title.onclick = async function(){
            const detail = await fetch_movie_data(movie_all[i].imdbID)
            this.parentElement.innerHTML += `
            <span>Realeased on: ${detail.Released}</span>
            <span>Plot:${detail.Plot}</span>
            <div id="comment_div">
                <input type="number" id="rating_id" placeholder="rating" max="5" min="1">
                <input type="text" id="comment_id" placeholder="comment here">
                <button id="comment_button" onclick={add_comment("${movie_all[i].imdbID}")}>Comment</button>
            </div>
            `
            find_id(movie_all[i].imdbID);
            this.parentElement.innerHTML += `
            <div id="div_comment">
                <span> rating is ${rate}</span><br>
                <span> ${comment}</span>
            </div>
            `
        }
        left_div.appendChild(title)
        new_div.appendChild(left_div)
        new_div.appendChild(new_img)
        document.querySelector('.movie_list').appendChild(new_div)
    }
}