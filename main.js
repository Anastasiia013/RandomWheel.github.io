const circle = document.querySelector('.wheelMain');
// колесо
const checkboxNames = document.querySelectorAll('.listNames input[type="checkbox"]'); // каждый чекбокс
let circleSector = []; // пустой массив
const sectorLabels = document.querySelector('.sectorLabels'); // пустой див для лейблов
const chosenStudent = document.querySelector('.studentsName'); // результат рандомайзера для показа на экране
let checkedStudents = JSON.parse(localStorage.getItem('checkedStudents')) || []; // массив объектов студентов в LocalStorage

const searchBtn = document.querySelector('.searchButton');
const searchIcon = document.querySelector('.searchIcon'); // Иконка внутри кнопки
const searchBarInput = document.getElementById('searchBar');
const labels = document.querySelectorAll('.listNames label');
const namesBox = document.querySelector('.listNames');
const searchBox = document.querySelector('.searchBox');

// после загрузки страницы подгружаем данные из LocalStorage
document.addEventListener('DOMContentLoaded', () => {
  checkedStudents.forEach((student) => {
    const checkbox = Array.from(checkboxNames).find((cb) => cb.value === student.name);

    if (checkbox) {
      checkbox.checked = student.checked; // устанавливаем состояние чекбокса
      if (student.checked) {
        circleSector.push({ name: student.name, color: student.color });
      }
    }
  });
  updateWheel();
});

// функция для сохранения студента в LocalStorage
function saveStudentsToLocalStorage() {
  localStorage.setItem('checkedStudents', JSON.stringify(checkedStudents));
}

// функция для удаления всех студентов из LocalStorage
function deleteAllStudentsFromLocalStorage() {
  checkedStudents = [];
  saveStudentsToLocalStorage();
}

// берем пять цветов и перебираем их по очереди
const colors = ['#FFC107', '#03A9F4', '#8BC34A', '#FF5722', '#8243D6'];
let currentColorIndex = 0;

function getColor() {
  // следующий цвет из массива
  const color = colors[currentColorIndex];
  currentColorIndex = (currentColorIndex + 1) % colors.length;
  return color;
}

// добавляем обработчики событий на чекбоксы
checkboxNames.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    const name = checkbox.value;

    if (checkbox.checked) {
      const color = getColor();
      checkedStudents.push({
        name,
        checked: true,
        color,
      });

      // добавляем в массив секторов для отображения на колесе
      circleSector.push({ name, color });
    } else {
      // в противном случае удаляем студента из массива checkedStudents
      const index = checkedStudents.findIndex((student) => student.name === name);
      if (index !== -1) {
        checkedStudents.splice(index, 1);
      }

      // удаляем имя из массива секторов
      circleSector = circleSector.filter((sector) => sector.name !== name);
    }
    saveStudentsToLocalStorage();
    updateWheel();
  });
});

// апдейт имен в секторах колеса
function updateWheel() {
  sectorLabels.innerHTML = '';

  if (circleSector.length === 0) {
    // если массив пуст, сделать круг белым
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

  // обновляем фон круга
  circle.style.background = `conic-gradient(${gradientParts.join(', ')})`;

  let firstAngle = 90;

  // добавляем лейблы
  circleSector.forEach((sector, index) => {
    const rotationAngle = sectorSize * index + sectorSize / 2;

    function getRotationAngle() {
      const sectorEnd = firstAngle + sectorSize;
      let middle = 0;
      if (circleSector.length % 2 === 0) {
        middle = sectorEnd - sectorSize / 2;
      } else {
        middle = (firstAngle + sectorEnd) / 2;
      }

      firstAngle = sectorEnd;
      return middle;
    }

    // в рассчитанные сектора круга добавляем имена
    const label = document.createElement('div');
    label.textContent = sector.name;
    label.style.transform = `rotate(${getRotationAngle()}deg) translate(-172px)`;
    sectorLabels.appendChild(label);
  });
}

// кнопка сброса чекбоксов
const resetAll = document.querySelector('.resetAllBtn').addEventListener('click', function () {
  // очищаем поле вывода победителя и LocalStorage
  chosenStudent.textContent = '';
  deleteAllStudentsFromLocalStorage();

  // очищаем секутора круга и чекбоксы
  checkboxNames.forEach((checkbox) => {
    checkbox.checked = false;
    circleSector = [];
  });
  updateWheel();
});

// кнопка "выбрать все"
const checkAll = document.querySelector('.checkAllBtn').addEventListener('click', function () {
  // очищаем поле вывода победителя и LocalStorage
  chosenStudent.textContent = '';
  circleSector = [];
  deleteAllStudentsFromLocalStorage();

  // добавляем все имена в сектора круга и в LocalStorage
  checkboxNames.forEach((checkbox) => {
    const name = checkbox.value;
    checkbox.checked = true;
    circleSector.push({ name, color: getColor() });
    checkedStudents.push({ name, checked: true, color: getColor() });
    saveStudentsToLocalStorage();
  });
  updateWheel();
});

// вращаем колесо
function spinWheel() {
  chosenStudent.textContent = '';
  const randomAngle = Math.random() * 360; // рандомный угол остановки
  const fullRotations = 1800; // 5 оборотов за 4 секунды
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
    chosenStudent.textContent = selectedSector ? selectedSector.name : ''; // выводим имя студента-победителя на экран
  }, 4000);
}

// кнопка "крутить колесо"
const btn = document.querySelector('.submitWheel').addEventListener('click', function () {
  spinWheel();
});

// вращение колеса по клику на него
circle.addEventListener('click', () => {
  spinWheel();
});

// // вращение колеса при нажатии клавиши Enter (убрала, чтобы не запускалось вместе с поиском)
// document.addEventListener('keydown', (event) => {
//     if (event.key === 'Enter') {
//         spinWheel();
//     }
// });

//функция поиска по именам
function searchForNames() {
  searchBarInput.addEventListener('input', () => {
    const query = searchBarInput.value.toLowerCase();

    // фильтруем список имен
    labels.forEach((label) => {
      const name = label.textContent.toLowerCase();
      if (name.includes(query)) {
        label.style.display = ''; // Показываем имя, если совпадает
      } else {
        label.style.display = 'none'; // Скрываем имя, если не совпадает
      }
    });
  });
}
searchForNames();

let isActive = false; // Флаг состояния поля

searchBox.addEventListener('click', () => {
  if (!isActive) {
    searchBarInput.disabled = false;
    searchBarInput.focus();
    searchIcon.innerHTML = `
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
        `;
    isActive = true;
  }
});

searchBtn.addEventListener('click', () => {
  if (isActive) {
    searchBarInput.value = ''; // Очищаем поле поиска
    searchBarInput.blur(); // Убираем фокус с поля
    searchIcon.innerHTML = `
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        `;
    isActive = false;

    // Сбрасываем отображение всех лейблов
    labels.forEach((label) => {
      label.style.display = ''; // Показываем все лейблы, включая выбранные
    });
  }
});

document.addEventListener('click', (event) => {
  if (!searchBtn.contains(event.target) && !searchBarInput.contains(event.target) && !searchBox.contains(event.target) && !namesBox.contains(event.target) && isActive) {
    searchBarInput.blur(); // Убираем фокус с поля
    searchIcon.innerHTML = `
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        `;
    isActive = false;
  }
});