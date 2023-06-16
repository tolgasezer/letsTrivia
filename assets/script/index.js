const question = document.getElementById('question');
const choiceContainer = document.getElementById('choice-container');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const nextBtn = document.getElementById('nxt-btn');
const restartBtn = document.getElementById('restart-btn');
const loader = document.getElementById('loader');
const game = document.getElementById('containerC');
game.classList.add('hidden');
game.classList.add('justify-center');

const CORRECT_BONUS = 10;
const difficulty = sessionStorage.getItem('difficulty');
const numberOfQuestions = sessionStorage.getItem('numberOfQuestions');
let currentQuestion = {};
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let currentQuestionIndex = 0;
let questions = [];

// index uzerinden ilerlemeli
// geri butonu olmali
// cevap verildikten sonra dogru cevap yesil, yanlis cevaplar kirmizi, kullanicinin cevabina border
// cevap verilen soru tekrar gorulebilir ama cevap degistirilemez

const initGame = async () => {
  await getQuestionsAsync();
  score = 0;
  questionCounter = 0;
  availableQuestions = [...questions];
  getNewQuestion();
  game.classList.remove('hidden');
  loader.classList.add('hidden');
};

const getQuestionsAsync = async () => {
  const rawQuestionResponse = await fetch(
    `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=18&difficulty=${difficulty}&type=multiple`
  );
  const questionResponse = await rawQuestionResponse.json();
  questions = mapQuestions(questionResponse);
};

const mapQuestions = (unmappedQuestions) => {
  return unmappedQuestions.results.map((question) => {
    const choices = [...question.incorrect_answers, question.correct_answer];
    const shuffledChoices = shuffle(choices);
    const answerIndex = shuffledChoices.indexOf(question.correct_answer);
    const formattedQuestion = {
      question: question.question,
      choiceText: shuffledChoices,
      answer: answerIndex,
    };
    return formattedQuestion;
  });
};

const shuffle = (array) => {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const getNewQuestion = () => {
  const questionLength = questions.length;
  const availableQuestionsLength = availableQuestions.length;

  if (availableQuestionsLength === 0 || questionCounter > questionLength) {
    endGame(questionLength);
    return;
  }

  choiceContainer.innerText = '';
  nextBtn.setAttribute('disabled', '');
  questionCounter++;
  const questionIndex = Math.floor(Math.random() * availableQuestionsLength);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  for (let i = 0; i < currentQuestion.choiceText.length; i++) {
    const newChoice = document.createElement('div');
    const choiceTextNode = document.createTextNode(`${currentQuestion.choiceText[i]}`);
    newChoice.appendChild(choiceTextNode);
    choiceContainer.appendChild(newChoice);
    newChoice.classList.add('choice-container'); //prefix i feda ettik ama olsun.

    newChoice.addEventListener('click', () => {
      // Tüm choice-container'ları seçim yapılmamış duruma getir
      const allChoices = document.querySelectorAll('.choice-container');
      allChoices.forEach((choice) => {
        choice.classList.remove('selected');
      });

      // Seçili olan choice-containera selected classı ekle
      newChoice.classList.add('selected');

      //console.log(choicesArray.indexOf('div.choice-container.selected'));
      nextBtn.removeAttribute('disabled');
    });
  }
  availableQuestions.splice(questionIndex, 1);
};
const findTruth = () =>{

};

const endGame = (questionLength) => {
  nextBtn.classList.add('hidden');
  restartBtn.classList.remove('hidden');
  question.innerText = `Your Score is: ${score * CORRECT_BONUS}/${questionLength * CORRECT_BONUS}`;
  choiceContainer.style.display = 'none';
  return;
};

const restartQuiz = () => {
  window.location.assign('./index.html');

  startGame();
};

//Buradan her soru icin dogru yanlis kontrol edip cerceve ekleyecegim. getnewquestion icin de index ve prev buton eklemem gerekli
const selectedHandler = () =>{
  const selected = document.querySelector('.selected');
  console.log(selected.innerHTML);
  if (selected.innerText == currentQuestion.choiceText[currentQuestion.answer]) {
    score++;
  }
  getNewQuestion();
};

nextBtn.addEventListener('click', selectedHandler);
restartBtn.addEventListener('click', restartQuiz);
initGame();
