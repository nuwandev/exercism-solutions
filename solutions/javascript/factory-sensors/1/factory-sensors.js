// @ts-check

export class ArgumentError extends Error {}

export class OverheatingError extends Error {
  constructor(temperature) {
    super(`The temperature is ${temperature} ! Overheating !`);
    this.temperature = temperature;
  }
}

/**
 * Check if the humidity level is not too high.
 *
 * @param {number} humidityPercentage
 * @throws {Error}
 */
export function checkHumidityLevel(humidityPercentage) {
  if(humidityPercentage>70){
    throw new Error('Hight humidity level ditected!')
  }
}

/**
 * Check if the temperature is not too high.
 *
 * @param {number|null} temperature
 * @throws {ArgumentError|OverheatingError}
 */
export function reportOverheating(temperature) {
  if(temperature === null){
    throw new ArgumentError('Sensors are borken');
  }else if(temperature > 500) {
    let err = new OverheatingError();
    err.temperature= temperature;
    throw err
  }
}

/**
 *  Triggers the needed action depending on the result of the machine check.
 *
 * @param {{
 * check: function,
 * alertDeadSensor: function,
 * alertOverheating: function,
 * shutdown: function
 * }} actions
 * @throws {ArgumentError|OverheatingError|Error}
 */
export function monitorTheMachine(actions) {
  try {
    actions.check()
  } catch (error) {
    if (error instanceof ArgumentError) {
      actions.alertDeadSensor();
    }else if (error instanceof OverheatingError) {
      if (error.temperature < 600) {
        actions.alertOverheating();
      }else {
        actions.shutdown();
      }
    }else {
      throw error
    }
  }
}
