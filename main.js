document.addEventListener('DOMContentLoaded', () => {
    const lottoBoard = document.getElementById('lotto-board');
    const generateBtn = document.getElementById('generate-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');

    // Theme logic
    let isDarkMode = localStorage.getItem('lotto-theme') !== 'light';
    updateTheme();

    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        localStorage.setItem('lotto-theme', isDarkMode ? 'dark' : 'light');
        updateTheme();
    });

    function updateTheme() {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            themeIcon.textContent = '🌙';
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            themeIcon.textContent = '☀️';
        }
    }

    function getBallColorClass(number) {
        if (number <= 10) return 'ball-1'; // Yellow
        if (number <= 20) return 'ball-2'; // Blue
        if (number <= 30) return 'ball-3'; // Red
        if (number <= 40) return 'ball-4'; // Gray
        return 'ball-5'; // Green
    }

    function generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    async function displayLottoRows() {
        lottoBoard.innerHTML = '';
        generateBtn.disabled = true;
        generateBtn.textContent = '추출 중...';

        for (let i = 0; i < 5; i++) {
            const row = document.createElement('div');
            row.classList.add('lotto-row');
            row.style.animationDelay = `${i * 0.1}s`;
            lottoBoard.appendChild(row);

            const numbers = generateLottoNumbers();
            
            for (let j = 0; j < numbers.length; j++) {
                await new Promise(resolve => setTimeout(resolve, 50));
                const ball = document.createElement('div');
                ball.classList.add('lotto-ball', getBallColorClass(numbers[j]));
                ball.textContent = numbers[j];
                ball.style.animationDelay = `${j * 0.1}s`;
                row.appendChild(ball);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        generateBtn.disabled = false;
        generateBtn.textContent = '행운의 번호 추출';
    }

    generateBtn.addEventListener('click', displayLottoRows);

    // Initial generation
    displayLottoRows();
});
