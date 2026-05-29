const DNA_YEAR = document.currentScript.getAttribute('data-year');
window.DNA_YEAR = DNA_YEAR;

document.addEventListener('DOMContentLoaded', function() {
    const content = document.getElementById('content');
    let challengeID = localStorage.getItem(`dna${DNA_YEAR}ChallengeID`)
        ? parseInt(localStorage.getItem(`dna${DNA_YEAR}ChallengeID`))
        : 1;
    let points = localStorage.getItem(`dna${DNA_YEAR}Points`)
        ? parseInt(localStorage.getItem(`dna${DNA_YEAR}Points`))
        : 0;
    if (points === 0) {
        localStorage.setItem(`dna${DNA_YEAR}Points`, 0);
    }
    localStorage.setItem(`dna${DNA_YEAR}ChallengeID`, challengeID);

    function runTemplateScript(template) {
        const types = ['image', 'noimage', 'answered'];

        types.forEach(x => {
            const existingScript = document.querySelector(`script[src="/scripts/dna_110/${x}.js"]`);
            if (existingScript !== null) {
                existingScript.parentNode.removeChild(existingScript);
            }
        });

        if (types.includes(template)) {
            const script = document.createElement('script');
            script.src = `/scripts/dna_110/${template}.js`;
            document.body.appendChild(script);
        } else if (template === 'wrong' || template === 'correct') {
            const script = document.createElement('script');
            script.src = `/scripts/dna_110/answered.js`;
            document.body.appendChild(script);
        }
    }

    function loadTemplate(template) {
        fetch(`templates/dna_110/${template}.html`)
            .then(response => response.text())
            .then(data => {
                content.innerHTML = data;
                runTemplateScript(template);
            });
    }

    function loadChallenge() {
        challengeID = parseInt(localStorage.getItem(`dna${DNA_YEAR}ChallengeID`));
        fetch(`challenges/dna${DNA_YEAR}/${challengeID}/DNA.json`)
            .then(response => response.json())
            .then(data => {
                if (data.imagem !== false) {
                    loadTemplate('image');
                } else {
                    loadTemplate('noimage');
                }
            })
            .catch(() => {
                const finalPoints = points;
                localStorage.setItem(`dna${DNA_YEAR}ChallengeID`, 1);
                localStorage.setItem(`dna${DNA_YEAR}Points`, 0);
                content.innerHTML = `
                    <div style="
                        height:100vh; overflow:hidden; position:fixed; top:0; left:0; width:100%;
                        background:url('/static/images/body_game.jpg') center center/cover fixed;
                        display:flex; align-items:center; justify-content:center;
                        font-family:Arial,sans-serif;
                    ">
                        <div style="
                            background:rgba(255,255,255,0.96);
                            border:2px solid #b0b0b0;
                            border-radius:6px;
                            box-shadow:0 4px 24px rgba(0,0,0,0.35);
                            width:380px;
                            padding:36px 40px 32px;
                            text-align:center;
                        ">
                            <div style="font-size:52px; margin-bottom:12px;">🏆</div>
                            <h1 style="font-size:22px; color:#003399; letter-spacing:1px; text-transform:uppercase; margin:0 0 8px;">Competição Concluída!</h1>
                            <p style="font-size:14px; color:#555; margin:0 0 4px;">Você completou todos os 110 desafios do <strong>DNA ${DNA_YEAR}</strong>!</p>
                            <div style="
                                background:#f0f4ff; border:1px solid #c0ccee; border-radius:4px;
                                padding:14px 0; margin:18px 0 22px;
                            ">
                                <p style="font-size:12px; color:#888; margin:0 0 4px; text-transform:uppercase; letter-spacing:0.5px;">Pontuação Final</p>
                                <p style="font-size:30px; font-weight:bold; color:#003399; margin:0;">${finalPoints.toLocaleString('pt-BR')}</p>
                                <p style="font-size:11px; color:#aaa; margin:4px 0 0;">pontos</p>
                            </div>
                            <hr style="border:none; border-top:1px solid #ddd; margin-bottom:22px;">
                            <div style="display:flex; flex-direction:column; gap:12px;">
                                <button onclick="document.dispatchEvent(new Event('loadChallenge'))" style="
                                    padding:12px 20px; border-radius:3px; border:1px solid #155e15;
                                    background:#1a7a1a; color:#fff; font-size:14px; font-weight:bold;
                                    cursor:pointer; letter-spacing:0.5px;
                                ">Jogar novamente (DNA ${DNA_YEAR})</button>
                                <a href="/" style="
                                    display:block; padding:12px 20px; border-radius:3px;
                                    background:#555; color:#fff; font-size:14px; font-weight:bold;
                                    text-decoration:none; letter-spacing:0.5px;
                                ">← Voltar ao Início</a>
                            </div>
                        </div>
                    </div>`;
            });
    }

    function handleRouting() {
        const path = window.location.pathname.split('/').filter(segment => segment);
        if (path.length === 1) {
            loadChallenge();
        }
    }

    function setChallenge() {
        const set = prompt("Você gostaria de pular para outro desafio? Se sim, insira o número do desafio abaixo (ex. '27'). Você perderá todos seus pontos ao pular.");
        try {
            const ID = parseInt(set);
            if (1 <= ID) {
                localStorage.setItem(`dna${DNA_YEAR}ChallengeID`, ID);
                localStorage.setItem(`dna${DNA_YEAR}Points`, 0);
                loadChallenge();
            }
        } catch (e) {
            return;
        }
    }

    handleRouting();

    document.addEventListener('wrongAnswer', function() {
        loadTemplate('wrong');
    });

    document.addEventListener('rightAnswer', function() {
        loadTemplate('correct');
    });

    document.addEventListener('loadChallenge', loadChallenge);
    document.addEventListener('setChallenge', setChallenge);

    document.addEventListener('skipQuestion', function() {
        localStorage.setItem(`dna${DNA_YEAR}ChallengeID`, parseInt(localStorage.getItem(`dna${DNA_YEAR}ChallengeID`)) + 1);
        localStorage.setItem(`dna${DNA_YEAR}Points`, parseInt(localStorage.getItem(`dna${DNA_YEAR}Points`)) - 100);
        loadChallenge();
    });

    document.addEventListener('resetChallenge', function() {
        const confirmation = confirm("Tem certeza que quer voltar ao primeiro desafio?");
        if (confirmation) {
            localStorage.setItem(`dna${DNA_YEAR}ChallengeID`, 1);
            loadChallenge();
        }
    });
});