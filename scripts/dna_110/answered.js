var YEAR = window.DNA_YEAR;

function convertQuestionNumber(questionNumber) {
    const questionsPerTopic = 10;

    if (questionNumber < 1 || questionNumber > 110) {
        return { topic: '?', question: '?' };
    }

    const topic = Math.ceil(questionNumber / questionsPerTopic);
    const question = questionNumber % questionsPerTopic === 0
        ? questionsPerTopic
        : questionNumber % questionsPerTopic;

    return { topic, question };
}

function getID() {
    return parseInt(localStorage.getItem(`dna${YEAR}ChallengeID`));
}

function getPoints() {
    return parseInt(localStorage.getItem(`dna${YEAR}Points`));
}

function enviar(val, des) {
    if (val === 'loadQuestion') {
        document.dispatchEvent(new Event('loadChallenge'));
        return;
    } else if (val === 'skipQuestion') {
        document.dispatchEvent(new Event('skipQuestion'));
        return;
    }
}

fetch(`${getDirectory()}/DNA.json`)
    .then(r => r.json())
    .then(data => {
        let ID = getID();
        let converted = convertQuestionNumber(ID);

        document.getElementById('etapadesafio').innerHTML = `<b>Etapa: ${data.etapa}</b>`;
        document.getElementById('etapaatual').innerText = `${converted.topic}/11`;
        document.getElementById('desafioatual').innerText = `${converted.question}/10`;
        document.getElementById('pontosepos').innerHTML = `<b>Pontos: ${getPoints()} | Posição: 1°</b>`;
    });