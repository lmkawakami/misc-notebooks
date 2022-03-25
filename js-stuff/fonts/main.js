const initialText = "Lincoln Makoto Kawakami"
const initialSize = 20
const textInput = document.getElementById("text-input")
const sizeInput = document.getElementById("size-input")
textInput.value = initialText
sizeInput.value = initialSize

const fontList =  [
  { fontName:"Allison", size: "4.2em" },
  { fontName:"Allura", size: "3em" },
  { fontName:"Almendra+Display", size: "2.4em" },
  { fontName:"Annie+Use+Your+Telescope", size: "2.9em" },
  { fontName:"Architects+Daughter", size: "2.1em" },
  { fontName:"Bad+Script", size: "2.6em" },
  { fontName:"Beth+Ellen", size: "1.85em" },
  { fontName:"Bilbo", size: "3.6em" },
  { fontName:"Bilbo+Swash+Caps", size: "3.5em" },
  { fontName:"Birthstone", size: "3.5em" },
  { fontName:"Birthstone+Bounce", size: "3.05em" },
  { fontName:"Bonheur+Royale", size: "3.6em" },
  { fontName:"Butterfly+Kids", size: "3.25em" },
  { fontName:"Calligraffitti", size: "2.55em" },
  { fontName:"Caramel", size: "3.75em" },
  { fontName:"Caveat", size: "2.95em" },
  { fontName:"Cedarville+Cursive", size: "2.2em" },
  { fontName:"Charm", size: "2.65em" },
  { fontName:"Charmonman", size: "2.45em" },
  { fontName:"Chilanka", size: "2.2em" },
  { fontName:"Clicker+Script", size: "3.2em" },
  { fontName:"Combo", size: "2.55em" },
  { fontName:"Comforter+Brush", size: "3.6em" },
  { fontName:"Coming+Soon", size: "2.1em" },
  { fontName:"Covered+By+Your+Grace", size: "2.7em" },
  { fontName:"Crafty+Girls", size: "1.9em" },
  { fontName:"Dawning+of+a+New+Day", size: "2.55em" },
  { fontName:"Dekko", size: "2.5em" },
  { fontName:"Delius", size: "2.2em" },
  { fontName:"Delius+Swash+Caps", size: "2.2em" },
  { fontName:"Devonshire", size: "3.2em" },
  { fontName:"Dynalight", size: "3.35em" },
  { fontName:"Ephesis", size: "3.3em" },
  { fontName:"Estonia", size: "4.25em" },
  { fontName:"Euphoria+Script", size: "3.25em" },
  { fontName:"Farsan", size: "3.15em" },
  { fontName:"Fasthand", size: "2.7em" },
  { fontName:"Felipa", size: "2.95em" },
  { fontName:"Freehand", size: "2.7em" },
  { fontName:"Fuggles", size: "4.2em" },
  { fontName:"Fuzzy+Bubbles", size: "1.95em" },
  { fontName:"Gaegu", size: "2.35em" },
  { fontName:"Gamja+Flower", size: "2.65em" },
  { fontName:"Give+You+Glory", size: "2.25em" },
  { fontName:"Gloria+Hallelujah", size: "1.95em" },
  { fontName:"Grechen+Fuemen", size: "2.35em" },
  { fontName:"Grey+Qo", size: "3.85em" },
  { fontName:"Gwendolyn", size: "3.1em" },
  { fontName:"Hachi+Maru+Pop", size: "1.55em" },
  { fontName:"Handlee", size: "2.55em" },
  { fontName:"Hi+Melody", size: "3em" },
  { fontName:"Homemade+Apple", size: "1.75em" },
  { fontName:"Hurricane", size: "3.55em" },
  { fontName:"Inspiration", size: "4.1em" },
  { fontName:"Jim+Nightshade", size: "3.3em" },
  { fontName:"Just+Me+Again+Down+Here", size: "3.25em" },
  { fontName:"Kalam", size: "2.3em" },
  { fontName:"Klee+One", size: "2.1em" },
  { fontName:"Kolker+Brush", size: "4.4em" },
  { fontName:"Kristi", size: "3.8em" },
  { fontName:"La+Belle+Aurore", size: "2.45em" },
  { fontName:"League+Script", size: "2.2em" },
  { fontName:"Licorice", size: "3.55em" },
  { fontName:"Liu+Jian+Mao+Cao", size: "2.75em" },
  { fontName:"Long+Cang", size: "2.5em" },
  { fontName:"Loved+by+the+King", size: "3.2em" },
  { fontName:"Lovers+Quarrel", size: "4.4em" },
  { fontName:"Mali", size: "2em" },
  { fontName:"Meddon", size: "1.7em" },
  { fontName:"Meow+Script", size: "3.2em" },
  { fontName:"Merienda", size: "1.95em" },
  { fontName:"Miss+Fajardose", size: "4.65em" },
  { fontName:"Montez", size: "3.15em" },
  { fontName:"Mr+Bedfort", size: "2.6em" },
  { fontName:"Mrs+Saint+Delafield", size: "3.75em" },
  { fontName:"Nanum+Brush+Script", size: "3.05em" },
  { fontName:"Nanum+Pen+Script", size: "2.85em" },
  { fontName:"Nothing+You+Could+Do", size: "2em" },
  { fontName:"Oooh+Baby", size: "2.7em" },
  { fontName:"Over+the+Rainbow", size: "2.25em" },
  { fontName:"Passions+Conflict", size: "3.95em" },
  { fontName:"Petemoss", size: "4.6em" },
  { fontName:"Puppies+Play", size: "4.3em" },
  { fontName:"Qwitcher+Grypen", size: "4.15em" },
  { fontName:"Redacted+Script", size: "2.2em" },
  { fontName:"Reenie+Beanie", size: "2.85em" },
  { fontName:"Rock+Salt", size: "1.6em" },
  { fontName:"Rouge+Script", size: "3.4em" },
  { fontName:"Ruge+Boogie", size: "3.45em" },
  { fontName:"Ruthie", size: "3.6em" },
  { fontName:"Sacramento", size: "3.15em" },
  { fontName:"Sassy+Frass", size: "4.65em" },
  { fontName:"Schoolbell", size: "2.4em" },
  { fontName:"Seaweed+Script", size: "2.75em" },
  { fontName:"Sedgwick+Ave", size: "2.45em" },
  { fontName:"Shadows+Into+Light", size: "2.75em" },
  { fontName:"Shadows+Into+Light+Two", size: "2.55em" },
  { fontName:"Shalimar", size: "4.4em" },
  { fontName:"Short+Stack", size: "1.7em" },
  { fontName:"Stalemate", size: "4.75em" },
  { fontName:"Style+Script", size: "3.35em" },
  { fontName:"Sue+Ellen+Francisco", size: "3.7em" },
  { fontName:"Sunshiney", size: "2.95em" },
  { fontName:"Swanky+and+Moo+Moo", size: "2.35em" },
  { fontName:"Tangerine", size: "4.3em" },
  { fontName:"Taprom", size: "2.7em" },
  { fontName:"The+Girl+Next+Door", size: "2.15em" },
  { fontName:"The+Nautigal", size: "4.1em" },
  { fontName:"Vujahday+Script", size: "2.7em" },
  { fontName:"Waiting+for+the+Sunrise", size: "2.65em" },
  { fontName:"Waterfall", size: "4.1em" },
  { fontName:"WindSong", size: "2.25em" },
  { fontName:"Zeyada", size: "2.85em" },
]

const concatedFontNames = fontList.map(font=>font.fontName).join("|")

const fontsLink = document.createElement('link')
fontsLink.rel = 'stylesheet'
fontsLink.href = "https://fonts.googleapis.com/css?family=" + concatedFontNames
document.head.append(fontsLink)

const stylefyFontName = (fontName) => fontName.replaceAll("+"," ")
const resize = (defaultSize, multiplier) => {
  defaultSize = +defaultSize.replaceAll("em","")
  return defaultSize*multiplier + 'em'
}

for(let font of fontList) {

  

  const div = document.createElement("div")
  div.style.fontFamily = "monospace"
  div.style.fontSize = "1em"
  div.style.marginBottom = "2em"
  div.innerText = stylefyFontName(font.fontName)+":\n"

  const span = document.createElement("span")
  span.style.fontFamily = stylefyFontName(font.fontName)
  span.defaultSize = font.size
  span.style.fontSize = resize(font.size, initialSize/20)
  span.innerText = textInput.value
  span.className = "font-demo-span"
  span.title = stylefyFontName(font.fontName)

  div.appendChild(span)
  document.body.append(div)

  console.log(span.getBoundingClientRect().width)
}


const changeText = () => {
  const newText = textInput.value
  spans = document.getElementsByClassName("font-demo-span")
  for(let span of spans) {
    span.innerText = newText
  }
}

const changeSize = () => {
  const newSize = sizeInput.value
  spans = document.getElementsByClassName("font-demo-span")
  for(let span of spans) {
    const defaultSize = span.defaultSize
    span.style.fontSize = resize(defaultSize, newSize/20)
  }
}