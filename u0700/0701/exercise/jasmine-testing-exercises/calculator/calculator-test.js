
it('should calculate the monthly rate correctly', function () {
  // ...
  const val1 = {
    amount: 10000,
    years: 5,
    rate: 7,   // 7%
  };
  const val2 = {
    amount: 15000,
    years: 6,
    rate: 2.45,   // 2.45%
  };
  expect(calculateMonthlyPayment(val1)).toEqual("198.01");
  // expect(calculateMonthlyPayment(val2)).toEqual("224.23");
});


it("should return a result with 2 decimal places", function() {
  // ..
  const val = {
    amount: 10000,
    years: 5,
    rate: 7.21,   // 7.21%
  };
  expect(calculateMonthlyPayment(val)).toEqual("199.00");
});

/// etc
