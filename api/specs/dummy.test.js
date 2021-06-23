const f = (a, b) => a + b;

describe('dummy', () => {
	test('Function 1 + 1 = 2', () => {
		expect(f(1, 1)).toBe(2);
	});

	test('Function 2 + 3 = 5', () => {
		expect(f(2, 3)).toBe(5);
	});
});
