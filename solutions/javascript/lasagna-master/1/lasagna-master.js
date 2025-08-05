/// <reference path="./global.d.ts" />
// @ts-check

/**
 * Implement the functions needed to solve the exercise here.
 * Do not forget to export them so they are available for the
 * tests. Here an example of the syntax as reminder:
 *
 * export function yourFunction(...) {
 *   ...
 * }
 */

export function cookingStatus(remainingTime) {
  if(remainingTime == undefined) {
    return 'You forgot to set the timer.'
  }else if (remainingTime === 0){
    return 'Lasagna is done.'
  }else {
    return 'Not done, please wait.'
  }
}

export function preparationTime(layers, avgTime=2) {
  return avgTime * layers.length
}

export function quantities (layers) {
  let noodles = 0;
  let sauce = 0;
  
  for (let layer of layers) {
    if (layer === 'noodles') {
      noodles++;
    }
    if (layer === 'sauce') {
      sauce++;
    }
  }

  return {noodles: noodles*50, sauce: sauce*0.2}
}

export function addSecretIngredient (friendsList, myList) {
  let lastIngredient = friendsList[friendsList.length-1]
  // myList = [...myList, lastIngredient]
  myList.push(lastIngredient)
}

export function scaleRecipe(recipes, NoPortions) {
  let scaled = {};
  for (const ingredient in recipes) {
      scaled[ingredient] = recipes[ingredient] * (NoPortions/2)
  }
  return scaled
}