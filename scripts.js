const BASE_URL = 'https://swapi.dev/api/'

const charactersEl = document.getElementById('characterList')
const characterSpinner = document.getElementById('leftSpinner')
const leftBtn = document.getElementById('leftButton')
const rightBtn = document.getElementById('rightButton')
const guyDetailsEl = document.getElementById('guyDetails')
const guySpinner = document.getElementById('guySpinner')
const planetDetailsEl = document.getElementById('planetDetails')
const planetSpinner = document.getElementById('planetSpinner')
const pageEl = document.querySelector('nav p')

let pageTracker = 1
let guy
let planet
let guys = []
let canPage = true

async function getGuy(num) {
    let guy = await fetch(`${BASE_URL}people/${num}/`)
    guy = await guy.json()
    return guy
}

async function getPlanet(guy) {
    let planet = await fetch(guy.homeworld)
    planet = await planet.json()
    return planet
}

async function getCharacters(page) {
    guys = []
    if (page < 3) { // /people/17 finns inte
        for (let i = 6*page-5; i<6*page+1; i++) {
            let iGuy = await getGuy(i)
            guys.push(iGuy)
        }
    } else if (page == 3) { // så på sida 3 måste man hoppa över den    
        for (let i = 13; i<17; i++) {
            let iGuy = await getGuy(i)
            guys.push(iGuy)
        }
        for (let i = 18; i<20; i++) {
            let iGuy = await getGuy(i)
            guys.push(iGuy)
        }
    } else { // och sedan förskjuta allt ett steg från sida 4 (måttligt drygt)
        for (let i = 6*page-4; i<6*page+2; i++) {
            let iGuy = await getGuy(i)
            guys.push(iGuy)
        }
    }
}

function fillInCharacters(guys) {
    guys.forEach(guy => {
        let guyEl = document.createElement('li')
        guyEl.innerText = guy.name
        charactersEl.appendChild(guyEl)
    })
}

async function setPage() {
    canPage = false
    charactersEl.innerHTML = ''
    characterSpinner.style.visibility = 'visible'
    await getCharacters(pageTracker)
    fillInCharacters(guys)
    characterSpinner.style.visibility = 'hidden'
    canPage = true
}


rightBtn.addEventListener('click', async () => {
    if (pageTracker<8 && canPage) {
        pageTracker++
        pageEl.innerText = `${pageTracker}/8`
        await setPage()
        fillDetailsBoxes()
    }
})

leftBtn.addEventListener('click', async () => {
    if (pageTracker>1 && canPage) {
        pageTracker--
        pageEl.innerText = `${pageTracker}/8`
        await setPage()
        fillDetailsBoxes()
    }
})

async function fillDetailsBoxes() {
    for (let el of [...charactersEl.children]) {
        let position = [...charactersEl.children].indexOf(el)
        el.addEventListener('click', async () => {
            guyDetailsEl.innerHTML = ''
            planetDetailsEl.innerHTML = ''
            guySpinner.style.visibility = 'visible'
            planetSpinner.style.visibility = 'visible'
            let elIndex = [...charactersEl.children].indexOf(el)
            let guy = guys[elIndex]
            let planet = await getPlanet(guy)
            guyDetailsEl.innerHTML = `
                <h3>${guy.name}</h3>
                <p>Height: ${guy.height}cm</p>
                <p>Mass: ${guy.mass}kg</p>
                <p>Hair colour: ${guy.hair_color}</p>
                <p>Skin colour: ${guy.sking_color}</p>
                <p>Eye colour: ${guy.eye_color}</p>
                <p>Birth year: ${guy.birth_year}</p>
                <p>Gender: ${guy.gender}</p>
            `
            planetDetailsEl.innerHTML = `
                <h3>${planet.name}</h3>
                <p>Rotation period: ${planet.rotation_period}h</p>
                <p>Orbital period: ${planet.orbital_period} days</p>
                <p>Diameter: ${planet.diameter}km</p>
                <p>Climate: ${planet.climate}</p>
                <p>Gravity: ${planet.gravity}</p>
                <p>Terrain: ${planet.terrain}</p>
            `
            guySpinner.style.visibility = 'hidden'
            planetSpinner.style.visibility = 'hidden'
        })
    }
}

await setPage()
fillDetailsBoxes()
