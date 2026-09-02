// ===== MENU MOBILE =====
const botaoMenu = document.getElementById('botao-menu');
const navLinks = document.getElementById('nav-links');

if (botaoMenu && navLinks) {
    botaoMenu.addEventListener('click', function () {
        navLinks.classList.toggle('aberto');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('aberto');
        });
    });
}

// ===== MARCA O LINK DA PÁGINA ATUAL NO MENU =====
const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(function (link) {
    const destino = link.getAttribute('href');
    if (destino === paginaAtual) {
        link.classList.add('atual');
    }
});

// ===== DETECÇÃO DE MOTION PREFERIDO =====
const preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== FORMULÁRIO — MENSAGEM DE SUCESSO =====
var formSucesso = document.getElementById('form-sucesso');
var formContato = document.querySelector('.form-contato');
if (formSucesso && formContato) {
    var params = new URLSearchParams(window.location.search);
    if (params.get('enviado') === 'true') {
        formContato.style.display = 'none';
        formSucesso.style.display = 'block';
    }
}

// =============================================================
// REVEAL DE SEÇÕES E FILHOS NO SCROLL
// =============================================================
if (!preferReducedMotion) {
    // Marca seções e hero para reveal
    var elementsToReveal = document.querySelectorAll('.secao, .hero');
    elementsToReveal.forEach(function (el) {
        el.classList.add('reveal');
    });

    // Marca grades (filhos) para staggered reveal
    var gridsToReveal = document.querySelectorAll('.grade-destaques, .grade-equipe, .lista-projetos, .lista-servicos, .contato-grade');
    gridsToReveal.forEach(function (el) {
        el.classList.add('reveal');
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visivel');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -10px 0px'
    });

    elementsToReveal.forEach(function (el) {
        observer.observe(el);
    });
    gridsToReveal.forEach(function (el) {
        observer.observe(el);
    });

    // Rodapé com reveal
    var rodape = document.querySelector('.rodape');
    if (rodape) {
        var rodapeObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visivel');
                    rodapeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        rodapeObserver.observe(rodape);
    }
}

// =============================================================
// HEADER ESCURECE NO SCROLL
// =============================================================
var cabecalho = document.querySelector('.cabecalho');
if (cabecalho && !preferReducedMotion) {
    window.addEventListener('scroll', function () {
        var currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > 50) {
            cabecalho.classList.add('scroll-ativo');
        } else {
            cabecalho.classList.remove('scroll-ativo');
        }
    }, { passive: true });
}

// =============================================================
// 1) LETRA POR LETRA — TÍTULO HERO
// =============================================================
if (!preferReducedMotion) {
    var heroH1 = document.querySelector('.hero h1');
    if (heroH1) {
        var textoOriginal = heroH1.innerHTML;
        // Preserva o <span class="traco"> intacto
        var partes = textoOriginal.split(/(<span[^>]*>.*?<\/span>)/g);
        var novoHTML = '';

        partes.forEach(function (parte) {
            if (parte.match(/^<span/)) {
                // É um tag HTML — envolve cada letra interna
                var match = parte.match(/^<span class="([^"]*)">(.*)<\/span>$/);
                if (match) {
                    var classes = match[1];
                    var conteudo = match[2];
                    novoHTML += '<span class="' + classes + '">';
                    for (var i = 0; i < conteudo.length; i++) {
                        if (conteudo[i] === ' ') {
                            novoHTML += '<span class="letra espaco"> </span>';
                        } else {
                            novoHTML += '<span class="letra">' + conteudo[i] + '</span>';
                        }
                    }
                    novoHTML += '</span>';
                } else {
                    novoHTML += parte;
                }
            } else {
                // Texto normal
                for (var i = 0; i < parte.length; i++) {
                    if (parte[i] === ' ') {
                        novoHTML += '<span class="letra espaco"> </span>';
                    } else if (parte[i] === '\n') {
                        novoHTML += '<span class="letra espaco"> </span>';
                    } else {
                        novoHTML += '<span class="letra">' + parte[i] + '</span>';
                    }
                }
            }
        });

        heroH1.innerHTML = novoHTML;

        // Aplica delay escalonado a cada letra
        var letras = heroH1.querySelectorAll('.letra');
        letras.forEach(function (letra, index) {
            letra.style.transitionDelay = (index * 0.025) + 's';
        });
    }
}

// =============================================================
// 2) 3D TILT NOS CARDS DE EQUIPE
// =============================================================
if (!preferReducedMotion) {
    var cardsEquipe = document.querySelectorAll('.pessoa');

    cardsEquipe.forEach(function (card) {
        var retrato = card.querySelector('.retrato');
        if (!retrato) return;

        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;

            var rotateX = ((y - centerY) / centerY) * -6;
            var rotateY = ((x - centerX) / centerX) * 6;

            retrato.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            retrato.style.transform = 'rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// =============================================================
// 3) EFEITO MAGNÉTICO NOS BOTÕES
// =============================================================
if (!preferReducedMotion) {
    var botoes = document.querySelectorAll('.botao');

    botoes.forEach(function (botao) {
        botao.addEventListener('mousemove', function (e) {
            var rect = botao.getBoundingClientRect();
            var x = e.clientX - rect.left - rect.width / 2;
            var y = e.clientY - rect.top - rect.height / 2;

            var moveX = x * 0.2;
            var moveY = y * 0.2;

            botao.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
        });

        botao.addEventListener('mouseleave', function () {
            botao.style.transform = 'translate(0, 0)';
        });
    });
}

// =============================================================
// 4) BOTÃO SCROLL TO TOP
// =============================================================
(function () {
    var scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top';
    scrollBtn.setAttribute('aria-label', 'Voltar ao topo');
    scrollBtn.innerHTML = '&#8593;';
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', function () {
        var currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > 400) {
            scrollBtn.classList.add('visivel');
        } else {
            scrollBtn.classList.remove('visivel');
        }
    }, { passive: true });

    scrollBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// =============================================================
// 5) CONTADOR ANIMADO NOS NÚMEROS DOS PROJETOS
// =============================================================
if (!preferReducedMotion) {
    var numerosProjeto = document.querySelectorAll('.numero-projeto');

    numerosProjeto.forEach(function (el) {
        var valorFinal = el.textContent.trim();
        var valorNumerico = parseInt(valorFinal, 10);
        if (isNaN(valorNumerico)) return;

        var totalDigitas = valorFinal.length;
        el.textContent = '';

        var observerCounter = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animarContador(el, valorNumerico, totalDigitas);
                    observerCounter.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observerCounter.observe(el);
    });

    function animarContador(el, valorFinal, digitas) {
        var duracao = 800;
        var startTime = null;

        function frame(timestamp) {
            if (!startTime) startTime = timestamp;
            var progresso = Math.min((timestamp - startTime) / duracao, 1);
            var eased = 1 - Math.pow(1 - progresso, 3);
            var valorAtual = Math.floor(eased * valorFinal);
            el.textContent = String(valorAtual).padStart(digitas, '0');

            if (progresso < 1) {
                requestAnimationFrame(frame);
            } else {
                el.textContent = String(valorFinal).padStart(digitas, '0');
            }
        }

        requestAnimationFrame(frame);
    }
}

// =============================================================
// 6) COOKIE CONSENT BANNER
// =============================================================
(function () {
    var cookieKey = 'mvplabs_cookie_consent';
    var consent = localStorage.getItem(cookieKey);

    if (consent) return; // Já aceitou ou rejeitou

    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = '<p>Este site utiliza cookies para melhorar a sua experiência. Ao continuar a navegar, você concorda com o uso de cookies. <a href="#">Saiba mais</a></p>' +
        '<div class="cookie-botoes">' +
        '<button class="cookie-btn rejeitar" id="cookie-rejeitar">Rejeitar</button>' +
        '<button class="cookie-btn aceitar" id="cookie-aceitar">Aceitar</button>' +
        '</div>';
    document.body.appendChild(banner);

    // Mostra com delay
    setTimeout(function () {
        banner.classList.add('visivel');
    }, 1000);

    document.getElementById('cookie-aceitar').addEventListener('click', function () {
        localStorage.setItem(cookieKey, 'aceito');
        banner.classList.remove('visivel');
        setTimeout(function () { banner.remove(); }, 400);
    });

    document.getElementById('cookie-rejeitar').addEventListener('click', function () {
        localStorage.setItem(cookieKey, 'rejeitado');
        banner.classList.remove('visivel');
        setTimeout(function () { banner.remove(); }, 400);
    });
})();

// =============================================================
// 7) SKELETON LOADING NAS IMAGENS
// =============================================================
(function () {
    var imagens = document.querySelectorAll('img[src]');

    imagens.forEach(function (img) {
        // Só aplica skeleton se a imagem ainda não carregou
        if (img.complete) return;

        // Adiciona skeleton no pai
        var pai = img.parentElement;
        if (pai) {
            pai.classList.add('skeleton');
        }

        img.addEventListener('load', function () {
            if (pai) {
                pai.classList.remove('skeleton');
            }
        });

        img.addEventListener('error', function () {
            if (pai) {
                pai.classList.remove('skeleton');
            }
        });
    });
})();

// =============================================================
// 8) VALIDAÇÃO DO FORMULÁRIO COM MENSAGENS INLINE
// =============================================================
var formContatoEl = document.querySelector('.form-contato');
if (formContatoEl) {
    formContatoEl.addEventListener('submit', function (e) {
        var campos = formContatoEl.querySelectorAll('[required]');
        var valido = true;

        // Remove erros anteriores
        formContatoEl.querySelectorAll('.campo-erro').forEach(function (el) {
            el.remove();
        });
        formContatoEl.querySelectorAll('.campo-invalido').forEach(function (el) {
            el.classList.remove('campo-invalido');
        });

        campos.forEach(function (campo) {
            if (!campo.value.trim()) {
                valido = false;
                mostrarErro(campo, 'Este campo é obrigatório.');
            } else if (campo.type === 'email' && !validarEmail(campo.value)) {
                valido = false;
                mostrarErro(campo, 'Digite um e-mail válido.');
            }
        });

        if (!valido) {
            e.preventDefault();
        }
    });

    // Remove erro ao digitar
    formContatoEl.querySelectorAll('[required]').forEach(function (campo) {
        campo.addEventListener('input', function () {
            var erro = campo.parentElement.querySelector('.campo-erro');
            if (erro) {
                erro.remove();
                campo.classList.remove('campo-invalido');
            }
        });
    });
}

function mostrarErro(campo, mensagem) {
    campo.classList.add('campo-invalido');
    var erro = document.createElement('p');
    erro.className = 'campo-erro';
    erro.textContent = mensagem;
    campo.parentElement.appendChild(erro);
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
