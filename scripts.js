const BASE_URL = 'https://swapi.dev/api/'

async function getGuy(num) {
    let guy = await fetch(`${BASE_URL}people/${num}/`)
    guy = await guy.json()
    return guy
}

