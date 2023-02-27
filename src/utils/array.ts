/**
 * Randomizes the items of an array by reference.
 * @param sourceArray
 */
export function shuffle(sourceArray: Array<any>) {
  for (let i = 0; i < sourceArray.length - 1; i++) {
    const j = i + Math.floor(Math.random() * (sourceArray.length - i));

    const temp = sourceArray[j];
    sourceArray[j] = sourceArray[i];
    sourceArray[i] = temp;
  }

  return sourceArray;
}
