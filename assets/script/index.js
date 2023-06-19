const question = document.getElementById('question');
const choiceContainer = document.getElementById('choice-container');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const nextBtn = document.getElementById('nxt-btn');
const restartBtn = document.getElementById('restart-btn');
const loader = document.getElementById('loader');
const game = document.getElementById('containerC');
const prevBtn = document.getElementById('prev-btn');
game.classList.add('hidden');
game.classList.add('justify-center');

const CORRECT_BONUS = 10;
const difficulty = sessionStorage.getItem('difficulty');
const numberOfQuestions = sessionStorage.getItem('numberOfQuestions');
let currentQuestion = {};
let score = 0;
let questionCounter = 0;
let previousCounter = 0;
let availableQuestions = [];
//let currentQuestionIndex = 0;
let questions = [];
//let prevQuestions = [];
//let prevAnswer = [];

// index uzerinden ilerlemeli
// geri butonu olmali
// cevap verildikten sonra dogru cevap yesil, yanlis cevaplar kirmizi, kullanicinin cevabina border
// cevap verilen soru tekrar gorulebilir ama cevap degistirilemez

const initGame = async () => {
  await getQuestionsAsync();
  score = 0;
  questionCounter = 0;
  availableQuestions = [...questions];
  showQuestion();
  disableNextButton();
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

const selectChoice = (choiceElement) =>{
  const allChoices = document.querySelectorAll('.choice-container');
    allChoices.forEach((choice) => {
      choice.classList.remove('selected');
    });
    choiceElement.classList.add('selected');
    enableNextButton();
    
}

const createChoiceElement = (choiceText) =>{
  const newChoice = document.createElement('div');
  const choiceTextNode = document.createTextNode(choiceText);
  newChoice.appendChild(choiceTextNode);
  choiceContainer.appendChild(newChoice);
  newChoice.classList.add('choice-container');

  newChoice.addEventListener('click', () => {
    selectChoice(newChoice);
  });
  
};

const disableNextButton = () => {
  nextBtn.setAttribute('disabled', '');
};
const enableNextButton = () => {
  nextBtn.removeAttribute('disabled');
};


const showQuestion = () => {
  //const questionLength = questions.length;
  const availableQuestionsLength = availableQuestions.length;
  //console.log(questionCounter);

  if (availableQuestionsLength === 0 || questionCounter >= availableQuestionsLength) {
    endGame(availableQuestionsLength);
    return;
  }

  choiceContainer.innerText = '';
  
  //const questionIndex = Math.floor(Math.random() * availableQuestionsLength);
  currentQuestion = availableQuestions[questionCounter];
  question.innerText = currentQuestion.question;
  
  for (let i = 0; i < currentQuestion.choiceText.length; i++) {  
    createChoiceElement(currentQuestion.choiceText[i]);
  };
  //availableQuestions.splice(questionIndex, 1); gerek kalmadi. Artik sorulari questionCounter uzerinden donuyoruz
};

const nextQuestion = () =>{
  if (previousCounter > 0){
    previousCounter--;
  } 
  if (previousCounter ==0){
    disableNextButton();
  };
  
  questionCounter++;
  showQuestion();
};

const prevQuestion = () => {
  if (previousCounter >= 0){
    enableNextButton();
  }
  
  previousCounter++;
  
  if (questionCounter > 0) {
    const selectedChoice = currentQuestion.choiceText.find(choice => choice.selected);
    console.log(currentQuestion.choiceText)
    questionCounter--;
    
    // Mevcut seçimi saklamak için selected değişkenini kullanalım
    
    showQuestion();
    
    // Saklanmış seçimi geri yükle
    if (selectedChoice) {
      const choices = document.querySelectorAll('.choice-container');
      choices.forEach(choice => {
        if (choice.innerText === selectedChoice) {
          choice.classList.add('selected');
          choice.setAttribute('data-selected', true);
        }
      });
    }
  }
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

//Buradan her soru icin dogru yanlis kontrol edip cerceve ekleyecegim. showQuestion icin de index ve prev buton eklemem gerekli
// const selectedHandler = () =>{
//   const selected = document.querySelector('.selected');
//   prevQuestions.push(currentQuestion);
//   prevAnswer.push(selected);
//   //prevQuestions.push(currentQuestion);
//   console.log(prevQuestions);
//   if (selected.innerText == currentQuestion.choiceText[currentQuestion.answer]) {
//     score++;
//   }
//   showQuestion();
  
// };



// const getPrevQuestionWithAnswer = () => {
  
//   questionCounter--;
//   const prevQues = prevQuestions[questionCounter-1];
//   const prevAns =prevAnswer[questionCounter-1];
//   //const prevAnswers = prevAnswer[questionCounter]
//   //const targetChild = prevQues.answer;
//   //console.log(targetChild);
//   question.innerText = prevQues.question;
//   choiceContainer.innerText = '';
  
//   //questionCounter++;
  
//   for (let i = 0; i < prevQues.choiceText.length; i++) {
//     const choiceText = prevQues.choiceText[i];
//     createChoiceElement(choiceText);
//     if (choiceText == prevAns){
//       choiceText.classList.add('selected');
//     }
    
//   };
  
//   //targetChild.classList.add('selected');
//   //console.log(prevAnswers)
//   // console.log(prevQues.question);
//   // console.log(prevQues.choiceText);
//   // console.log(prevQues.answer)

// };
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);
prevBtn.addEventListener('click', prevQuestion);

initGame();
