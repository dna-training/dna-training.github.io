document.addEventListener('DOMContentLoaded', function() {
    const content = document.getElementById('content');
    let dailyChallengeID = localStorage.getItem('dailyChallengeID') ? parseInt(localStorage.getItem('dailyChallengeID')) : 1;
    localStorage.setItem('dailyChallengeID', dailyChallengeID);

    function runTemplateScript(template) {
        const types = ["image", "noimage"]

        types.forEach(x => {
            const existingScript = document.querySelector(`script[src="/scripts/daily/${x}.js"]`);

            if(existingScript !== null) {
                existingScript.parentNode.removeChild(existingScript)
            };
        })

        if(types.includes(template)) {
            const script = document.createElement('script');
            script.src = `/scripts/daily/${template}.js`;
            document.body.appendChild(script);
        }
        
    }

    function loadTemplate(template) {
        fetch(`templates/daily/${template}.html`)
            .then(response => response.text())
            .then(data => {
                content.innerHTML = data;
                runTemplateScript(template);
            });
    }

    function loadChallenge() {
        dailyChallengeID = parseInt(localStorage.getItem('dailyChallengeID'));
        fetch(`challenges/daily/${dailyChallengeID}/DNA.json`)
            .then(response => response.json())
            .then(data => {
                if (data.image !== false) {
                    loadTemplate('image');
                } else {
                    loadTemplate('noimage');
                }
            })
            .catch(() => {
                const lastID = dailyChallengeID - 1;
                localStorage.setItem('dailyChallengeID', 1);
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
                            width:360px;
                            padding:36px 40px 32px;
                            text-align:center;
                        ">
                            <div style="font-size:52px; margin-bottom:12px;">🏆</div>
                            <h1 style="font-size:22px; color:#003399; letter-spacing:1px; text-transform:uppercase; margin:0 0 8px;">Parabéns!</h1>
                            <p style="font-size:14px; color:#555; margin:0 0 6px;">Você completou todos os <strong>${lastID}</strong> desafios diários!</p>
                            <p style="font-size:12px; color:#888; margin:0 0 28px;">O banco de desafios será reiniciado do começo.</p>
                            <hr style="border:none; border-top:1px solid #ddd; margin-bottom:24px;">
                            <div style="display:flex; flex-direction:column; gap:12px;">
                                <button onclick="document.dispatchEvent(new Event('loadChallenge'))" style="
                                    padding:12px 20px; border-radius:3px; border:1px solid #0044aa;
                                    background:#0055cc; color:#fff; font-size:14px; font-weight:bold;
                                    cursor:pointer; letter-spacing:0.5px;
                                ">Recomeçar do desafio #1</button>
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
        const set = prompt("Você gostaria de pular para outro desafio? Se sim, insira o número do desafio abaixo:")
        try {
            const ID = parseInt(set);
            if (1 <= ID) {
                localStorage.setItem('dailyChallengeID', ID);
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
    document.addEventListener('resetChallenge', function() {
        const confirmation = confirm("Tem certeza que quer voltar ao primeiro desafio?")
        if (confirmation) {
            localStorage.setItem('dailyChallengeID', 1);
            loadChallenge()
        }
    });
});