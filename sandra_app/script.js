document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const welcomeScreen = document.getElementById('welcome-screen');
    const letterScreen = document.getElementById('letter-screen');
    const memoriesScreen = document.getElementById('memories-screen');
    const openLetterBtn = document.getElementById('open-letter');
    const showMemoriesBtn = document.getElementById('show-memories');
    const backToLetterBtn = document.getElementById('back-to-letter');
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    const memoriesVideo = document.getElementById('memories-video');

    // Estado de la música
    let musicPlaying = false;

    // Función para cambiar de pantalla
    function switchScreen(hideScreen, showScreen) {
        hideScreen.classList.remove('active');
        setTimeout(() => {
            showScreen.classList.add('active');
        }, 300);
    }

    // Función para iniciar música
    function startMusic() {
        backgroundMusic.play().then(() => {
            musicPlaying = true;
            musicToggle.classList.add('playing');
            musicToggle.textContent = '🎵';
        }).catch(error => {
            console.log('Error al reproducir música:', error);
        });
    }

    // Función para pausar música
    function pauseMusic() {
        backgroundMusic.pause();
        musicPlaying = false;
        musicToggle.classList.remove('playing');
        musicToggle.textContent = '🔇';
    }

    // Event listeners
    openLetterBtn.addEventListener('click', function() {
        switchScreen(welcomeScreen, letterScreen);
        // Intentar iniciar la música cuando el usuario interactúa
        if (!musicPlaying) {
            startMusic();
        }
    });

    showMemoriesBtn.addEventListener('click', function() {
        switchScreen(letterScreen, memoriesScreen);
    });

    backToLetterBtn.addEventListener('click', function() {
        switchScreen(memoriesScreen, letterScreen);
        // Pausar el video cuando volvemos a la carta
        memoriesVideo.pause();
    });

    musicToggle.addEventListener('click', function() {
        if (musicPlaying) {
            pauseMusic();
        } else {
            startMusic();
        }
    });

    // Configurar el volumen de la música de fondo
    backgroundMusic.volume = 0.3;

    // Manejar errores de audio
    backgroundMusic.addEventListener('error', function(e) {
        console.log('Error al cargar el audio:', e);
        musicToggle.style.display = 'none';
    });

    // Manejar errores de video
    memoriesVideo.addEventListener('error', function(e) {
        console.log('Error al cargar el video:', e);
        const videoContainer = document.querySelector('.video-container');
        videoContainer.innerHTML = '<p style="color: #666; padding: 20px;">No se pudo cargar el video de recuerdos</p>';
    });

    // Animación de entrada para los corazones
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
        document.querySelector('.hearts').appendChild(heart);

        // Remover el corazón después de la animación
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 6000);
    }

    // Crear corazones flotantes cada cierto tiempo
    setInterval(createFloatingHeart, 1000);

    // Efecto de escritura para el mensaje
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Aplicar efecto de escritura cuando se muestra la carta
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.id === 'letter-screen') {
                const paragraphs = entry.target.querySelectorAll('.letter-content p');
                paragraphs.forEach((p, index) => {
                    const originalText = p.textContent;
                    setTimeout(() => {
                        typeWriter(p, originalText, 30);
                    }, index * 1000);
                });
            }
        });
    });

    observer.observe(letterScreen);

    // Prevenir que la música se pause cuando la página pierde el foco
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && musicPlaying) {
            // No pausar la música cuando la página está oculta
        } else if (!document.hidden && musicPlaying) {
            // Reanudar la música si estaba reproduciéndose
            backgroundMusic.play().catch(error => {
                console.log('Error al reanudar música:', error);
            });
        }
    });

    // Configuración para dispositivos móviles
    if ('ontouchstart' in window) {
        // Agregar clase para dispositivos táctiles
        document.body.classList.add('touch-device');
        
        // Mejorar la experiencia táctil
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
    }

    // Configurar autoplay para el video en dispositivos móviles
    memoriesVideo.addEventListener('loadedmetadata', function() {
        // En dispositivos móviles, mostrar controles del video
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            memoriesVideo.controls = true;
            memoriesVideo.preload = 'metadata';
        }
    });

    // Función para compartir en WhatsApp (si se ejecuta desde un dispositivo móvil)
    function shareOnWhatsApp() {
        const text = "¡Mira esta hermosa carta que me hicieron! ❤️";
        const url = window.location.href;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
        
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            window.open(whatsappUrl, '_blank');
        }
    }

    // Agregar botón de compartir si es necesario
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        const shareBtn = document.createElement('button');
        shareBtn.innerHTML = '📱 Compartir';
        shareBtn.className = 'share-btn';
        shareBtn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            background: linear-gradient(45deg, #25d366, #128c7e);
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 25px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 3px 10px rgba(37, 211, 102, 0.3);
            z-index: 1000;
        `;
        shareBtn.addEventListener('click', shareOnWhatsApp);
        document.body.appendChild(shareBtn);
    }
});

