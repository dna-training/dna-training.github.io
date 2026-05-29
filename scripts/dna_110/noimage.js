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

function getDirectory() {
    return `/challenges/dna${YEAR}/${getID()}`;
}

function resposta() {
    fetch(`${getDirectory()}/DNA.json`)
        .then(r => r.json())
        .then(data => {
            alert(`Resposta: ${data.resposta}`);
        });
}

function enviar(val, des) {
    if (val === 'loadQuestion') {
        document.dispatchEvent(new Event('loadChallenge'));
        return;
    } else if (val === 'setQuestion') {
        document.dispatchEvent(new Event('setChallenge'));
        return;
    } else if (val === 'resetQuestion') {
        document.dispatchEvent(new Event('resetChallenge'));
        return;
    } else if (val === 'skipQuestion') {
        document.dispatchEvent(new Event('skipQuestion'));
        return;
    }

    fetch(`${getDirectory()}/DNA.json`)
        .then(r => r.json())
        .then(data => {
            if (document.frmJogo.txtResposta.value.toLowerCase() === data.resposta.toLowerCase()) {
                localStorage.setItem(`dna${YEAR}ChallengeID`, getID() + 1);
                localStorage.setItem(`dna${YEAR}Points`, parseInt(localStorage.getItem(`dna${YEAR}Points`)) + 1000);
                document.dispatchEvent(new Event('rightAnswer'));
            } else {
                document.dispatchEvent(new Event('wrongAnswer'));
            }
        });
}

function do_enter(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        event.keyCode = 0;
        enviar('4', '0');
    }
}

function ContaCaracteres(campo) {
    // usado para campos textarea onde não se tem o atributo maxlenght
    var campo = document.getElementById(campo);
    var area = document.all('skin_tam_resposta2');
    area.innerHTML = 'Digitado(s): <b>' + campo.value.length + '</b>';
}

document.frmJogo.txtResposta.focus();

fetch(`${getDirectory()}/DNA.json`)
    .then(r => r.json())
    .then(data => {
        let ID = getID();
        let converted = convertQuestionNumber(ID);

        let answer = data.resposta.toLowerCase();
        document.getElementById('resposta').setAttribute('maxlength', answer.length);
        document.getElementById('etapadesafio').innerHTML = `<b>Etapa: ${data.etapa}</b>`;
        document.getElementById('skin_tam_resposta').innerText = `${answer.length} caracteres`;
        document.getElementById('etapaatual').innerText = `${converted.topic}/11`;
        document.getElementById('desafioatual').innerText = `${converted.question}/10`;
        document.getElementById('pontosepos').innerHTML = `<b>Pontos: ${getPoints()} | Posição: 1°</b>`;

        const div = document.createElement('div');
        div.id = 'skin_tam_resposta2';
        div.classList.add('arialAzul12');
        div.innerHTML = 'Digitado(s): <b>0</b>';
        document.querySelector('[id=skin_tam_resposta]').appendChild(div);

        let enunciado = data.enunciado;
        enunciado = enunciado.replaceAll('{$CD}', getDirectory());
        const span = document.createElement('span');
        span.classList.add('arialCinza12');
        span.innerHTML = enunciado + '<p>Este desafio vale <b>1000</b> pontos.</p>';
        document.querySelector('[id=enunciado_questao]').appendChild(span);
    });