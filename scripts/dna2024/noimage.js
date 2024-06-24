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

function getDirectory() {
    return `/challenges/dna2024/${getID()}`
}

function resposta() {
    fetch(`${getDirectory()}/DNA.json`)
    .then(r => r.json())
    .then(data => {
        alert(`Resposta: ${data.resposta}`);
    })
}

function enviar(val,des){
    if(val == "loadQuestion") {
        const questionEvent = new Event('loadChallenge');
        document.dispatchEvent(questionEvent);
        return;
    } else if(val == "setQuestion") {
        const questionEvent = new Event('setChallenge');
        document.dispatchEvent(questionEvent);
        return;
    } else if(val == "resetQuestion") {
        const questionEvent = new Event('resetChallenge');
        document.dispatchEvent(questionEvent);
        return;
    } else if(val == "skipQuestion") {
        const questionEvent = new Event('skipQuestion');
        document.dispatchEvent(questionEvent);
        return;
    }

    fetch(`${getDirectory()}/DNA.json`)
    .then(r => r.json())
    .then(data => {
        if(document.frmJogo.txtResposta.value.toLowerCase() == data.resposta.toLowerCase()) {
            localStorage.setItem('dna2024ChallengeID', getID() + 1);
            localStorage.setItem('dna2024Points', parseInt(localStorage.getItem('dna2024Points')) + 1000)
            const answerEvent = new Event('rightAnswer');
            document.dispatchEvent(answerEvent);
        } else {
            const answerEvent = new Event('wrongAnswer');
            document.dispatchEvent(answerEvent);
        }
    });
}

function do_enter(event){
    if (event.keyCode == 13) {
       event.preventDefault();
       event.keyCode = 0;
       enviar('4','0');
    }
}

function ContaCaracteres(campo){
    //usado para campos textarea onde não se tem o atributo maxlenght
        var campo = document.getElementById(campo);
       var area = document.all("skin_tam_resposta2");
       area.innerHTML = "Digitado(s): <b>" + campo.value.length + "</b>";
}

document.frmJogo.txtResposta.focus()

fetch(`${getDirectory()}/DNA.json`)
    .then(r => r.json())
    .then(data => {
        let ID = getID();
        let converted = convertQuestionNumber(ID);

        let answer = data.resposta.toLowerCase();
        document.getElementById('resposta').setAttribute('maxlength', answer.length)
        document.getElementById("etapadesafio").innerText = `Etapa: ${data.etapa}`
        document.getElementById("skin_tam_resposta").innerText = `${answer.length} caracteres`
        document.getElementById("etapaatual").innerText = `${converted.topic}/11`
        document.getElementById("desafioatual").innerText = `${converted.question}/10`
        document.getElementById("pontosepos").innerHTML = `<b>Pontos: ${getPoints()} | Posição: 1°</b>`

        const div = document.createElement('div');
        div.id = 'skin_tam_resposta2';
        div.classList.add('arialAzul12');
        div.innerHTML = 'Digitado(s): <b>0</b>';

        document.querySelector('[id=skin_tam_resposta]').appendChild(div);


        let enunciado = data.enunciado;
        if (enunciado.includes("______")) {
            const split = enunciado.split("______");
            enunciado = split[0] + `${getDirectory()}/${data.extra}` + split[1]
        }
        const span = document.createElement('span');
        span.classList.add('arialCinza12');
        span.innerHTML = enunciado + "<p>Este desafio vale <b>1000</b> pontos.</p>";

        document.querySelector('[id=enunciado_questao]').appendChild(span);
});