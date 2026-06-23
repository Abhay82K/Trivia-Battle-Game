let showScreen1st = document.getElementById("screen-1st");
let showScreen2nd = document.getElementById("screen-2nd");
let showScreen3rd = document.getElementById("screen-3rd");
let showScreen4th = document.getElementById("screen-4th");
let showScreen5th = document.getElementById("screen-5th");
let ShowPlayer1st = document.getElementById("player-name-1st");
let ShowPlayer2nd = document.getElementById("player-name-2nd");
let startBtn = document.getElementById("start-btn");
let showError = document.getElementById("show-err-msg");

function takeInputFromUser() {
    let player1st = ShowPlayer1st.value.trim();
    let player2nd = ShowPlayer2nd.value.trim();

    if (player1st === "" || player2nd === ""){
        showError.innerText = "Input Field Empty";
        return;
    } else if(player1st === player2nd) {
        showError.innerText = "Please Enter Unique Name";
        return;
    }

    showError.innerText = "";
    showScreen1st.style.display = "none";
    showScreen2nd.style.display = "block";
}

startBtn.addEventListener("click", function() {
    takeInputFromUser();
});


let showRoundNo = document.getElementById("round-num");
let sltCategory = document.getElementById("slt-category");
let sltCategoryOpt = document.getElementById("slt-category").options;
let startRound = document.getElementById("start-Round-Btn");
let showErrMsg = document.getElementById("err-msg");
let roundNum = 1;
let questionsArr = [];

showRoundNo.innerText = `Round Number: ${roundNum}`;

async function selectCategory() {
    let sltCategoryValue = sltCategory.value;

    if (sltCategory.value === "") {
        showErrMsg.innerText = "Please select One category before starting";
        startRound.disabled = false;
        return;
    }

    showErrMsg.innerText = "";
    let difficulty = "";

    try {
        for(let i=0; i < 3; i++) {
            if(i === 0) {
                difficulty = "easy";
            } else if(i === 1){
                difficulty = "medium";
            } else {
                difficulty = "hard";
            }
            const response = await fetch(`https://the-trivia-api.com/v2/questions?categories=${sltCategoryValue}&limit=2&difficulties=${difficulty}`)
            const data = await response.json();
            questionsArr.push(...data);
        }
        

        for(let i = sltCategoryOpt.length - 1; i > 0; i--) {
            if(sltCategoryOpt[i].value === sltCategoryValue) {
                sltCategoryOpt[i].remove();
            }
        }

        showScreen2nd.style.display = "none";
        showScreen3rd.style.display = "block";
        showQuestionDetails();

    } catch(error) {
        console.log("Failed to fetch Question");
    }

    startRound.disabled = false;
}

startRound.addEventListener("click", function() { 
    startRound.disabled = true;
    selectCategory();
});


let showRoundNum = document.getElementById("show-round-num");
let showCategory = document.getElementById("show-category");
let showDiff = document.getElementById("show-difficulty");
let showPlayTurn = document.getElementById("show-player-turn");
let showCurrScore = document.getElementById("show-score");
let showQuestion = document.getElementById("show-question");
let showradioBtn = document.querySelectorAll('input[name = "options"]');
let showOption1 = document.querySelector('label[for="option1"]');
let showOption2 = document.querySelector('label[for="option2"]');
let showOption3 = document.querySelector('label[for="option3"]');
let showOption4 = document.querySelector('label[for="option4"]');
let showNxt = document.getElementById("next-btn");
let scorePlayer1st = 0;
let scorePlayer2nd = 0;
let currentIndex = 0;
let correctAnswer = "";
let answered = false;
let optionArr = [];
let labels = [showOption1, showOption2, showOption3, showOption4];


function showQuestionDetails() {
    
    if(currentIndex >= questionsArr.length){ 
        return; 
    }

    answered = false;
    showPlayTurn.innerText = "";
    showNxt.disabled = true;
    showRoundNum.innerText = `Round Number ${roundNum}`;
    showCategory.innerText = `Category: ${questionsArr[currentIndex].category}`;
    showDiff.innerText = `Difficulty: ${questionsArr[currentIndex].difficulty}`;
    showCurrScore.innerText = `${ShowPlayer1st.value}: ${scorePlayer1st} / ${ShowPlayer2nd.value}: ${scorePlayer2nd}`;
    if(currentIndex % 2 === 0) {
        showPlayTurn.innerText = `Whose turn: It's ${ShowPlayer1st.value} turn`;
    } else {
        showPlayTurn.innerText = `Whose turn: It's ${ShowPlayer2nd.value} turn`;
    }

    showQuestion.innerText = `Q${currentIndex+1}. ${questionsArr[currentIndex].question.text}`;
        
    correctAnswer = questionsArr[currentIndex].correctAnswer;

    optionArr = [questionsArr[currentIndex].correctAnswer, ...questionsArr[currentIndex].incorrectAnswers];

    for(let i = optionArr.length-1; i > 0; i--) {
        let random = Math.floor(Math.random() * (i + 1));
        let temp = optionArr[i]
        optionArr[i] = optionArr[random]
        optionArr[random] = temp
    }

    for(let i = 0; i < labels.length; i++) {
        labels[i].innerText = optionArr[i];
    }
        

    for(let j = 0; j < labels.length; j++) {
        labels[j].style.color = "black";
    }
    
    for(let i = 0; i < showradioBtn.length; i++) {
        showradioBtn[i].checked = false;
        showradioBtn[i].disabled = false;
    }

}

for(let i = 0; i < showradioBtn.length; i++ ) {

    showradioBtn[i].addEventListener("click", function() {

        if(answered) {
            return;
        }

        answered = true;
        let selectAnswer = optionArr[i];

        checkAnswer(i, selectAnswer);

        for(let j = 0; j < showradioBtn.length; j++) {
            showradioBtn[j].disabled = true; 
        }
        
        showNxt.disabled = false;
    });
}   
        

function checkAnswer(index, selectAnswer) {

    if(selectAnswer === correctAnswer) {
        labels[index].style.color = "green";

        if(currentIndex % 2 === 0) {
            if(questionsArr[currentIndex].difficulty === "easy") {
                scorePlayer1st += 10;
            } else if(questionsArr[currentIndex].difficulty === "medium") {
                scorePlayer1st += 15;
            } else {
                scorePlayer1st += 20;
            }
            
        } else {
            if(questionsArr[currentIndex].difficulty === "easy") {
                scorePlayer2nd += 10;
            } else if(questionsArr[currentIndex].difficulty === "medium") {
                scorePlayer2nd += 15;
            } else {
                scorePlayer2nd += 20;
            }
        }

    } else {
        labels[index].style.color = "red";

        for(let i = 0; i < labels.length; i++) {
            if(labels[i].innerText === correctAnswer) {
                labels[i].style.color = "green";
            }
        }
    }

    showCurrScore.innerText = `${ShowPlayer1st.value}: ${scorePlayer1st} / ${ShowPlayer2nd.value}: ${scorePlayer2nd}`;
}

showNxt.addEventListener("click", function() {
    currentIndex++;

    if(currentIndex < questionsArr.length) {
        showPlayTurn.innerText = "";
        showQuestionDetails();
    } else {
        showScreen3rd.style.display = "none";
        showScreen4th.style.display = "block";
    }
    
    if(sltCategory.options.length === 1) { 
        showNxtRoundBtn.disabled = true;
    }
});

let showNxtRoundBtn = document.getElementById("nxt-btn");
let showEndGameBtn = document.getElementById("end-game");

showNxtRoundBtn.addEventListener("click", function() {
    roundNum++;
    showRoundNo.innerText = `Round Number: ${roundNum}`;
    currentIndex = 0;
    correctAnswer = "";
    questionsArr = [];
    answered = false;
    sltCategory.value = ""; 
    showScreen4th.style.display = "none";
    showScreen2nd.style.display = "block";
})

showEndGameBtn.addEventListener("click", function() {
    showScreen4th.style.display = "none";
    showScreen5th.style.display = "block";
    showWhoIsWinner();
})

let showfinalScoreP1 = document.getElementById("score-player-1");
let showfinalScoreP2 = document.getElementById("score-player-2");
let showWinner = document.getElementById("winner");

function showWhoIsWinner() {
    showfinalScoreP1.innerText = "";
    showfinalScoreP2.innerText = "";
    showWinner.innerText = "";

    showfinalScoreP1.innerText = `${ShowPlayer1st.value} : ${scorePlayer1st}`;
    showfinalScoreP2.innerText =  `${ShowPlayer2nd.value} : ${scorePlayer2nd}`;

    if(scorePlayer1st === scorePlayer2nd) {
        showWinner.innerText = "Game Draw";
    } else if(scorePlayer1st > scorePlayer2nd) {
        showWinner.innerText = `Congratulations ${ShowPlayer1st.value}! You win the match 🏆🥇🥳🥳`;
    } else {
       showWinner.innerText = `Congratulations ${ShowPlayer2nd.value}! You win the match 🏆🥇🥳🥳`;
    }
}