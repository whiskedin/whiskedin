//Tests handleBack and handleNext methods from HomePage class
//Future plans include tests for components also

const functions = require('./MockHomePage');

test('Test handleNext should increase idx', () => {
    expect(functions.handleNext(1)).toBe(2);
});

test('Test handleBack should decrease idx', () => {
    expect(functions.handleBack(1)).toBe(0);
});