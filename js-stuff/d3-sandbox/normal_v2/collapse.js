const visualInterpretationsContent = document.getElementById("visual-interpretations-content")
const visualInterpretationsIcon = document.getElementById("visual-interpretations-icon")
let visualInterpretationsCollapsed = false
const toggleVisualInterpretations = () => {
  if(visualInterpretationsCollapsed){
    visualInterpretationsContent.style.display = 'block'
    visualInterpretationsIcon.innerText = '-'
  } else {
    visualInterpretationsContent.style.display = 'none'
    visualInterpretationsIcon.innerText = '+'
  }
  visualInterpretationsCollapsed = !visualInterpretationsCollapsed
}

const realLifeContent = document.getElementById("real-life-content")
const realLifeIcon = document.getElementById("real-life-icon")
let realLifeCollapsed = false
const toggleRealLife = () => {
  if(realLifeCollapsed){
    realLifeContent.style.display = 'block'
    realLifeIcon.innerText = '-'
  } else {
    realLifeContent.style.display = 'none'
    realLifeIcon.innerText = '+'
  }
  realLifeCollapsed = !realLifeCollapsed
}

const qualityMeasuresContent = document.getElementById("quality-measures-content")
const qualityMeasuresIcon = document.getElementById("quality-measures-icon")
let qualityMeasuresCollapsed = false
const toggleQualityMeasures = () => {
  if(qualityMeasuresCollapsed){
    qualityMeasuresContent.style.display = 'block'
    qualityMeasuresIcon.innerText = '-'
  } else {
    qualityMeasuresContent.style.display = 'none'
    qualityMeasuresIcon.innerText = '+'
  }
  qualityMeasuresCollapsed = !qualityMeasuresCollapsed
}