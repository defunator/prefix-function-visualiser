var app = new Vue({
  el: '#app',

  data: function() {
    return {
      textInput: '',
      string: '',
      prefixVals: [],
      prefixValsInd: -2,
      visualValsInd: -2,
      highlightCol: false,
      dataHighlights: [],
      codeRow: '',
      toBounceIn: false,
      leftToBounce: 0,
      rightToBounce: -2,
      equalPrefixSegs: [],
      equalCharsCheck: [],
      algorithmStep: 0,
      slideAlgorithmStep: 0,
      isStopped: true,
      startedSetInterval: 0,
      codeLines: [
        'p[0] = 0',
        'for i in range(1, len(s)):',
        '  k = p[i - 1]',
        '  while k > 0 and s[i] != s[k]:',
        '    k = p[k - 1]',
        '  if s[i] == s[k]:',
        '    k += 1',
        '  p[i] = k',
      ],
      commentariesText: '',
    }
  },

  created: function () {
    this.start();
  },

  watch: {
    textInput: function () {
      this.start();
    },
    algorithmStep: function() {
      let i = this.slideAlgorithmStep;
      while (true) {
        if (Number.isInteger(this.codeRow)) {
          document.getElementsByClassName('L' + this.codeRow)[0].style.backgroundColor = '';
        }
        this.prefixValsInd = parseInt(this.dataHighlights[i].prefixValsInd);
        this.visualValsInd = parseInt(this.dataHighlights[i].visualValsInd);
        this.highlightCol = this.dataHighlights[i].highlightCol == true;
        this.codeRow = parseInt(this.dataHighlights[i].codeRow);
        if (Number.isInteger(this.codeRow)) {
          document.getElementsByClassName('L' + this.codeRow)[0].style.backgroundColor = 'lightgreen';
        }
        if ('equalPrefixSegs' in this.dataHighlights[i]) {
          this.equalPrefixSegs = this.dataHighlights[i].equalPrefixSegs;
        }
        if ('equalCharsCheck' in this.dataHighlights[i]) {
          this.equalCharsCheck = this.dataHighlights[i].equalCharsCheck;
        } else {
          this.equalCharsCheck = [];
        }
        if (Number.isInteger(parseInt(this.dataHighlights[i].leftToBounce))) {
          this.leftToBounce = parseInt(this.dataHighlights[i].leftToBounce);
          this.rightToBounce = parseInt(this.dataHighlights[i].rightToBounce);
          this.toBounceIn = this.dataHighlights[i].toBounceIn == true;
        } else {
          this.toBounceIn = ~this.toBounceIn;
        }
        if ('commentariesText' in this.dataHighlights[i]) {
          this.commentariesText = this.dataHighlights[i].commentariesText;
        } else {
          this.commentariesText = '';
        }
        this.$nextTick(function () {
          MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        });
        if (i == this.algorithmStep) {
          break;
        } else if (i < this.algorithmStep) {
          ++i;
        } else {
          --i;
        }
      }
      this.slideAlgorithmStep = this.algorithmStep;
      animate();
    },
  },

  methods: {
    slideAlgorithm: function() {
      [this.algorithmStep, this.slideAlgorithmStep] = [this.slideAlgorithmStep, this.algorithmStep];
    },
    start: function () {
      this.string = this.textInput;
      // setInterval(function() {
      //   for (let i = 0; i !== this.string.length; ++i) {
      //     this.visualSectionChar1Val(i);
      //   }
      // });
      this.leftToBounce = this.rightToBounce = -2;
      this.equalPrefixSegs = [];
      if (this.string.length === 0) {
        this.algorithmStep = 0;
        return;
      }
      let algorithmResult = algorithm(this.string);
      this.dataHighlights = algorithmResult.dataHighlights;
      this.prefixVals = algorithmResult.prefixVals;
      this.algorithmStep = min(this.algorithmStep, this.dataHighlights.length - 1);
    },
    nextStep: function() {
      if (this.algorithmStep !== this.dataHighlights.length) {
        ++this.algorithmStep;
      }
    },
    previousStep: function() {
      if (this.algorithmStep !== 0) {
        --this.algorithmStep;
      }
    },
    stopStartAlgorithm: function() {
      if (this.isStopped) {
        this.startedSetInterval = setInterval(function () {
          this.nextStep();
        }.bind(this), 1000);
      } else {
        clearInterval(this.startedSetInterval);
      }
      this.isStopped = 1 - this.isStopped;
    },
    prefixValsChar: function(ind) {
      if (this.prefixValsInd < ind) {
        return '';
      }
      return this.prefixVals[ind];
    },
    dataSectionChar: function(ind) {
      --ind;
      let style = 'table-char ';
      if (ind === this.prefixValsInd && this.highlightCol) {
        style += 'match '
      }
      return style;
    },
    visualSectionChar: function(ind) {
      --ind;
      if (ind > this.visualValsInd) {
        return ' ';
      }
      let style = 'visual ';
      if (ind === this.visualValsInd) {
        style += 'appear ';
      } else if (ind > this.visualValsInd) {
        style += 'disappear ';
      }
      if (ind <= this.rightToBounce) {
        if (this.toBounceIn) {
          style += 'appearr ';
        } else {
          style += 'disappearr';
          if (ind < this.leftToBounce) {
            style += '-late';
          }
          style += ' ';
        }
      }
      let toSwitch = false;
      for (let seg of this.equalPrefixSegs) {
        if (seg[0] <= ind && ind <= seg[1]) {
          if (this.equalPrefixSegs.length === 1 || toSwitch) {
            style += 'equal-prefix-overline ';
          } else if (this.visualSectionChar1Val(ind) === ' ') {
            style += 'equal-prefix-underline ';
          }
        }
        toSwitch = ~toSwitch;
      }
      if (style.search('equal-prefix-underline ') !== -1 && style.search('equal-prefix-overline ') !== -1) {
        style += 'equal-prefix-combine ';
      }
      if (this.equalCharsCheck.length !== 0 && this.equalCharsCheck.includes(ind)) {
        if (this.string[this.equalCharsCheck[0]] === this.string[this.equalCharsCheck[1]]) {
          style += 'match ';
        } else if (!(this.visualSectionChar1Val(ind) !== ' ' && this.equalCharsCheck[1] === ind)) {
          style += 'mismatch ';
        }
      }
      if (style.search('disappear') === -1) {
        style += 'appearr ';
      }
      return style;
    },
    realVisualSectionChar: function(ind) {
      let style = this.visualSectionChar(ind);
      style = style.split('disappear-late').join('');
      style = style.split('disappear').join('');
      return style;
    },
    visualSectionCharVal: function(ind) {
      if (ind > this.visualValsInd) {
        return ' ';
      }
      return this.string[ind];
    },
    visualSectionCharId: function(ind) {
      --ind;
      return 'V' + ind;
    },
    visualSectionChar1: function(ind) {
      if (ind - 1 >= this.leftToBounce) {
        return 'visual disappear ';
      }
      let style = this.visualSectionChar(ind);
      --ind;
      style = style.split('disappear-late').join('');
      style = style.split('disappear').join('');
      style = style.split('appear').join('');
      style = style.split('equal-prefix-overline').join('');
      if (ind + 1 !== this.leftToBounce) {
        style += 'equal-prefix-underline ';
      } else {
        if (this.equalCharsCheck.length !== 0 && this.equalCharsCheck.includes(ind)) {
          if (this.string[this.equalCharsCheck[0]] === this.string[this.equalCharsCheck[1]]) {
            style += 'match ';
          } else {
            style += 'mismatch ';
          }
        }
      }
      if (this.visualSectionChar1Val(ind) !== ' ') {
        style += 'appear ';
      } else {
        style += 'disappear ';
      }
      return style;
    },
    visualSectionChar1Val: function(ind) {
      if (ind >= this.leftToBounce || (this.toBounceIn && (this.dataHighlights[this.algorithmStep].toMove != 1 && this.dataHighlights[this.algorithmStep].toMove != 2))) {
        return ' ';
      }
      return this.string[ind];
    },
    visualSectionChar2Val: function(ind) {
      return this.string[ind];
    },
    visualSectionChar1Id: function(ind) {
      --ind;
      return 'VV' + ind;
    },
  },
});

function animate(){
  for (let ind = 0; ind !== app.string.length; ++ind) {
    let upperLettersPosition;
    let elem = $('#VV' + ind);
    elem.style = app.visualSectionChar1(ind);
    elem.css('position', 'absolute');
    if (app.dataHighlights[app.algorithmStep].toMove == 1) {
      upperLettersPosition = document.getElementById('V' + (ind + app.visualValsInd - app.leftToBounce + 1)).getBoundingClientRect();
      elem.animate({left: upperLettersPosition.left, top: upperLettersPosition.height});
    } else {
      upperLettersPosition = document.getElementById('V' + (ind)).getBoundingClientRect();
      elem.animate({left: upperLettersPosition.left, top: '0px'});
    }
  }
}

setInterval(animate, 1000);

