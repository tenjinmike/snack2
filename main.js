
document.addEventListener('DOMContentLoaded', () => {
    const numberContainer = document.getElementById('lotto-numbers');
    const generateBtn = document.getElementById('generate-btn');

    function getNumberColor(number) {
        if (number <= 10) return '#f44336'; // Red
        if (number <= 20) return '#FF9800'; // Orange
        if (number <= 30) return '#FFEB3B'; // Yellow
        if (number <= 40) return '#4CAF50'; // Green
        return '#2196F3'; // Blue
    }

    function generateLottoNumbers() {
        numberContainer.innerHTML = '';
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

        sortedNumbers.forEach((number, index) => {
            setTimeout(() => {
                const numberElement = document.createElement('div');
                numberElement.classList.add('lotto-number');
                numberElement.textContent = number;
                numberElement.style.backgroundColor = getNumberColor(number);
                numberElement.style.animation = 'fadeIn 0.5s ease-in-out';
                numberContainer.appendChild(numberElement);
            }, index * 200);
        });
    }

    generateBtn.addEventListener('click', generateLottoNumbers);

    // Initial generation
    generateLottoNumbers();
});

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.5);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;

document.head.appendChild(style);

