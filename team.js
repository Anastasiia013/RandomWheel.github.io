// Path: teams.js

const names = ['Наталия', 'Никита', 'Катерина', 'Владимир', 'Даниэла', 'Азамат', 'Антон', 'Анастасия Игнаткова', 'Даниэль', 'Алина', 'Андрей', 'Бекболот', 'Густаво', 'Анастасия Посохова', 'Дима Тао', 'Павло', 'Юлия', 'Влад', 'Ирина Никитенко', 'Сергей', 'Руслан', 'Абилбек', 'Дмитрий Осадчий', 'Валентина', 'Тимур', 'Марина', 'Елизавета', 'Ирина Гуртская'];

const generateTeams = () => {
  if (names.length < 20) {
    alert('Недостаточно имен для создания 4 команд по 5 человек в каждой.');
    return;
  }

  const shuffledNames = [...names].sort(() => Math.random() - 0.5);
  const teamsContainer = document.getElementById('teams');
  const remainingContainer = document.getElementById('remaining');
  teamsContainer.innerHTML = '';
  remainingContainer.innerHTML = '';

  for (let i = 0; i < 4; i++) {
    const teamMembers = shuffledNames.splice(0, 5);
    const captain = teamMembers[0];
    const coder = teamMembers[1];

    const teamDiv = document.createElement('div');
    teamDiv.className = 'team';

    const teamHeader = document.createElement('h3');
    teamHeader.textContent = `Команда ${i + 1}`;

    const captainPara = document.createElement('p');
    captainPara.textContent = `Капитан: ${captain}`;
    captainPara.style.color = 'red';

    const coderPara = document.createElement('p');
    coderPara.textContent = `Кодер: ${coder}`;
    coderPara.style.color = 'blue';

    const membersHeader = document.createElement('p');
    membersHeader.textContent = 'Студенты:';
    membersHeader.style.fontWeight = 'bold';

    const membersList = document.createElement('ul');
    teamMembers.forEach((member) => {
      const memberItem = document.createElement('li');
      memberItem.textContent = member;
      membersList.appendChild(memberItem);
    });

    teamDiv.appendChild(teamHeader);
    teamDiv.appendChild(captainPara);
    teamDiv.appendChild(coderPara);
    teamDiv.appendChild(membersHeader);
    teamDiv.appendChild(membersList);
    teamsContainer.appendChild(teamDiv);
  }

  if (shuffledNames.length > 0) {
    const remainingDiv = document.createElement('div');
    remainingDiv.className = 'remaining';

    const remainingHeader = document.createElement('h3');
    remainingHeader.textContent = 'Оставшиеся студенты:';

    const remainingList = document.createElement('ul');
    shuffledNames.forEach((member) => {
      const memberItem = document.createElement('li');
      memberItem.textContent = member;
      remainingList.appendChild(memberItem);
    });

    remainingDiv.appendChild(remainingHeader);
    remainingDiv.appendChild(remainingList);
    remainingContainer.appendChild(remainingDiv);
  }
};
