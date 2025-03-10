/**
 * @summary This method returns random element from provided array
 * @param {Array} list Array with elements
 * @return {number} The random element
 * @author Nemanja Mitic
 */
export function getRandomElement (list) {
    return list[Math.floor((Math.random()*list.length))];
}

/**
 * @summary This method returns random int between provided values
 * @param {number} min The minimal value of random int
 * @param {number} max The maximal value of random int
 * @return {number} The random integer
 * @author Nemanja Mitic
 */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @summary This method returns added date on date provided
 * @param {string} startDate Date on which days will be added
 * @param {number} noOfDaysToAdd Number of days to add from startDate date
 * @return {string} Added date
 * @author Nemanja Mitic
 */
export function addDate(startDate, noOfDaysToAdd) {

  const plusHours = noOfDaysToAdd * 24

  // Get the number of milliseconds since 1970-1-1, then subtract 1 day (24*60*60*1000 milliseconds)
  const dt = new Date(Date.parse(startDate) + plusHours*60*60*1000);
  
  return dt.toISOString().substring(0, 10);
}