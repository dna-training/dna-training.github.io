function convertQuestionNumber(questionNumber) {
    const questionsPerTopic = 10;
    
    if (questionNumber < 1 || questionNumber > 110) {
        return {topic: "?", question: "?"};
    }
    
    const topic = Math.ceil(questionNumber / questionsPerTopic);
    const question = questionNumber % questionsPerTopic === 0 ? questionsPerTopic : questionNumber % questionsPerTopic;
    
    return { topic, question };
}

function getID() {
    return parseInt(localStorage.getItem('dna2024ChallengeID'));
}

function getPoints() {
    return parseInt(localStorage.getItem('dna2024Points'));
}

function enviar(val,des){
    if(val == "loadQuestion") {
        const questionEvent = new Event('loadChallenge');
        document.dispatchEvent(questionEvent);
        return;
    } else if(val == "skipQuestion") {
        const questionEvent = new Event('skipQuestion');
        document.dispatchEvent(questionEvent);
        return;
    }
}

fetch(`${getDirectory()}/DNA.json`)
    .then(r => r.json())
    .then(data => {
        let ID = getID();
        let converted = convertQuestionNumber(ID);

        document.getElementById("etapadesafio").innerHTML = `<b>Etapa: ${data.etapa}</b>`
        document.getElementById("etapaatual").innerText = `${converted.topic}/11`
        document.getElementById("desafioatual").innerText = `${converted.question}/10`
        document.getElementById("pontosepos").innerHTML = `<b>Pontos: ${getPoints()} | Posição: 1°</b>`
});