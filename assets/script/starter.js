function processForm(event) {
    event.preventDefault();

    const numberOfQuestions = document.getElementById('numberOfQuestions').value;
    const difficulty = document.querySelector('input[name="choose-difficulty"]:checked').value;

    sessionStorage.setItem('numberOfQuestions', numberOfQuestions);
    sessionStorage.setItem('difficulty', difficulty);

    window.location.href ='game.html';
}