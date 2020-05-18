/**
 * Constrain a numeric value between two numeric values
 * @param {number} n - value to constrain
 * @param {number} low - minimum of constraining
 * @param {number} high - maximum of constraining
 * @returns {number}
 */
export function constrain( n:number, low:number, high:number ): number {
  return Math.max(Math.min(n, high), low);
}

/**
 * Get the flying distance between two point in pixels
 * @param {number} x1 - start.x
 * @param {number} y1 - start.y
 * @param {number} x2 - stop.x
 * @param {number} y2 - stop.y
 * @returns {number}
 */
export function dist( x1:number, y1:number, x2:number, y2:number ): number {
  return hypot(x2 - x1, y2 - y1)
}

/**
 * Change the "between factors" of a fraction value and get the new value
 * @param {number} n - value of base fraction (base numerator)
 * @param {number} start1 - min value of base numerator
 * @param {number} stop1 - base denominator
 * @param {number} start2 - min value of new numerator
 * @param {number} stop2 - new denominator
 * @param {boolean} [withinBounds] - constrain the new numerator
 * @returns {number}
 */
export function map( n:number,
   start1:number, stop1:number,
   start2:number, stop2:number,
   withinBounds:boolean = false
): number {
  const output = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2
  if(!withinBounds) return output
  return start2 < stop2 ?
    constrain(output, start2, stop2) :
    constrain(output, stop2, start2)
}

/**
 * Get the 0..1 float value of a fraction
 * @param {number} n - value of fraction (numerator)
 * @param {number} start - min value of numerator
 * @param {number} stop - denominator
 * @returns {number}
 */
export function norm( n:number, start:number, stop:number ): number {
  return map(n, start, stop, 0, 1)
}

/**
 * Get a random number
 * @param {number} [min] - min value of output or ùax value of output
 * @param {number} [max] - max value of output
 * @returns {number}
 */
export function random( min?:number[]|number, max?:number ): number {
  let rand = Math.random()
  if (typeof min === 'undefined') {
    return rand
  } else if (typeof max === 'undefined') {
    if (min instanceof Array) {
      return min[Math.floor(rand * min.length)]
    } else {
      return rand * min
    }
  } else {
    if (min > max) {
      const tmp = min as number
      min = max
      max = tmp
    }
    //@ts-ignore
    return rand * (max - min) + min
  }
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} [z]
 * @returns {number}
 */
export function hypot( x:number, y:number, z?:number ) {

  if (typeof Math.hypot === 'function') {
    return Math.hypot.apply(null, arguments);
  }

  const length = arguments.length;
  const args = [];
  let max = 0;
  for (let i = 0; i < length; i++) {
    let n = arguments[i];
    n = +n;
    if (n === Infinity || n === -Infinity) {
      return Infinity;
    }
    n = Math.abs(n);
    if (n > max) {
      max = n;
    }
    args[i] = n;
  }

  if (max === 0) {
    max = 1;
  }
  let sum = 0;
  let compensation = 0;
  for (let j = 0; j < length; j++) {
    const m = args[j] / max;
    const summand = m * m - compensation;
    const preliminary = sum + summand;
    compensation = preliminary - sum - summand;
    sum = preliminary;
  }
  return Math.sqrt(sum) * max;
}