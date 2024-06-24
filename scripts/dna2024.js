document.addEventListener('DOMContentLoaded', function() {
    const content = document.getElementById('content');
    let dna2024ChallengeID = localStorage.getItem('dna2024ChallengeID') ? parseInt(localStorage.getItem('dna2024ChallengeID')) : 1;
    let points = localStorage.getItem('dna2024Points') ? parseInt(localStorage.getItem('dna2024Points')) : 0;
    if (points === 0) {
        localStorage.setItem('dna2024Points', 0)
    }
    localStorage.setItem('dna2024ChallengeID', dna2024ChallengeID);

    function runTemplateScript(template) {
        const types = ["image", "noimage"]

        types.forEach(x => {
            const existingScript = document.querySelector(`script[src="/scripts/dna2024/${x}.js"]`);

            if(existingScript !== null) {
                existingScript.parentNode.removeChild(existingScript)
            };
        })

        if(types.includes(template)) {
            const script = document.createElement('script');
            script.src = `/scripts/dna2024/${template}.js`;
            document.body.appendChild(script);
        }
        
    }

    function loadTemplate(template) {
        fetch(`templates/dna2024/${template}.html`)
            .then(response => response.text())
            .then(data => {
                content.innerHTML = data;
                runTemplateScript(template);
            });
    }

    function loadChallenge() {
        dna2024ChallengeID = parseInt(localStorage.getItem('dna2024ChallengeID'));
        fetch(`challenges/dna2024/${dna2024ChallengeID}/DNA.json`)
            .then(response => response.json())
            .then(data => {
                if (data.imagem !== false) {
                    loadTemplate('image');
                } else {
                    loadTemplate('noimage');
                }
            })
            .catch(() => {
                localStorage.setItem('dna2024ChallengeID', 1);
                localStorage.setItem('dna2024Points', 0)
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
        const set = prompt("Você gostaria de pular para outro desafio? Se sim, insira o número do desafio abaixo (ex. '27'). Você perderá todos seus pontos ao pular.")
        try {
            const ID = parseInt(set);
            if (1 <= ID) {
                localStorage.setItem('dna2024ChallengeID', ID);
                localStorage.setItem('dna2024Points', 0)
                loadChallenge()
            }
        } catch (e) {
            return;
        }
    }

    handleRouting();

    document.addEventListener('wrongAnswer', function() {
        loadTemplate('wrong');
    })

    document.addEventListener('rightAnswer', function() {
        loadTemplate('correct');
    })

    document.addEventListener('loadChallenge', loadChallenge);
    document.addEventListener('setChallenge', setChallenge);
    document.addEventListener('skipQuestion', function() {
        localStorage.setItem('dna2024ChallengeID', parseInt(localStorage.getItem('dna2024ChallengeID')) + 1)
        localStorage.setItem('dna2024Points', parseInt(localStorage.getItem('dna2024Points')) - 100)
        loadChallenge();
    })
    document.addEventListener('resetChallenge', function() {
        const confirmation = confirm("Tem certeza que quer voltar ao primeiro desafio?")
        if (confirmation) {
            localStorage.setItem('dna2024ChallengeID', 1);
            loadChallenge()
        }
    });
});