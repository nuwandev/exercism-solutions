// @ts-check

/**
 * Create an appointment
 *
 * @param {number} days
 * @param {number} [now] (ms since the epoch, or undefined)
 *
 * @returns {Date} the appointment
 */
export function createAppointment(days, now = undefined) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  // If now is undefined, use current time
  const baseMs = now === undefined ? Date.now() : now;

  // Add n days (in ms) and return a Date
  return new Date(baseMs + days * MS_PER_DAY);
}

/**
 * Generate the appointment timestamp
 *
 * @param {Date} appointmentDate
 *
 * @returns {string} timestamp
 */
export function getAppointmentTimestamp(appointmentDate) {
  return appointmentDate.toISOString();
}

/**
 * Get details of an appointment
 *
 * @param {string} timestamp (ISO 8601)
 *
 * @returns {Record<'year' | 'month' | 'date' | 'hour' | 'minute', number>} the appointment details
 */
export function getAppointmentDetails(timestamp) {
  const date = new Date(timestamp);
  return { year: date.getFullYear(), month: date.getMonth(), date: date.getDate(), hour: date.getHours(), minute: date.getMinutes() }
}

/**
 * Update an appointment with given options
 *
 * @param {string} timestamp (ISO 8601)
 * @param {Partial<Record<'year' | 'month' | 'date' | 'hour' | 'minute', number>>} options
 *
 * @returns {Record<'year' | 'month' | 'date' | 'hour' | 'minute', number>} the appointment details
 */
export function updateAppointment(timestamp, options) {
  const date = new Date(timestamp);

  if (options.year !== undefined) {
    date.setFullYear(options.year);
  }
  if (options.month !== undefined) {
    date.setMonth(options.month);
  }
  if (options.date !== undefined) {
    date.setDate(options.date);
  }
  if (options.hour !== undefined) {
    date.setHours(options.hour);
  }
  if (options.minute !== undefined) {
    date.setMinutes(options.minute);
  }

  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes()
  };
}

/**
 * Get available time in seconds (rounded) between two appointments
 *
 * @param {string} timestampA (ISO 8601)
 * @param {string} timestampB (ISO 8601)
 *
 * @returns {number} amount of seconds (rounded)
 */
export function timeBetween(timestampA, timestampB) {
  const date1 = new Date(timestampA);
  const date2 = new Date(timestampB);
  const between = Math.abs(date1-date2);
  return Math.round(between/1000)
}

/**
 * Get available times between two appointment
 *
 * @param {string} appointmentTimestamp (ISO 8601)
 * @param {string} currentTimestamp (ISO 8601)
 */
export function isValid(appointmentTimestamp, currentTimestamp) {
  const appointment = new Date(appointmentTimestamp);
  const cuurent = new Date(currentTimestamp);
  return cuurent < appointment
}
