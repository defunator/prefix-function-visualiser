function algorithm(string) {
  let prefixVals = new Array(string.length);
  let dataHighlights = [];
  dataHighlights.push({prefixValsInd: -1, leftToBounce: -1, rightToBounce: -1, visualValsInd: -1});
  prefixVals[0] = 0;
  dataHighlights.push({
    prefixValsInd: 0,
    highlightCol: true,
    codeRow: 0,
    visualValsInd: 0,
    commentariesText: 'Алгоритм начался. По определению `p[0] = 0`.'
  });
  for (let i = 1; i !== string.length; ++i) {
    dataHighlights.push({prefixValsInd: i - 1, codeRow: 1, visualValsInd: i});
    let k = prefixVals[i - 1];
    dataHighlights.push({
      prefixValsInd: i - 1,
      codeRow: 2,
      leftToBounce: -1,
      rightToBounce: -1,
      equalPrefixSegs: [[0, k - 1], [i - k, i - 1]],
      visualValsInd: i,
      commentariesText: 'Так как \\(p[i] \\leq p[i - 1]  + 1\\), то проинициализируем рассматриваемый образец \\(k\\) значением \\(p[i - 1]\\) и будем пытаться его продолжить.'
    });
    if (k === 0) {
      dataHighlights.push({
        prefixValsInd: i - 1,
        codeRow: 3,
        equalCharsCheck: [i, k],
        visualValsInd: i,
        equalPrefixSegs: [[0, k - 1], [i - k, i - 1]],
        commentariesText: 'Так как мы проинициализировали рассматриваемый образец нулем, мы не сможем от него ничего получить, поэтому строим образец заново.'
      });
    } else if (string[i] === string[k]) {
      dataHighlights.push({
        prefixValsInd: i - 1,
        codeRow: 3,
        equalCharsCheck: [i, k],
        visualValsInd: i,
        equalPrefixSegs: [[0, k - 1], [i - k, i - 1]],
        commentariesText: 'Этот образец успешно продолжается, поэтому не будем дальше в него углубляться.'
      });
    } else {
      dataHighlights.push({
        prefixValsInd: i - 1,
        codeRow: 3,
        equalCharsCheck: [i, k],
        visualValsInd: i,
        equalPrefixSegs: [[0, k - 1], [i - k, i - 1]],
        commentariesText: 'Так как \\(s[i] \\neq s[k]\\), мы не можем продолжить данный образец. Нам надо углубиться в данный образец и найти в нем собственный префикс, который совпадает суффиксом этого образца. Это и есть по определению префикс функция этого образца.'
      });
    }
    let leftToBounce = -1;
    let rightToBounce = -1;
    let toMove = true;
    while (k > 0 && string[i] !== string[k]) {
      k = prefixVals[k - 1];
      leftToBounce = k + 1;
      rightToBounce = i - 1 - k;
      dataHighlights.push({
        prefixValsInd: i - 1,
        codeRow: 4,
        leftToBounce: leftToBounce,
        rightToBounce: rightToBounce,
        toBounceIn: toMove,
        equalPrefixSegs: [[0, k - 1], [i - k, i - 1]],
        visualValsInd: i,
        toMove: (!toMove ? 1 : 3),
        commentariesText: 'Берем префикс функцию образца, так как его длина \\(k\\), то его префикс функция лежит в \\(p[k - 1]\\).'
      });
      if (toMove) {
        toMove = false;
        dataHighlights.push({
          prefixValsInd: i - 1,
          codeRow: 4,
          leftToBounce: leftToBounce,
          rightToBounce: rightToBounce,
          toBounceIn: true,
          equalPrefixSegs: [[0, k - 1], [i - k, i - 1]],
          visualValsInd: i,
          toMove: 1,
          commentariesText: 'Выделили префикс функцию образца. Теперь сдвинем образцы друг под друга для большей наглядности.'
        });
      }
      // dataHighlights.push({
      //   prefixValsInd: i - 1,
      //   codeRow: 4,
      //   leftToBounce: leftToBounce,
      //   rightToBounce: rightToBounce,
      //   equalPrefixSegs: [[0, k - 1], [i - k, i - 1]],
      //   visualValsInd: i,
      //   toMove: 1,
      //   commentariesText: 'Опустим сейчас не рассматриваемые символы.'
      // });

      if (k === 0) {
        dataHighlights.push({
          prefixValsInd: i - 1,
          codeRow: 3,
          leftToBounce: leftToBounce,
          rightToBounce: rightToBounce,
          equalCharsCheck: [i, k],
          visualValsInd: i,
          toMove: 1,
          commentariesText: 'Углубились до нулевого образца и не сможем от него ничего получить, поэтому строим образец заново.'
        });
      } else if (string[i] === string[k]) {
        dataHighlights.push({
          prefixValsInd: i - 1,
          codeRow: 3,
          leftToBounce: leftToBounce,
          rightToBounce: rightToBounce,
          equalCharsCheck: [i, k],
          visualValsInd: i,
          toMove: 1,
          commentariesText: '\\(s[i] = s[k] - \\) этот образец успешно продолжается, поэтому не будем дальше в него углубляться.'
        });
      } else {
        dataHighlights.push({
          prefixValsInd: i - 1,
          codeRow: 3,
          leftToBounce: leftToBounce,
          rightToBounce: rightToBounce,
          equalCharsCheck: [i, k],
          visualValsInd: i,
          toMove: 1,
          commentariesText: 'Так как \\(s[i] \\neq s[k]\\), мы не можем продолжить данный образец. Нам надо углубиться в данный образец и найти в нем собственный префикс, который совпадает суффиксом этого образца. Это и есть по определению префикс функция этого образца.'
        });
      }
    }
    if (leftToBounce === -1 && rightToBounce === -1) {
      if (string[i] === string[k]) {
        dataHighlights.push({
          prefixValsInd: i - 1,
          codeRow: 5,
          leftToBounce: leftToBounce,
          rightToBounce: rightToBounce,
          toBounceIn: true,
          equalPrefixSegs: [[0, k - 1], [i - k, i - 1]],
          equalCharsCheck: [i, k],
          visualValsInd: i,
          commentariesText: 'Продолжаем образец, надо увеличить его длину.'
        });
      } else {
        dataHighlights.push({
          prefixValsInd: i - 1,
          codeRow: 5,
          leftToBounce: leftToBounce,
          rightToBounce: rightToBounce,
          toBounceIn: true,
          equalPrefixSegs: [[0, k - 1], [i - k, i - 1]],
          equalCharsCheck: [i, k],
          visualValsInd: i,
          commentariesText: 'Пока не можем начать заново строить образец, он остается нулевым.'
        });
      }
    } else {
      if (string[i] === string[k]) {
        dataHighlights.push({
          prefixValsInd: i - 1,
          codeRow: 5,
          leftToBounce: leftToBounce,
          rightToBounce: rightToBounce,
          toBounceIn: true,
          equalPrefixSegs: [[0, k - 1], [i - k, i - 1]],
          equalCharsCheck: [i, k],
          visualValsInd: i,
          toMove: 2,
          commentariesText: 'Строим образец заново, так как \\(s[i] = s[k]\\), можем его продлить.'
        });
      } else {
        dataHighlights.push({
          prefixValsInd: i - 1,
          codeRow: 5,
          leftToBounce: leftToBounce,
          rightToBounce: rightToBounce,
          toBounceIn: true,
          equalPrefixSegs: [[0, k - 1], [i - k, i - 1]],
          equalCharsCheck: [i, k],
          visualValsInd: i,
          toMove: 2,
          commentariesText: 'Пока не можем начать заново строить образец, он остается нулевым.'
        });
      }
    }
    if (string[i] === string[k]) {
      ++k;
      dataHighlights.push({
        prefixValsInd: i - 1,
        codeRow: 6,
        equalPrefixSegs: [[0, k - 1], [i - k + 1, i]],
        leftToBounce: -1,
        rightToBounce: -1,
        visualValsInd: i,
        commentariesText: 'Увеличиваем длину рассматриваемого образца на 1.'
      });
    }
    prefixVals[i] = k;
    dataHighlights.push({
      prefixValsInd: i,
      highlightCol: true,
      codeRow: 7,
      visualValsInd: i,
      commentariesText: 'Полученную длину образца заносим в \\(p[i]\\).'
    });
  }
  dataHighlights.push({prefixValsInd: string.length, visualValsInd: string.length, commentariesText: 'Алгоритм закончен.'});
  return {dataHighlights: dataHighlights, prefixVals: prefixVals};
}
