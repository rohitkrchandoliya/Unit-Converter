// Unit conversion factors are expressed relative to a canonical base unit.
const UNIT_FACTORS = {
    length: {
        meters: 1,
        kilometers: 1000,
        miles: 1609.344,
        inches: 0.0254,
        centimeters: 0.01,
        yards: 0.9144
    },
    weight: {
        grams: 1,
        kilograms: 1000,
        pounds: 453.59237,
        ounces: 28.349523125,
        // "Tons" means metric tonnes in this converter.
        tons: 1000000
    },
    area: {
        squaremeters: 1,
        squarekilometers: 1000000,
        squaremiles: 2589988.110336,
        acres: 4046.8564224,
        hectares: 10000
    },
    volume: {
        cubicmeters: 1,
        liters: 0.001,
        // US liquid gallons.
        gallons: 0.003785411784,
        cubicinches: 0.000016387064,
        cubicfeet: 0.028316846592
    },
    speed: {
        meterssecond: 1,
        kilometershour: 1 / 3.6,
        mileshour: 0.44704
    },
    time: {
        seconds: 1,
        minutes: 60,
        hours: 3600,
        days: 86400,
        weeks: 604800
    }
};

const UNIT_OPTIONS = {
    length: ['Meters', 'Kilometers', 'Miles', 'Inches', 'Centimeters', 'Yards'],
    temperature: ['Celsius', 'Fahrenheit', 'Kelvin'],
    weight: ['Grams', 'Kilograms', 'Pounds', 'Ounces', 'Tons'],
    area: ['Square Meters', 'Square Kilometers', 'Square Miles', 'Acres', 'Hectares'],
    volume: ['Cubic Meters', 'Liters', 'Gallons', 'Cubic Inches', 'Cubic Feet'],
    speed: ['Meters/Second', 'Kilometers/Hour', 'Miles/Hour'],
    time: ['Seconds', 'Minutes', 'Hours', 'Days', 'Weeks']
};

function unitValue(unit) {
    return unit.toLowerCase().replace(/[\s/]/g, '');
}

// Populate both unit selectors for the selected category.
function updateUnits(unitType) {
    const fromUnitSelect = document.getElementById('fromUnit');
    const toUnitSelect = document.getElementById('toUnit');
    const units = UNIT_OPTIONS[unitType] || [];

    fromUnitSelect.replaceChildren();
    toUnitSelect.replaceChildren();

    units.forEach(label => {
        const value = unitValue(label);
        fromUnitSelect.add(new Option(label, value));
        toUnitSelect.add(new Option(label, value));
    });
}

function convertTemperature(value, fromUnit, toUnit) {
    // Convert the input to Celsius first, then from Celsius to the target unit.
    let celsius;
    if (fromUnit === 'celsius') celsius = value;
    else if (fromUnit === 'fahrenheit') celsius = (value - 32) * 5 / 9;
    else if (fromUnit === 'kelvin') celsius = value - 273.15;
    else throw new Error('Unsupported temperature unit');

    if (celsius < -273.15) {
        throw new RangeError('The value is below absolute zero.');
    }

    if (toUnit === 'celsius') return celsius;
    if (toUnit === 'fahrenheit') return celsius * 9 / 5 + 32;
    if (toUnit === 'kelvin') return celsius + 273.15;
    throw new Error('Unsupported temperature unit');
}

function convertValue(value, unitType, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;

    if (unitType === 'temperature') {
        return convertTemperature(value, fromUnit, toUnit);
    }

    const factors = UNIT_FACTORS[unitType];
    if (!factors || !(fromUnit in factors) || !(toUnit in factors)) {
        throw new Error('Unsupported unit conversion.');
    }

    return value * factors[fromUnit] / factors[toUnit];
}

document.getElementById('unitType').addEventListener('change', function () {
    updateUnits(this.value);
});

document.getElementById('convertBtn').addEventListener('click', function () {
    const input = document.getElementById('valueInput');
    const resultElement = document.getElementById('convertedValue');
    const value = Number(input.value);
    const unitType = document.getElementById('unitType').value;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;

    if (input.value.trim() === '' || !Number.isFinite(value)) {
        resultElement.textContent = 'Please enter a valid number.';
        return;
    }

    try {
        const result = convertValue(value, unitType, fromUnit, toUnit);
        resultElement.textContent = Number(result.toPrecision(12)).toString();
    } catch (error) {
        resultElement.textContent = error.message || 'Conversion failed.';
    }
});

// Initialize the selectors for the default category on page load.
updateUnits(document.getElementById('unitType').value);
