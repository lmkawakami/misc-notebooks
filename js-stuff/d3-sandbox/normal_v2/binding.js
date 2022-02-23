const void_func = () => {}

// ugly inits
// let plotNormalDistribuiton = void_func()
// let fillNormalDist = void_func()
// let plotNormalThresholLine = void_func()

const DEFAULT_xMin = 1
const DEFAULT_xMax = 16
const DEFAULT_threshold = 8
const DEFAULT_balance = 0.15           // sick_population/total_population
const DEFAULT_healthyMu = 6
const DEFAULT_sickMu = 10
const DEFAULT_healthySigma = 1
const DEFAULT_sickSigma = 1

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
    fillConfusionMatrix()
  },
  get threshold() {
    return +this._threshold.value;
  },

  // balance
  _balance: document.getElementById('balance'),
  set balance(v) {
    if (v>1)
      v=1
    if (v<0)
      v=0
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

const calcCoefs = () => {
  globals.P_TP = globals.sickDist.find(p=>p.x>globals.threshold).sf
  globals.P_TN = globals.healthyDist.find(p=>p.x>globals.threshold).cdf
  globals.P_FP = globals.healthyDist.find(p=>p.x>globals.threshold).sf
  globals.P_FN = globals.sickDist.find(p=>p.x>globals.threshold).cdf
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