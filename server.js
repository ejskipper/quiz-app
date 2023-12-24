const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

const path = require("path");

let secretWord = "";
let startTime;
let scores = {};
let answeredWords = {};
let logs = [];
let questionNumber = 1;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/reset", (req, res) => {
  let secretWord = "";
  let startTime;
  let scores = {};
  let answeredWords = {};
  let logs = [];
  let questionNumber = 1;
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/setSecret", (req, res) => {
  secretWord = req.body.secretWord;
  startTime = new Date();
  res.send("Secret word set successfully!");
  questionNumber += 1;
});

app.get("/log", (req, res) => {
  res.send(logs);
});

app.post("/makeGuess", (req, res) => {
  const guess = req.body.guess;
  const playerName = req.body.playerName;

  logs = logs.concat({
    playerName: playerName,
    guess: guess,
    elapsedTime: Math.round((new Date() - startTime) / 1000),
  });

  if (answeredWords[playerName]?.includes(secretWord)) {
    res.send("You've already guessed this word. Please wait for the next one!");
  } else if (cleanAndCompareStrings(guess, secretWord)) {
    handleCorrectGuess(res, playerName);
  } else {
    res.send("Incorrect guess. Try again!");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function cleanAndCompareStrings(str1, str2) {
  // Remove spaces and convert to lowercase
  const cleanStr1 = str1.replace(/\s/g, "").toLowerCase();
  const cleanStr2 = str2.replace(/\s/g, "").toLowerCase();

  // Remove punctuation using a regular expression
  const removePunctuation = (inputString) =>
    inputString.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

  // Remove punctuation from both strings
  const finalStr1 = removePunctuation(cleanStr1);
  const finalStr2 = removePunctuation(cleanStr2);

  // Compare the cleaned and punctuation-removed strings
  return finalStr1 === finalStr2;
}

function handleCorrectGuess(res, playerName) {
  const elapsedTime = Math.round((new Date() - startTime) / 1000);
  const score = 100 - elapsedTime;
  scores[playerName] ||= 0;
  scores[playerName] = scores[playerName] + score;

  answeredWords[playerName] ||= [];
  answeredWords[playerName] = answeredWords[playerName] + secretWord;

  let message = `${playerName}, you're correct! &#127881; Your score for this round is ${score}; your total score is now ${scores[playerName]}`;

  const isLastPlayer = !Object.values(answeredWords).some(
    (words) => !words.includes(secretWord)
  );

  if (isLastPlayer) {
    message += ". YOU ARE THE LAST PLAYER, MOVE ON!";
  }

  res.send(message);
}
