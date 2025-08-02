/// <reference path="./global.d.ts" />
//
// @ts-check

/**
 * Determine the price of the pizza given the pizza and optional extras
 *
 * @param {Pizza} pizza name of the pizza to be made
 * @param {Extra[]} extras list of extras
 *
 * @returns {number} the price of the pizza
 */

const PRICES = {Margherita: 7, Caprese: 9, Formaggio: 10, ExtraSauce: 1, ExtraToppings: 2}
export function pizzaPrice(pizza, ...extras) {
  function sumExtras(options) {
    if (options.length === 0) return 0;
    return PRICES[options[0]] + sumExtras(options.slice(1))
  }

  return PRICES[pizza] + sumExtras(extras)
}

/**
 * Calculate the price of the total order, given individual orders
 *
 * (HINT: For this exercise, you can take a look at the supplied "global.d.ts" file
 * for a more info about the type definitions used)
 *
 * @param {PizzaOrder[]} pizzaOrders a list of pizza orders
 * @returns {number} the price of the total order
 */
export function orderPrice(pizzaOrders) {
  let netPrice = 0;
  
  for (let j = 0; j < pizzaOrders.length; j++) {
    let sumExtras = 0;
    for (let i = 0; i < pizzaOrders[j].extras.length; i++) {
      sumExtras += PRICES[pizzaOrders[j].extras[i]];
    }
    netPrice += PRICES[pizzaOrders[j].pizza] + sumExtras 
  }
  
  return netPrice
}
