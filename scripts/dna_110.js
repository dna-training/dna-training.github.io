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
                localStorage.setItem(`dna${DNA_YEAR}ChallengeID`, 1);
                localStorage.setItem(`dna${DNA_YEAR}Points`, 0);
                content.innerHTML = `<h1>Você completou todos os desafios! Atualize a página para voltar ao desafio #1.</h1>`;
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