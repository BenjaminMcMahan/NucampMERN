module.exports = (x, y, callback) => {
    if (x <= 0 || y <= 0) {
        // Error...
        callback(new Error(`Rectangle dimensions must be greater than zero. Received: ${x}, ${y}`));
    } else {
        // Simulate synchronous function
        setTimeout(() => {
            // No error
            callback(null, {
                // Closure. This inner function has access to the parameters of the outer function
                perimeter: () => 2 * (x + y),
                area: () => x * y
            });
        }, 2000);
    }
};