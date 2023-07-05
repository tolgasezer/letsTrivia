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
let selections = [];

console.log(selections) // selections her prev tiklamasinda ters
// index uzerinden ilerlemeli ++
// geri butonu olmali ++
// cevap verildikten sonra dogru cevap yesil, yanlis cevaplar kirmizi, kullanicinin cevabina border --
// cevap verilen soru tekrar gorulebilir ama cevap degistirilemez --

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

//burada check edip background vererek ilerleyecegim unutma
const checkAnswer = () => {
  if(choiceContainer.contains('.selected')){
  if(choice.innerText === currentQuestion.choiceText[currentQuestion.answer]){
    choice.classList.add('bg-success');
  }else{
    choice.classList.add('bg-danger');
  }
}
};
const selectChoice = (choiceElement) =>{
  const allChoices = document.querySelectorAll('.choice-container');
  allChoices.forEach((choice)=>{
    choice.setAttribute('disabled', '');
  })
  if(!selections[questionCounter]){
  const allChoices = document.querySelectorAll('.choice-container');
    allChoices.forEach((choice) => {
      choice.classList.remove('selected');
    });
    choiceElement.classList.add('selected');
    enableNextButton();
  };
    
};

const disableNextButton = () => {
  nextBtn.setAttribute('disabled', '');
};

const enableNextButton = () => {
  nextBtn.removeAttribute('disabled');
};


const showQuestion = () => {
  const availableQuestionsLength = availableQuestions.length;
  

  if (questionCounter >= availableQuestionsLength) {
    endGame(availableQuestionsLength);
    return;
  }

  choiceContainer.innerText = '';
  currentQuestion = availableQuestions[questionCounter];
  question.innerText = currentQuestion.question;
  
  for (let i = 0; i < currentQuestion.choiceText.length; i++) {  
    createChoiceElement(currentQuestion.choiceText[i]);
  };
  
};
// son tiklamada next button disabled olmuyor
const nextQuestion = () =>{
  prevBtn.classList.remove('hidden');


  if (previousCounter > 0){
    previousCounter--;

  } 
  if (previousCounter === 0 && selections.length === questionCounter){ // ileri geri icin tekrar eklemeleri buradan engelledim.
    disableNextButton();
    const selected = document.querySelector('.selected');
    selections.push(selected.innerText);
  };
  if(selections[questionCounter]===currentQuestion.choiceText[currentQuestion.answer]){
    console.log('bildin')
    score++;
  }else{
    console.log('yanlis')
  }
  //console.log(selections);
  //console.log(currentQuestion.choiceText[currentQuestion.answer]);
  questionCounter++;
  showQuestion();
  restorePreviousSelection();
};

const prevQuestion = () => {
    
  if (questionCounter > 0) {
    
    questionCounter--;
    enableNextButton();
    
    //const selectedChoice = revSelections[previousCounter];
    //console.log(currentQuestion.choiceText)
    showQuestion();
    
    
    // Saklanmış seçimi geri yükle
    restorePreviousSelection();
    
  }
  if(questionCounter === 0) {
    prevBtn.classList.add('hidden');
  }
  console.log(selections);
  previousCounter++;
};

const restorePreviousSelection = () => {

  const selectedChoice = selections[questionCounter];
  const choices = document.querySelectorAll('.choice-container');
  choices.forEach(choice => {
    choice.classList.remove('selected');
    if (choice.innerText === selectedChoice) {
      choice.classList.add('selected');
      
    }
  });
};

const endGame = (questionLength) => {
  nextBtn.classList.add('hidden');
  restartBtn.classList.remove('hidden');
  prevBtn.classList.add('hidden');
  question.innerText = `Your Score is: ${score * CORRECT_BONUS}/${questionLength * CORRECT_BONUS}`;
  choiceContainer.style.display = 'none';
  return;
};

const restartQuiz = () => {
  window.location.assign('./index.html');

  startGame();
};

nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);
prevBtn.addEventListener('click', prevQuestion);

initGame();

