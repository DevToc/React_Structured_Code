type ValueType = string | number | boolean | undefined;

type Matrix = ValueType[][];

/**
 * The matrix transpose function
 */
export const transpose = (matrix: Matrix): Matrix => {
  const [row] = matrix.length > 0 ? matrix : [[]];

  return row.map((_, column) => matrix.map((row) => row[column]));
};
