// @ts-check
//
// The line above enables type checking for this file. Various IDEs interpret
// the @ts-check directive. It will give you helpful autocompletion when
// implementing this exercise.

/**
 * Determines how long it takes to prepare a certain juice.
 *
 * @param {string} name
 * @returns {number} time in minutes
 */
export function timeToMixJuice(name) {
  const juices = {
    'Pure Strawberry Joy': 0.5,
    'Energizer': 1.5,
    'Green Garden': 1.5,
    'Tropical Island': 3,
    'All or Nothing': 5,
    'Other': 2.5
  }
  if (name in juices) {
    return juices[name]
  }else {
    return  juices["Other"]
  }
}

/**
 * Calculates the number of limes that need to be cut
 * to reach a certain supply.
 *
 * @param {number} wedgesNeeded
 * @param {string[]} limes
 * @returns {number} number of limes cut
 */
export function limesToCut(wedgesNeeded, limes) {
  const wedgesPerLime = { small: 6, medium: 8, large: 10 };
  let wedgesCut = 0;
  let limeCut = 0;

  if (wedgesNeeded === 0) return limeCut
  
  for (let i = 0; i < limes.length; i++) {
    limeCut++
    wedgesCut += wedgesPerLime[limes[i]]
    if(wedgesCut>=wedgesNeeded) break
  }
  
  return limeCut
}

/**
 * Determines which juices still need to be prepared after the end of the shift.
 *
 * @param {number} timeLeft
 * @param {string[]} orders
 * @returns {string[]} remaining orders after the time is up
 */
export function remainingOrders(timeLeft, orders) {
  let remaining = [...orders];
  do {
    const next = remaining[0];
    timeLeft -= timeToMixJuice(next);
    remaining.shift();
  } while (timeLeft > 0 && remaining.length > 0);
  return remaining;
}
