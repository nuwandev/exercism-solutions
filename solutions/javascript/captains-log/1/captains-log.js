// @ts-check

/**
 * Generates a random starship registry number.
 *
 * @returns {string} the generated registry number.
 */
export function randomShipRegistryNumber() {
  const id = Math.floor(1001 + Math.random()*(9999 - 1001))
  return `NCC-${id}`
}

/**
 * Generates a random stardate.
 *
 * @returns {number} a stardate between 41000 (inclusive) and 42000 (exclusive).
 */
export function randomStardate() {
  return 41000.0 + Math.random()*(42000.0 - 41000.0)
}

/**
 * Generates a random planet class.
 *
 * @returns {string} a one-letter planet class.
 */
export function randomPlanetClass() {
  const classes = ['D','H','J','K','L','M','N','R','T','Y'];
  const randomIndex = Math.floor(Math.random() * classes.length);
  return classes[randomIndex];
}
