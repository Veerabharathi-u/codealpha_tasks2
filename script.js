const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    // Ensure display doesn't exceed 10 characters for better UI, using scientific notation if needed
    if (calculator.displayValue.length > 10) {
        display.value = parseFloat(calculator.displayValue).toExponential(5);
    } else {
        display.value = calculator.displayValue;
    }
}

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        // Prevent multiple leading zeros
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    // If waiting for second operand, start a new number with '0.'
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        return;
    }

    // Ensure the display value does not already contain a decimal point
    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    // If an operator is already set and waiting for a second operand, replace the operator
    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    // Set the first operand if it hasn't been set yet
    if (firstOperand === null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        // Calculate the result of the previous operation
        const result = performCalculation[operator](firstOperand, inputValue);

        // Limit the number of decimal places for display purposes
        calculator.displayValue = String(result);
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => {
        if (secondOperand === 0) {
            alert("Error: Division by zero!");
            return '0';
        }
        return firstOperand / secondOperand;
    },
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand, // Handled within handleOperator
};

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

// Event Listener Setup
const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    const value = target.value;

    if (!target.matches('button')) {
        return;
    }

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
            handleOperator(value);
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'all-clear':
            resetCalculator();
            break;
        default:
            // Check if the value is a number
            if (!isNaN(parseFloat(value))) {
                inputDigit(value);
            }
    }

    updateDisplay();
});

// BONUS: Keyboard Support
document.addEventListener('keydown', (event) => {
    const key = event.key;

    // Map keyboard keys to calculator button values
    let value;
    if (!isNaN(parseFloat(key))) { // Numbers
        value = key;
    } else if (key === '.') {
        value = key;
    } else if (key === '+') {
        value = key;
    } else if (key === '-') {
        value = key;
    } else if (key === '*' || key === 'x') {
        value = '*';
    } else if (key === '/' || key === '÷') {
        value = '/';
    } else if (key === 'Enter' || key === '=') {
        value = '=';
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        value = 'all-clear';
    } else {
        return; // Ignore other keys
    }

    // Simulate a click action to trigger the same logic
    const button = document.querySelector(`button[value="${value}"]`);
    if (button) {
        button.click();
        // Optional: Add a temporary visual feedback for the keyboard press
        button.classList.add('active-key');
        setTimeout(() => button.classList.remove('active-key'), 100);
    }
});

// Initial display update
updateDisplay();


