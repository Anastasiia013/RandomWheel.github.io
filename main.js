const circle = document.querySelector('.wheelMain');
// колесо
const checkboxNames = document.querySelectorAll('.listNames input[type="checkbox"]'); // каждый чекбокс
let circleSector = []; // пустой массив
const sectorLabels = document.querySelector('.sectorLabels'); // пустой див для лейблов
const chosenStudent = document.querySelector('.studentsName');

// генерируем случайный цвет сектора
// function getRandomColor() {
//     const letters = '0123456789ABCDEF';
//     let color = '#';
//     for (let i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }

//беру только светлые цвета, чтобы видеть текст
function getRandomLightColor() {
    const minBrightness = 180;

    const r = Math.floor(Math.random() * (256 - minBrightness) + minBrightness);
    const g = Math.floor(Math.random() * (256 - minBrightness) + minBrightness);
    const b = Math.floor(Math.random() * (256 - minBrightness) + minBrightness);

    const color = `rgb(${r}, ${g}, ${b})`;
    return color;
}

// Добавляем обработчики событий на чекбоксы
checkboxNames.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
        const name = checkbox.value;
        if (checkbox.checked) {
            // Добавляем имя в массив и случайный цвет
            circleSector.push({ name, color: getRandomLightColor() });
        } else {
            // Удаляем имя из массива
            circleSector = circleSector.filter((sector) => sector.name !== name);
        }
        updateWheel(); // вызываем апдейт имен
    });
});

// апдейт имен
function updateWheel() {
    sectorLabels.innerHTML = '';

    if (circleSector.length === 0) {
        // Если массив пуст, сделать круг белым
        circle.style.background = 'white';
        return;
    }

    // задаем размер каждого сектора
    let angle = 0;
    const sectorSize = 360 / circleSector.length;
    const gradientParts = circleSector.map((sector) => {
        const startAngle = angle;
        const endAngle = angle + sectorSize;
        angle += sectorSize;
        return `${sector.color} ${startAngle}deg ${endAngle}deg`;
    });

    // Обновляем фон круга
    circle.style.background = `conic-gradient(${gradientParts.join(', ')})`;

    let firstAngle = 90;

    // Добавляем лейблы
    circleSector.forEach((sector, index) => {
        const rotationAngle = (sectorSize * index) + (sectorSize / 2);

        function getRotationAngle() {
            const sectorEnd = firstAngle + sectorSize;
            let middle = 0;
            if (circleSector.length % 2 === 0) {
                middle = sectorEnd - (sectorSize / 2);
            }
            else {
                middle = (firstAngle + sectorEnd) / 2;
            }

            firstAngle = sectorEnd;
            return middle;
        }

        const label = document.createElement('div');
        label.textContent = sector.name;

        // const radius = 200;
        label.style.transform = `rotate(${getRotationAngle()}deg) translate(-170px)`;
        sectorLabels.appendChild(label);

    });
};

// кнопка сброса чекбоксов
const resetAll = document.querySelector('.resetAllBtn').addEventListener('click', function () {
    chosenStudent.textContent = "";
    checkboxNames.forEach((checkbox) => {
        checkbox.checked = false;
        circleSector = [];
    });
    updateWheel();
});

// кнопка "выбрать все"
const checkAll = document.querySelector('.checkAllBtn').addEventListener('click', function () {
    chosenStudent.textContent = "";
    checkboxNames.forEach((checkbox) => {
        const name = checkbox.value;
        checkbox.checked = true;

        const exists = circleSector.some((sector) => sector.name === name);
        if (!exists) {
            circleSector.push({ name, color: getRandomLightColor() });
        }
    });
    updateWheel();
});

// кнопка "крутить колесо"
const btn = document.querySelector('.submitWheel').addEventListener('click', function () {
    chosenStudent.textContent = "";
    const randomAngle = Math.random() * 360;
    const fullRotations = 1800;
    const finalAngle = fullRotations + randomAngle;

    // анимация
    circle.style.transition = 'transform 5s ease-out';
    circle.style.transform = `rotate(${finalAngle}deg)`;

    setTimeout(() => {
        const normalizedAngle = finalAngle % 360;
        circle.style.transition = 'none';
        circle.style.transform = `rotate(${normalizedAngle}deg)`;

        const sectorSize = 360 / circleSector.length;
        const selectedIndex = Math.floor((360 - normalizedAngle) / sectorSize) % circleSector.length;

        const selectedSector = circleSector[selectedIndex];
        chosenStudent.textContent = selectedSector ? selectedSector.name : '';

    }, 5000);
});