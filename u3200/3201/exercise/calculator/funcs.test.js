const { mean, median, mode } = require("./funcs");

const meanArr1 = [4, 7, 13, 52];
const meanArr2 = [10, 20, 63];
const medianArr1 = [37, 41, 55, 88, 93];
const medianArr2 = [3, 5, 5, 9, 16, 23, 35];
const medianArr3 = [12, 73, 75, 99];
const medianArr4 = [4, 9, 13, 21, 34, 55];
const modeArr1 = [1, 1, 1, 5, 5, 8, 8, 11, 45];
const modeArr2 = [1, 1, 5, 5, 8, 8, 8, 11, 45];
const modeArr3 = [1, 1, 5, 5, 8, 8, 11, 45];
const modeArr4 = [1, 5, 5, 8, 8, 11, 45, 45];
const modeArr5 = [1, 1, 5, 5, 8, 8, 11, 11, 45, 45];
const modeArr6 = [1, 1, 1, 8, 8, 8, 11, 11, 11];

describe('mean function test', () => {
  test('mean should find the mean', () => {
    const res1 = mean(meanArr1);
    expect(res1).toEqual(19);
    const res2 = mean(meanArr2);
    expect(res2).toEqual(31);
  });
});

describe('median function test', () => {
  test('median should find the median when there are odd number of numbers', () => {
    const res1 = median(medianArr1);
    expect(res1).toEqual(55);
    const res2 = median(medianArr2);
    expect(res2).toEqual(9);
  });

  test('median should find the median when there are even number of numbers', () => {
    const res1 = median(medianArr3);
    expect(res1).toEqual(74);
    const res2 = median(medianArr4);
    expect(res2).toEqual(17);
  });
});

describe('mode function test', () => {
  test('mode should find the only mode', () => {
    const res1 = mode(modeArr1);
    expect(res1).toEqual(1);
    const res2 = mode(modeArr2);
    expect(res2).toEqual(8);
  });
  test('mode should find the multi modes', () => {
    const res1 = mode(modeArr3);
    expect(res1).toEqual([1, 5, 8]);
    const res2 = mode(modeArr4);
    expect(res2).toEqual([5, 8, 45]);
  });
  test('mode should find out if there is no mode', () => {
    const res1 = mode(modeArr5);
    expect(res1).toBeNull();
    const res2 = mode(modeArr6);
    expect(res2).toBeNull();
  });
});