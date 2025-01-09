const circle = document.querySelector('.wheelMain');
// колесо
const checkboxNames = document.querySelectorAll('.listNames input[type="checkbox"]'); // каждый чекбокс
let circleSector = []; // пустой массив
const sectorLabels = document.querySelector('.sectorLabels'); // пустой див для лейблов
const chosenStudent = document.querySelector('.studentsName');

document.addEventListener('DOMContentLoaded', () => {
    checkboxNames.forEach((checkbox) => {
        checkbox.checked = false;
    })
})

const colors = ["#FFC107", "#03A9F4", "#8BC34A", "#FF5722", "#8243D6"];
let currentColorIndex = 0;

function getColor() {
    // следующий цвет из массива
    const color = colors[currentColorIndex];
    currentColorIndex = (currentColorIndex + 1) % colors.length;
    return color;
}

// Добавляем обработчики событий на чекбоксы
checkboxNames.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
        const name = checkbox.value;
        if (checkbox.checked) {
            // Добавляем имя в массив и случайный цвет
            circleSector.push({ name, color: getColor() });
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
        label.style.transform = `rotate(${getRotationAngle()}deg) translate(-185px)`;
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
            circleSector.push({ name, color: getColor() });
        }
    });
    updateWheel();
});

function spinWheel() {
    chosenStudent.textContent = "";
    const randomAngle = Math.random() * 360;
    const fullRotations = 1800;
    const finalAngle = fullRotations + randomAngle;

    // анимация
    circle.style.transition = 'transform 4s cubic-bezier(0.1, 0.9, 0.2, 1)';
    circle.style.transform = `rotate(${finalAngle}deg)`;

    setTimeout(() => {
        const normalizedAngle = finalAngle % 360;
        circle.style.transition = 'none';
        circle.style.transform = `rotate(${normalizedAngle}deg)`;

        const sectorSize = 360 / circleSector.length;
        const selectedIndex = Math.floor((360 - normalizedAngle) / sectorSize) % circleSector.length;

        const selectedSector = circleSector[selectedIndex];
        chosenStudent.textContent = selectedSector ? selectedSector.name : '';

    }, 4000);
}

// кнопка "крутить колесо"
const btn = document.querySelector('.submitWheel').addEventListener('click', function () {
    spinWheel()
});

// Обработка событий клика
circle.addEventListener('click', () => {
    spinWheel();
});

// Обработка событий нажатия клавиши Enter
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        spinWheel();
    }
});