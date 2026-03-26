
document.addEventListener('DOMContentLoaded', () => {
    const lottoContainer = document.getElementById('lotto-container');
    const generateBtn = document.getElementById('generate-btn');

    function getNumberColor(number) {
        if (number <= 10) return '#f44336'; // Red
        if (number <= 20) return '#FF9800'; // Orange
        if (number <= 30) return '#FFEB3B'; // Yellow
        if (number <= 40) return '#4CAF50'; // Green
        return '#2196F3'; // Blue
    }

    function generateLottoRow() {
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    function displayLottoRows() {
        lottoContainer.innerHTML = '';
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('div');
            row.classList.add('lotto-numbers');
            const lottoNumbers = generateLottoRow();
            lottoNumbers.forEach((number, index) => {
                setTimeout(() => {
                    const numberElement = document.createElement('div');
                    numberElement.classList.add('lotto-number');
                    numberElement.textContent = number;
                    numberElement.style.backgroundColor = getNumberColor(number);
                    numberElement.style.animation = 'fadeIn 0.5s ease-in-out';
                    row.appendChild(numberElement);
                }, index * 100 + i * 200);
            });
            lottoContainer.appendChild(row);
        }
    }

    generateBtn.addEventListener('click', displayLottoRows);

    // Initial generation
    displayLottoRows();
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
