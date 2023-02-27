import { shuffle } from 'utils/array';

describe('utils/array.ts', () => {
  test('it should shuffle an array', () => {
    const array = ['a', 'b', 'c', 'd', 'e'];
    const arrayCopy = [...array];

    expect(
      array[0] === arrayCopy[0] &&
        array[1] === arrayCopy[1] &&
        array[2] === arrayCopy[2] &&
        array[3] === arrayCopy[3] &&
        array[4] === arrayCopy[4],
    ).toBeTruthy();
    shuffle(array);
    expect(
      array[0] === arrayCopy[0] &&
        array[1] === arrayCopy[1] &&
        array[2] === arrayCopy[2] &&
        array[3] === arrayCopy[3] &&
        array[4] === arrayCopy[4],
    ).toBeFalsy();
  });
});
