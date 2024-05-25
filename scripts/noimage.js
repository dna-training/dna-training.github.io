function getID() {
    return parseInt(localStorage.getItem('currentChallengeIndex'));
}

function getDirectory() {
    return `/challenges/${getID()}`
}

function resposta() {
    fetch(`${getDirectory()}/Resposta.txt`)
    .then(r => r.text())
    .then(data => {
        alert(data);
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
    }

    fetch(`${getDirectory()}/DNA.json`)
    .then(r => r.json())
    .then(data => {
        if(document.frmJogo.txtResposta.value.toLowerCase() == data.resposta.toLowerCase()) {
            localStorage.setItem('currentChallengeIndex', getID() + 1);
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
        let answer = data.resposta.toLowerCase();
        document.getElementById('resposta').setAttribute('maxlength', answer.length)
        document.getElementById("etapadesafio").innerText = `Etapa: ${data.etapa}`
        document.getElementById("skin_tam_resposta").innerText = `${answer.length} caracteres`
        document.getElementById("status02").querySelector(".arialAzul12").innerText = `Desafio ${getID()}`

        const div = document.createElement('div');
        div.id = 'skin_tam_resposta2';
        div.classList.add('arialAzul12');
        div.innerHTML = 'Digitado(s): <b>0</b>';

        document.querySelector('[id=skin_tam_resposta]').appendChild(div);


        let enunciado = data.enunciado;
        if (enunciado.includes("______")) {
            const split = enunciado.split("______");
            enunciado = split[0] + `/challenges/${getID()}/${data.extra}` + split[1]
        }
        const span = document.createElement('span');
        span.classList.add('arialCinza12');
        span.innerHTML = `
            <div style="text-align:center">
                <strong>
                    <font color="#FF0000">Esse desafio é somente para treino!<br></font>
                </strong>
            </div>
            ${enunciado}
        `;

        document.querySelector('[id=enunciado_questao]').appendChild(span);
});