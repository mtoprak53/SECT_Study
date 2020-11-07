
/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const res = await axios.get("https://api.tvmaze.com/search/shows", {params: { q: query }});
  const resArr = [];
  for (let resObj of res.data) {
    const showObj = {
                      id: resObj.show.id,
                      name: resObj.show.name,
                      summary: resObj.show.summary,
                    };
    try {
      showObj.image = resObj.show.image.original;
    } catch(err) {
      showObj.image = "https://tinyurl.com/tv-missing";
    }
    resArr.push(showObj);
  }
  return resArr;
}


/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(`
      <div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
        <div class="card" data-show-id="${show.id}">
          <img src="${show.image}" class="card-img-top" alt="">
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">${show.summary}</p>
            <button class="btn btn-primary btn-block episodes-button">Episodes</button>
          </div>
        </div>
      </div>
      `);
    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();
  let query = $("#search-query").val();
  if (!query) return;
  $("#episodes-area").hide();
  let shows = await searchShows(query);
  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above

  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  const resArr = [];
  for (let epi of res.data) {
    let obj = {
      id: epi.id,
      name: epi.name,
      season: epi.season,
      number: epi.number
    };
    resArr.push(obj);
  }
  return resArr;
}



/** Populate episodes list:
 *     - given list of episodes, add episodes to DOM
*/

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
  for (let episode of episodes) {
    let $item = $(`
      <li>${episode.name} (season ${episode.season}, episode ${episode.number})</li>
    `);
    $episodesList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#shows-list").on("click", "button", async function handleEpisodes (evt) {
  $("#episodes-area").show();
  // .data("show-id") did not work
  const id = evt.target.closest(".card").dataset.showId;
  const episodes = await getEpisodes(id);  
  populateEpisodes(episodes);
});
