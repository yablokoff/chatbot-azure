var builder = require('botbuilder');
var http = require('request');
var restify = require('restify');

//=========================================================
// Data
//=========================================================

function getRandom(arr){
    var rand = Math.random();
    rand *= arr.length;
    rand = Math.floor(rand);
    return arr[rand]
}

jokes = [
    "Если Украину примут в 20-ку, будет очко!",
    "Новейшая украинская история: Америку открыл украинец Колумбенко.",
    "В Киеве у стен Рады: \n — Нам говорили, что придёт Путин и всем нам будет песец! \nИ вот, песец пришёл, а где же Путин?!"
]

quizes = [
    {"question": "Олег, где макет?", "answer": "Игорь"}
]

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

var request = require('request');

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session, args, next) {
        builder.Prompts.text(session, 'Привет, я Милонов. У меня есть борода. Что есть у тебя?');
    },
    function (session, results) {
        session.send('У тебя есть %s! Надеюсь, ты не гей!', results.response);
        session.beginDialog('/chatbot');
    }
]);

bot.dialog('/chatbot', [
    function (session) {
        builder.Prompts.choice(session, 'Что тебя интересует?', "Загадочка|Шуточка|Мудрость");
    },
    function (session, results, next) {
         if (results.response.entity == "Шуточка") {
             joke = getRandom(jokes);
             session.send('%s азазаазаз', joke);
             session.beginDialog('/chatbot');
         }
         else if (results.response.entity == "Загадочка") {
             session.beginDialog("/quiz");
         }
    }

]);

bot.dialog('/quiz', [
    function (session) {
        quiz = getRandom(quizes);
        session.dialogData.quiz = quiz;
        builder.Prompts.text(session, session.dialogData.quiz.question);
    },
    function (session, results, next) {
        if (results.response == session.dialogData.quiz.answer) {
            session.send('Вах красавец!');
            session.beginDialog('/chatbot');
        }
        else {
            session.send('Ах ты содомит! Последняя попытка!');
            session.beginDialog('/quiz');
        }
    }
]);
