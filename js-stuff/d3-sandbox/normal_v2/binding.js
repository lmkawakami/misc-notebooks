const void_func = () => {}

// ugly inits
// let plotNormalDistribuiton = void_func()
// let fillNormalDist = void_func()
// let plotNormalThresholLine = void_func()

const DEFAULT_xMin = 0
const DEFAULT_xMax = 100
const DEFAULT_threshold = 48.5
const DEFAULT_balance = 0.10           // sick_population/total_population
const DEFAULT_healthyMu = 35
const DEFAULT_sickMu = 65
const DEFAULT_healthySigma = 10
const DEFAULT_sickSigma = 10

// const DEFAULT_population = 200000000  // BR population

const globals = {
  // values that will be calculated on init
  sickDist: null,
  healthyDist: null,
  yMax: null,

  // consts... maybe set getters and setters laters
  xMax: DEFAULT_xMax,
  xMin: DEFAULT_xMin,

  // threshold
  _threshold: document.getElementById('threshold'),
  set threshold(v) {
    if (v>this.xMax)
      v = xMax
    if (v<this.xMin)
      v = this.xMin
    this._threshold.value = v;
  },
  setThreshold(e) {
    const newValue = e.srcElement.valueAsNumber
    this.threshold = newValue
    console.log("Setting threshold")
    calcNormalHelpers()
    plotNormalThresholLine()
    fillNormalDist()
    calcCoefs()
    fillConfusionMatrix()
    plotTreeMaps()
    plotRocCurve()
  },
  get threshold() {
    return +this._threshold.value;
  },

  // balance
  _balance: document.getElementById('balance'),
  set balance(v) {
    if (v>=1)
      v=.999
    if (v<=0)
      v=0.001
    this._balance.value = v;
  },
  setBalance(e) {
    const newValue = e.srcElement.valueAsNumber
    this.balance = newValue
    calcDistributions()
    calcNormalHelpers()
    plotNomralDist()
    plotNormalThresholLine()
    fillNormalDist()
    calcCoefs()
    fillConfusionMatrix()
    plotTreeMaps()
  },
  get balance() {
    return +this._balance.value;
  },

  // healthy mu
  _healthyMu: document.getElementById('healthy_mu'),
  set healthyMu(v) {
    this._healthyMu.value = v;
  },
  setHealthyMu(e) {
    const newValue = e.srcElement.valueAsNumber
    this.healthyMu = newValue
    calcDistributions()
    calcNormalHelpers()
    plotNomralDist()
    plotNormalThresholLine()
    fillNormalDist()
    calcCoefs()
    fillConfusionMatrix()
    plotTreeMaps()
    plotRocCurve()
  },
  get healthyMu() {
    return +this._healthyMu.value;
  },

  // sick mu
  _sickMu: document.getElementById('sick_mu'),
  set sickMu(v) {
    this._sickMu.value = v;
  },
  setSickMu(e) {
    const newValue = e.srcElement.valueAsNumber
    this.sickMu = newValue
    calcDistributions()
    calcNormalHelpers()
    plotNomralDist()
    plotNormalThresholLine()
    fillNormalDist()
    calcCoefs()
    fillConfusionMatrix()
    plotTreeMaps()
    plotRocCurve()
  },
  get sickMu() {
    return +this._sickMu.value;
  },

  // healthy sigma
  _healthySigma: document.getElementById('healthy_sigma'),
  set healthySigma(v) {
    this._healthySigma.value = v;
  },
  setHealthySigma(e) {
    const newValue = e.srcElement.valueAsNumber
    this.healthySigma = newValue
    calcDistributions()
    calcNormalHelpers()
    plotNomralDist()
    plotNormalThresholLine()
    fillNormalDist()
    calcCoefs()
    fillConfusionMatrix()
    plotTreeMaps()
    plotRocCurve()
  },
  get healthySigma() {
    return +this._healthySigma.value;
  },

  // sick sigma
  _sickSigma: document.getElementById('sick_sigma'),
  set sickSigma(v) {
    this._sickSigma.value = v;
  },
  setSickSigma(e) {
    const newValue = e.srcElement.valueAsNumber
    this.sickSigma = newValue
    calcDistributions()
    calcNormalHelpers()
    plotNomralDist()
    plotNormalThresholLine()
    fillNormalDist()
    calcCoefs()
    fillConfusionMatrix()
    plotTreeMaps()
    plotRocCurve()
  },
  get sickSigma() {
    return +this._sickSigma.value;
  },
}

const  calcDistributions = () => {
  globals.sickDist = normalTransform(globals.sickMu, globals.sickSigma, globals.xMin, globals.xMax, globals.balance)
  globals.healthyDist = normalTransform(globals.healthyMu, globals.healthySigma, globals.xMin, globals.xMax, 1-globals.balance)
  // globals.yMax = 0.45/Math.min(globals.healthySigma/(1-globals.balance), globals.sickSigma/globals.balance)
  globals.yMax = 0.45/Math.min(globals.healthySigma, globals.sickSigma)
}

const showCoefs = () => {
  const showPercent = (val) => (100*val).toFixed(2)+'%'
  const insertText = (className, value) => {
    els = document.getElementsByClassName(className)
    for (let el of els) {
      el.innerText = value
    }
  }

  insertText('model-TP', showPercent(globals.P_TP))
  insertText('model-TN', showPercent(globals.P_TN))
  insertText('model-FP', showPercent(globals.P_FP))
  insertText('model-FN', showPercent(globals.P_FN))

  insertText('model-ACC', showPercent(globals.ACC))
  insertText('model-TPR', showPercent(globals.TPR))
  insertText('model-FPR', showPercent(globals.FPR))
  insertText('model-PPV', showPercent(globals.PPV))
  insertText('model-TNR', showPercent(globals.TNR))
  insertText('model-BACC', showPercent(globals.BACC))
  insertText('model-NPV', showPercent(globals.NPV))
}

const calcCoefs = () => {
  globals.P_TP = globals.sickDist.find(p=>p.x>globals.threshold).sf
  globals.P_TN = globals.healthyDist.find(p=>p.x>globals.threshold).cdf
  globals.P_FP = globals.healthyDist.find(p=>p.x>globals.threshold).sf
  globals.P_FN = globals.sickDist.find(p=>p.x>globals.threshold).cdf

  globals.TPR = globals.P_TP/(globals.P_TP+globals.P_FN)
  globals.FPR = globals.P_FP/(globals.P_FP+globals.P_TN)

  const rocPoints = [{
    TPR: 1,
    FPR: 1
  }]
  for(let i=1; i<=99; i++) {
    const pSick = globals.sickDist.find(p=>p.x>=i)
    const pHealthy = globals.healthyDist.find(p=>p.x>=i)
    const P_TP = pSick.sf
    const P_TN = pHealthy.cdf
    const P_FP = pHealthy.sf
    const P_FN = pSick.cdf
    rocPoints.push({
      TPR: P_TP/(P_TP+P_FN),
      FPR: P_FP/(P_FP+P_TN)
    })
  }
  rocPoints.push({
    TPR: 0,
    FPR: 0
  })
  globals.rocPoints = rocPoints

  globals.TNR = globals.P_TN/(globals.P_TN + globals.P_FP)
  globals.PPV = globals.P_TP/(globals.P_TP + globals.P_FP)
  globals.ACC = (globals.P_TP + globals.P_TN)
  globals.BACC = (globals.TPR + globals.TNR)/2
  globals.NPV = globals.P_TN/(globals.P_TN+globals.P_FN)

  showCoefs()
}

const initGlobal = () => {
  globals.threshold = DEFAULT_threshold
  globals.balance = DEFAULT_balance
  globals.healthyMu = DEFAULT_healthyMu
  globals.sickMu = DEFAULT_sickMu
  globals.healthySigma = DEFAULT_healthySigma
  globals.sickSigma = DEFAULT_sickSigma

  calcDistributions()
  calcCoefs()
}

const simulateStandardQTest = () => {
  const wrapVal=(val)=>{
    return {
      srcElement: {
        valueAsNumber: val
      }
    }
  }

  globals.setThreshold(wrapVal(29.14))
  globals.setBalance(wrapVal(0.361))
  globals.setHealthyMu(wrapVal(19.1))
  globals.setSickMu(wrapVal(37))
  globals.setHealthySigma(wrapVal(3.61))
  globals.setSickSigma(wrapVal(6.39))
}

const simulatePanbioTest = () => {
  const wrapVal=(val)=>{
    return {
      srcElement: {
        valueAsNumber: val
      }
    }
  }

  globals.setThreshold(wrapVal(67.4))
  globals.setBalance(wrapVal(0.232))
  globals.setHealthyMu(wrapVal(31.5))
  globals.setSickMu(wrapVal(74.9))
  globals.setHealthySigma(wrapVal(2.96))
  globals.setSickSigma(wrapVal(7.04))
}

const simulatePoorTest = () => {
  const wrapVal=(val)=>{
    return {
      srcElement: {
        valueAsNumber: val
      }
    }
  }

  globals.setThreshold(wrapVal(49.95))
  globals.setBalance(wrapVal(.5))
  globals.setHealthyMu(wrapVal(50))
  globals.setSickMu(wrapVal(50))
  globals.setHealthySigma(wrapVal(10))
  globals.setSickSigma(wrapVal(10))
}

const simulateHalfwayTest = () => {
  const wrapVal=(val)=>{
    return {
      srcElement: {
        valueAsNumber: val
      }
    }
  }

  globals.setThreshold(wrapVal(49.95))
  globals.setBalance(wrapVal(.5))
  globals.setHealthyMu(wrapVal(40))
  globals.setSickMu(wrapVal(60))
  globals.setHealthySigma(wrapVal(10))
  globals.setSickSigma(wrapVal(10))
}

const simulatePerfectTest = () => {
  const wrapVal=(val)=>{
    return {
      srcElement: {
        valueAsNumber: val
      }
    }
  }

  globals.setThreshold(wrapVal(50))
  globals.setBalance(wrapVal(.5))
  globals.setHealthyMu(wrapVal(20))
  globals.setSickMu(wrapVal(80))
  globals.setHealthySigma(wrapVal(5))
  globals.setSickSigma(wrapVal(5))
}

const simulatePreciseTest = () => {
  const wrapVal=(val)=>{
    return {
      srcElement: {
        valueAsNumber: val
      }
    }
  }

  globals.setThreshold(wrapVal(67))
  globals.setBalance(wrapVal(.05))
  globals.setHealthyMu(wrapVal(36.5))
  globals.setSickMu(wrapVal(65))
  globals.setHealthySigma(wrapVal(10))
  globals.setSickSigma(wrapVal(10))
}

const simulateSensitiveTest = () => {
  const wrapVal=(val)=>{
    return {
      srcElement: {
        valueAsNumber: val
      }
    }
  }

  globals.setThreshold(wrapVal(48.4))
  globals.setBalance(wrapVal(.05))
  globals.setHealthyMu(wrapVal(36.5))
  globals.setSickMu(wrapVal(65))
  globals.setHealthySigma(wrapVal(10))
  globals.setSickSigma(wrapVal(10))
}