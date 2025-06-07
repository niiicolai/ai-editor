
function add(a,b) {
    return a + b;
}

function subtract(a,b) {
    return a - b;
}

function multiply(a,b) {
    return a * b;
}

function sum(...arg) {
    return arg.reduce((acc, curr) => acc + curr, 0);
}
