async function sprintChallenge5() {
  // Note the async keyword, in case you wish to use `await` inside sprintChallenge5
  // 👇 WORK WORK BELOW THIS LINE 👇
  const footer = document.querySelector('footer');
  const currentYear = new Date().getFullYear();
  footer.textContent = `© BLOOM INSTITUTE OF TECHNOLOGY ${currentYear}`;

  const cardsContainer = document.querySelector('.cards');
  let learnersData;

  try {
    const responseLearners = await fetch('http://localhost:3003/api/learners');
    const responseMentors = await fetch('http://localhost:3003/api/mentors');

    learnersData = await responseLearners.json();
    const mentorsData = await responseMentors.json();

    // Set initial text for p.info
    const infoText = document.querySelector('.info');
    if (infoText) {
      infoText.textContent = 'No learner is selected';
    }

    for (const learner of learnersData) {
      const card = document.createElement('div');
      card.classList.add('card');

      const fullName = document.createElement('h3');
      fullName.textContent = learner.fullName;

      const email = document.createElement('div');
      email.textContent = learner.email;

      const mentorsHeading = document.createElement('h4');
      mentorsHeading.classList.add('closed');
      mentorsHeading.textContent = 'Mentors';

      const mentorsArrow = document.createElement('span');
      mentorsArrow.classList.add('arrow'); // Add a class for styling
      mentorsHeading.appendChild(mentorsArrow);

      const mentorsList = document.createElement('ul');
      mentorsList.classList.add('hidden'); // Initially hidden

      for (const mentorId of learner.mentors) {
        const mentor = mentorsData.find((m) => m.id === mentorId);
        if (mentor) {
          const mentorItem = document.createElement('li');
          mentorItem.textContent = `${mentor.firstName} ${mentor.lastName}`;
          mentorsList.appendChild(mentorItem);
        }
      }

      card.appendChild(fullName);
      card.appendChild(email);
      card.appendChild(mentorsHeading);
      card.appendChild(mentorsList);

      cardsContainer.appendChild(card);
    }

    // Add event listeners only if elements are available
    const cardElements = document.querySelectorAll('.card');
    if (cardElements) {
      cardElements.forEach((card) => {
        card.addEventListener('click', () => {
          const isSelected = card.classList.toggle('selected');
          const infoText = document.querySelector('.info');

          if (isSelected) {
            const selectedLearnerName = card.querySelector('h3').textContent;
            const selectedLearnerId = learnersData.find(
              (learner) => learner.fullName === selectedLearnerName
            ).id;
            card.querySelector('h3').textContent = `${selectedLearnerName}, ID ${selectedLearnerId}`; // Display both name and ID in the card
            infoText.textContent = `The selected learner is ${selectedLearnerName}`;
          } else {
            card.querySelector('h3').textContent = card.querySelector('h3').textContent.split(",")[0]; // Remove ID when not selected
            infoText.textContent = 'No learner is selected';
          }

          cardElements.forEach((otherCard) => {
            if (otherCard !== card && otherCard.classList.contains('selected')) {
              otherCard.classList.remove('selected');
              otherCard.querySelector('h3').textContent = otherCard.querySelector('h3').textContent.split(",")[0]; // Remove ID from other selected cards
            }
          });
        });

        const mentorsHeading = card.querySelector('h4');
        const mentorsList = card.querySelector('ul');

        if (mentorsHeading && mentorsList) {
          mentorsHeading.addEventListener('click', (event) => {

            if (card.classList.contains('selected')) {
              event.stopPropagation()
            }
            mentorsList.classList.toggle('visible');
            mentorsHeading.classList.toggle('open');
            mentorsHeading.classList.toggle('closed');
          });
        }
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// ❗ DO NOT CHANGE THE CODE  BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
else sprintChallenge5()
