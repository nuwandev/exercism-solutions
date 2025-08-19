// @ts-check
//
// The line above enables type checking for this file. Various IDEs interpret
// the @ts-check directive. It will give you helpful autocompletion when
// implementing this exercise.

import { ElectronicDevice } from './lib.js';

/**
 * Checks if input is a boolean.
 *
 * @param {unknown} value
 * @returns {boolean} whether the input is a boolean
 */
export function isBoolean(value) {
  return typeof value === "boolean" ? true : false
}

/**
 * Checks if input is a finite number or bigint.
 *
 * @param {unknown} value
 * @returns {boolean} whether the input is a finite number or bigint
 */
export function isNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }else if(typeof value === "bigint") {
    return true
  }
  return false
}

/**
 * Checks if a value is an object.
 *
 * @param {unknown} value
 * @returns {boolean} whether the input is an object.
 */
export function isObject(value) {
  if (value === null) {
    return false
  }else if (typeof value === "object") {
    return true
  }
  return false
}

/**
 * Checks if a value is a numeric string.
 *
 * @param {unknown} value
 * @returns {boolean} whether the input is a numeric string.
 */
export function isNumericString(value) {
  if (typeof value !== "string" || value.length === 0) {
    return false;
  }

  let start = 0;
  if (value[0] === "-") {
    if (value.length === 1) return false; // "-" alone is not numeric
    start = 1;
  }

  for (let i = start; i < value.length; i++) {
    const c = value[i];
    if (c < "0" || c > "9") { // check if not a digit
      return false;
    }
  }

  return true;
}


/**
 * Checks if an object is an instance of the `ElectronicDevice` class or one of its children.
 *
 * @param {object} object
 * @returns {boolean} whether the object is an instance of the `ElectronicDevice` class or one of its children.
 */
export function isElectronic(object) {
  return object instanceof ElectronicDevice 
}

/**
 * Checks if a value is a non empty array.
 *
 * @param {unknown} value
 * @returns {boolean} whether the input is a non empty array.
 */
export function isNonEmptyArray(value) {
  if (Array.isArray(value)) {
    if (value.length !== 0) {
      return true
    }
    return false
  }else if (typeof value === "object") {
    return false
  }
  return false
}

/**
 * Checks if a value is an empty array.
 *
 * @param {unknown} value
 * @returns {boolean} whether the input is an empty array.
 */
export function isEmptyArray(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return true
    }
  }
  return false
}

/**
 * Checks if a value has a "type" property or method.
 *
 * @param {object} object
 * @returns {boolean} whether the input has a "type" property or method.
 */
export function hasType(object) {
  return 'type' in object
}

/**
 * Throws an error if an object is missing an "id" property or method.
 *
 * @param {object} object
 * @returns {never|void} undefined if the input has an "id" property or method, otherwise throws an error.
 */
export function assertHasId(object) {
  if (!('id' in object)) {
    throw new Error("Object is missing the 'id' property");
  }
}

/**
 * Checks if a value has an "id" property.
 *
 * @param {object} object
 * @returns {boolean} whether the input has an "id" property.
 */
export function hasIdProperty(object) {
  return Object.hasOwn(object, 'id');
}

/**
 * Checks if a value has a defined "type" property.
 *
 * @param {object} object
 * @returns {boolean} whether the input has a defined "type" property.
 */
export function hasDefinedType(object) {
   if (Object.hasOwn(object, 'type')) {
     if (object.type === undefined) {
       return false;
     }
     return true;
   }
  return false;
}
