// ==========================================================================
// CORE SYSTEM TELEMETRY & INITIALIZATION
// ==========================================================================

document.getElementById('res-telemetry').innerText = `${window.innerWidth}x${window.innerHeight}`;

// --- PRELOADER (BOOT SEQUENCE) ---
const preloader = document.getElementById('preloader');
const bootText = document.getElementById('boot-text');
const loaderBar = document.getElementById('loader-bar');
const bootSequence = [
    "INITIALIZING KERNEL...", 
    "LOADING NEURAL NETWORKS...", 
    "ESTABLISHING WEBSOCKETS...", 
    "CALIBRATING TELEMETRY...", 
    "SYSTEM READY."
];

let step = 0;
let bootInterval = setInterval(() => {
    if (step < bootSequence.length) {
        bootText.innerText += "\n> " + bootSequence[step];
        loaderBar.style.width = `${(step + 1) * 20}%`;
        step++;
    } else {
        clearInterval(bootInterval);
        gsap.to(preloader, {
            yPercent: -100, 
            duration: 0.8, 
            ease: "power4.inOut", 
            delay: 0.2,
            onComplete: () => initSiteAnimations()
        });
    }
}, 300);

// --- TRANSLATION SYSTEM ---
const translations = {
    en: {
        nav_about: "About", nav_projects: "Projects", nav_contact: "Contact",
        hero_badge: "AVAILABLE FOR WORK // SYSTEM READY", hero_cta1: "Explore Work",
        about_p1: "Computer Engineering student exploring the intersection of AI and backend systems. Driven by the desire to solve real-world problems through robust, scalable code.",
        proj0_desc: "Real-time parking guidance system. Ultralytics YOLO edge inference detects spot occupancy and streams state via WebSocket to a Rust/Axum server.",
        proj1_desc: "Scientific baseline for single-stage object detection, implemented from scratch in PyTorch under hardware constraints.",
        proj2_desc: "Hybrid sports prediction system for F1 using vectorized Monte Carlo simulations. Microservices execute thousands of scenarios per second.",
        proj_live_btn: "Live Platform", proj_btn: "GitHub Repo", contact_btn1: "EMAIL ME"
    },
    pt: {
        nav_about: "Sobre", nav_projects: "Projetos", nav_contact: "Contato",
        hero_badge: "DISPONÍVEL PARA TRABALHO // SISTEMA PRONTO", hero_cta1: "Ver Projetos",
        about_p1: "Estudante de Engenharia da Computação explorando a interseção entre IA e sistemas backend. Movido pela vontade de resolver problemas reais através de código robusto e escalável.",
        proj0_desc: "Sistema de orientação de estacionamento em tempo real. Inferência na borda com Ultralytics YOLO detecta ocupação e transmite via WebSocket para um servidor Rust.",
        proj1_desc: "Baseline científico para detecção de objetos, implementado do zero em PyTorch com severas restrições de hardware.",
        proj2_desc: "Sistema híbrido de predições da F1 usando simulações de Monte Carlo vetorizadas. Microsserviços executam milhares de cenários por segundo.",
        proj_live_btn: "Acessar Plataforma", proj_btn: "GitHub Repo", contact_btn1: "ENVIAR EMAIL"
    }
};

let currentLang = 'en';
window.toggleLang = function(e) {
    e.preventDefault();
    currentLang = currentLang === 'en' ? 'pt' : 'en';
    e.target.innerText = currentLang === 'en' ? 'PT' : 'EN';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) el.innerText = translations[currentLang][key];
    });
};

// ==========================================================================
// PHYSICS ENGINE (LENIS + GSAP)
// ==========================================================================

const lenis = new Lenis({
    duration: 1.2, 
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical',
    gestureDirection: 'vertical', 
    smooth: true, 
    infinite: false,
});

const scrollTelemetry = document.getElementById('scroll-telemetry');
lenis.on('scroll', (e) => {
    ScrollTrigger.update();
    let percent = (e.animatedScroll / (e.dimensions.scrollHeight - e.dimensions.height)) * 100;
    if(!isNaN(percent)) scrollTelemetry.innerText = percent.toFixed(2);
});

// Sync Lenis with GSAP Ticker strictly (prevents double-firing)
gsap.registerPlugin(ScrollTrigger);
gsap.ticker.add((time) => { lenis.raf(time * 1000) });
gsap.ticker.lagSmoothing(0);

// ==========================================================================
// KINETIC ASSEMBLY TIMELINE
// ==========================================================================
let masterTl;

function initSiteAnimations() {
    // Initial Load Hero Animation (Independent from Scroll)
    gsap.fromTo("#panel-hero .gsap-reveal", 
        { y: 100, opacity: 0, autoAlpha: 0 }, 
        { y: 0, opacity: 1, autoAlpha: 1, duration: 1.2, stagger: 0.15, ease: "power4.out" }
    );

    if(window.innerWidth > 768) {
        masterTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".assembly-wrapper",
                pin: true,
                scrub: 1,
                end: "+=6000" // Virtual scroll distance for the entire site
            }
        });
        
        masterTl
            // PANEL 0 (HERO) OUT
            .to("#panel-hero .panel-content", { y: -150, autoAlpha: 0, duration: 1 })
            .to("#panel-hero .bg-text", { scale: 1.2, autoAlpha: 0, duration: 1 }, "-=1")
            .to("#panel-hero", { autoAlpha: 0, duration: 0.5 }, "-=0.5")

            // PANEL 1 (SYS INFO) IN
            .to("#panel-info", { autoAlpha: 1, duration: 0.1 })
            .fromTo("#panel-info .bg-text", { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1 })
            .fromTo("#panel-info .terminal", { y: window.innerHeight, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, "-=0.8")
            
            // PANEL 1 OUT
            .to("#panel-info .terminal", { y: -window.innerHeight, autoAlpha: 0, duration: 1, ease: "power3.in" })
            .to("#panel-info .bg-text", { scale: 1.2, autoAlpha: 0, duration: 1 }, "-=1")
            .to("#panel-info", { autoAlpha: 0, duration: 0.1 })

            // PANEL 2 (PROJECT 1) IN
            .to("#panel-proj1", { autoAlpha: 1, duration: 0.1 })
            .fromTo("#panel-proj1 .bg-text", { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1 })
            .fromTo("#panel-proj1 .project-info", { x: -window.innerWidth/2, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, "-=0.8")
            .fromTo("#panel-proj1 .project-visual", { x: window.innerWidth/2, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, "-=1")
            
            // PANEL 2 OUT
            .to("#panel-proj1 .project-info", { y: -window.innerHeight, autoAlpha: 0, duration: 1, ease: "power3.in" })
            .to("#panel-proj1 .project-visual", { y: window.innerHeight, autoAlpha: 0, duration: 1, ease: "power3.in" }, "-=1")
            .to("#panel-proj1 .bg-text", { scale: 1.2, autoAlpha: 0, duration: 1 }, "-=1")
            .to("#panel-proj1", { autoAlpha: 0, duration: 0.1 })

            // PANEL 3 (PROJECT 2) IN
            .to("#panel-proj2", { autoAlpha: 1, duration: 0.1 })
            .fromTo("#panel-proj2 .bg-text", { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1 })
            .fromTo("#panel-proj2 .project-info", { y: window.innerHeight, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, "-=0.8")
            .fromTo("#panel-proj2 .project-visual", { y: -window.innerHeight, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, "-=1")

            // PANEL 3 OUT
            .to("#panel-proj2 .project-info", { x: window.innerWidth/2, autoAlpha: 0, duration: 1, ease: "power3.in" })
            .to("#panel-proj2 .project-visual", { x: -window.innerWidth/2, autoAlpha: 0, duration: 1, ease: "power3.in" }, "-=1")
            .to("#panel-proj2 .bg-text", { scale: 1.2, autoAlpha: 0, duration: 1 }, "-=1")
            .to("#panel-proj2", { autoAlpha: 0, duration: 0.1 })

            // PANEL 4 (PROJECT 3) IN
            .to("#panel-proj3", { autoAlpha: 1, duration: 0.1 })
            .fromTo("#panel-proj3 .bg-text", { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1 })
            .fromTo("#panel-proj3 .project-info", { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1, ease: "power3.out" }, "-=0.8")
            .fromTo("#panel-proj3 .project-visual", { scale: 1.2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1, ease: "power3.out" }, "-=1")

            // PANEL 4 OUT
            .to("#panel-proj3 .project-info", { scale: 1.2, autoAlpha: 0, duration: 1, ease: "power3.in" })
            .to("#panel-proj3 .project-visual", { scale: 0.8, autoAlpha: 0, duration: 1, ease: "power3.in" }, "-=1")
            .to("#panel-proj3 .bg-text", { scale: 1.2, autoAlpha: 0, duration: 1 }, "-=1")
            .to("#panel-proj3", { autoAlpha: 0, duration: 0.1 })

            // PANEL 5 (CONTACT) IN
            .to("#panel-contact", { autoAlpha: 1, duration: 0.1 })
            .fromTo("#panel-contact .bg-text", { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1 })
            .fromTo("#panel-contact .huge-text", { y: 100, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 1, ease: "power3.out" }, "-=0.8")
            .fromTo("#panel-contact .btn-brutalist", { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, stagger: 0.05, duration: 0.2, ease: "power3.out" }, "-=0.8");

    } else {
        // Mobile fallback
        const panels = gsap.utils.toArray('.panel');
        panels.forEach((panel) => {
            const reveals = panel.querySelectorAll(".gsap-reveal");
            gsap.fromTo(reveals, 
                { y: 50, opacity: 0, autoAlpha: 0 }, 
                { 
                    y: 0, opacity: 1, autoAlpha: 1, duration: 1, stagger: 0.1, ease: "power3.out",
                    scrollTrigger: { trigger: panel, start: "top 80%" }
                }
            );
        });
    }
}

// Teleport Navigation Logic
window.scrollToPanel = function(index) {
    if(window.innerWidth > 768 && masterTl) {
        const scrollPos = masterTl.scrollTrigger.start + (6000 / 5) * index;
        
        gsap.to("#assembly-wrapper", {
            autoAlpha: 0,
            duration: 0.2,
            onComplete: () => {
                lenis.scrollTo(scrollPos, { immediate: true });
                setTimeout(() => {
                    ScrollTrigger.update();
                    let st = masterTl.scrollTrigger;
                    if (st.getTween()) st.getTween().progress(1);
                    gsap.to("#assembly-wrapper", { autoAlpha: 1, duration: 0.4 });
                }, 50);
            }
        });
    } else {
        lenis.scrollTo(document.querySelectorAll('.panel')[index]);
    }
};

// ==========================================================================
// INTERACTIVE ELEMENTS (CURSOR & WARP CANVAS)
// ==========================================================================

const cursorDot = document.getElementById("cursor-dot");
const cursorOutline = document.getElementById("cursor-outline");
const mouseXDisplay = document.getElementById("mouse-x");
const mouseYDisplay = document.getElementById("mouse-y");

let xToDot = gsap.quickTo(cursorDot, "x", {duration: 0.1, ease: "power3"});
let yToDot = gsap.quickTo(cursorDot, "y", {duration: 0.1, ease: "power3"});
let xToOutline = gsap.quickTo(cursorOutline, "x", {duration: 0.4, ease: "power3"});
let yToOutline = gsap.quickTo(cursorOutline, "y", {duration: 0.4, ease: "power3"});

let mx = window.innerWidth/2, my = window.innerHeight/2;

window.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    if(window.innerWidth > 768) {
        xToDot(mx); yToDot(my); xToOutline(mx); yToOutline(my);
    }
    mouseXDisplay.innerText = mx; mouseYDisplay.innerText = my;
});

document.querySelectorAll("[data-magnetic], a, button").forEach(el => {
    if(window.innerWidth <= 768) return;
    el.addEventListener("mouseenter", () => cursorOutline.style.transform = 'translate(-50%, -50%) scale(2)');
    el.addEventListener("mouseleave", () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    });
    el.addEventListener("mousemove", (e) => {
        if(!el.hasAttribute('data-magnetic')) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * 0.2, y: y * 0.2, duration: 0.2, ease: "power2.out" });
    });
});

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function resizeCanvas() { width = window.innerWidth; height = window.innerHeight; canvas.width = width; canvas.height = height; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() { this.reset(); }
    reset() { this.x = (Math.random() - 0.5) * width; this.y = (Math.random() - 0.5) * height; this.z = Math.random() * 2000; this.pz = this.z; }
    update() {
        let speed = 2 + (Math.abs(lenis.velocity) * 0.1); 
        this.z -= speed;
        if(this.z < 1) { this.reset(); this.pz = this.z; }
    }
    draw() {
        let focusX = mx - width/2; let focusY = my - height/2;
        let sx = (this.x / this.z) * 200 + width/2 + focusX * 0.1; let sy = (this.y / this.z) * 200 + height/2 + focusY * 0.1;
        let px = (this.x / this.pz) * 200 + width/2 + focusX * 0.1; let py = (this.y / this.pz) * 200 + height/2 + focusY * 0.1;
        this.pz = this.z;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(210, 255, 0, ${1 - this.z/2000})`; ctx.lineWidth = 1; ctx.stroke();
    }
}
for(let i = 0; i < 200; i++) particles.push(new Particle());

function animateCanvas() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.4)'; ctx.fillRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateCanvas);
}
animateCanvas();

// ==========================================================================
// DEEP-DIVE MODAL SYSTEM
// ==========================================================================

const deepDiveData = {
    estaciona: {
        title: "ESTACIONA.AI", subtitle: "REAL-TIME EDGE PARKING GUIDANCE", color: "#00ff41", bg: "assets/img/estaciona_blueprint.png",
        telemetry: "<span>> LIDAR_SCAN: ACTIVE</span><span>> BBOX_DETECTED: 14</span><span>> OCCUPANCY_STATE: 85%</span>",
        content: `
            <h3>The Problem</h3>
            <p>Traditional parking sensors (magnetic loops or ultrasonic) are prohibitively expensive to deploy per spot, require invasive installation, and fail frequently under heavy use.</p>
            <h3>The Architecture</h3>
            <p>Estaciona.ai introduces a centralized camera-based system using state-of-the-art Computer Vision deployed on Edge Computers. A single camera monitors dozens of spots simultaneously.</p>
            <ul>
                <li><strong>Vision Node:</strong> Captures RTSP feeds and runs inference via Ultralytics YOLO. It calculates bounding box IoU (Intersection over Union) against predefined parking spot polygons.</li>
                <li><strong>Data Stream:</strong> State changes (Occupied/Free) are streamed in real-time via WebSockets.</li>
                <li><strong>The Backend:</strong> A high-performance backend built in <strong>Rust (Axum)</strong> guarantees memory safety and handles thousands of concurrent WebSocket connections with a minimal CPU/RAM footprint.</li>
            </ul>
        `
    },
    yolo: {
        title: "YOLO.VISION", subtitle: "SCIENTIFIC BASELINE & ARCHITECTURE RESEARCH", color: "#00e5ff", bg: "assets/img/yolo_blueprint.png",
        telemetry: "<span>> INFERENCE: ONLINE</span><span>> TENSORS: FLOAT16</span><span>> LATENCY: 12ms</span>",
        content: `
            <h3>Overview</h3>
            <p>This is a scientific baseline project: a PyTorch implementation of the original YOLO (v1) single-stage detection algorithm, built entirely from scratch to map mathematical and hardware bottlenecks.</p>
            <h3>Hardware Constraints & Engineering</h3>
            <p>Developed under a strict 6GB VRAM constraint (RTX 2060). To prevent OOM crashes while maintaining mathematical stability, <strong>Gradient Accumulation</strong> was implemented to achieve an effective batch size of 16 using micro-batches.</p>
            <p>The dense detection head was aggressively optimized and structurally reduced from ~250M to ~25M parameters.</p>
            <h3>Empirical Findings</h3>
            <ul>
                <li><strong>Baseline Failure:</strong> Proved that random weight initialization without ImageNet pre-training fails to learn robust spatial features.</li>
                <li><strong>Transfer Learning:</strong> Replacing the custom backbone with a frozen ResNet18 yielded a 7x improvement in mAP.</li>
            </ul>
            <p>These findings paved the way for deploying Ultralytics YOLO in production (Estaciona.ai), specifically utilizing decoupled heads and anchor-free assignment to solve the spatial variance issues documented in this baseline.</p>
        `
    },
    redline: {
        title: "REDLINE", subtitle: "HYBRID MONTE CARLO PREDICTION SYSTEM", color: "#ff003c", bg: "assets/img/redline_blueprint.png",
        telemetry: "<span>> SIM_RUNNING</span><span>> MONTE_CARLO_VECTORS: ACTIVE</span><span>> TENSORS_LOADED: TRUE</span>",
        content: `
            <h3>Overview</h3>
            <p>A hybrid web application simulating the Formula 1 World Drivers' Championship. It predicts final standings by running tens of thousands of concurrent probability universes.</p>
            <h3>The Engine (Python Microservice)</h3>
            <p>Built with Flask, NumPy, and TensorFlow. The engine loads a custom-trained Keras Neural Network and Scikit-learn preprocessors. The model doesn't predict "winners"; it predicts the specific points a driver will score based on qualifying position, recent form, and historical DNF (Did Not Finish) rates.</p>
            <h3>Monte Carlo Vectorization</h3>
            <p>The simulation runs 50,000+ "universes" simultaneously <strong>without a single for-loop</strong>. It relies entirely on extreme NumPy vectorization, compiling massive batch arrays <code>(N_SIMS * N_EVENTS * N_DRIVERS, 4)</code> and predicting outcomes in a single GPU call. This reduces simulation time from minutes to milliseconds.</p>
            <h3>The Conductor (Java Backend)</h3>
            <p>A Spring Boot orchestrator handles user requests, maps live API telemetry data (via Jolpica API), and bridges the massive payloads to the Python engine seamlessly.</p>
        `
    }
};

const modalOverlay = document.getElementById('deep-dive-modal');
const modalCloseBtn = document.getElementById('modal-close');

// Modal Elements
const mBlueprint = document.getElementById('modal-blueprint');
const mBg = document.getElementById('modal-bg');
const mTelemetry = document.getElementById('modal-telemetry');
const mTitle = document.getElementById('modal-title');
const mSubtitle = document.getElementById('modal-subtitle');
const mArticle = document.getElementById('modal-article');

document.querySelectorAll('.inspect-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-project');
        const data = deepDiveData[id];
        if(!data) return;

        // Populate Modal
        mBlueprint.style.setProperty('--bp-color', data.color);
        mBg.style.backgroundImage = "url('" + data.bg + "')";
        mTelemetry.innerHTML = data.telemetry;
        mTitle.innerText = data.title;
        mSubtitle.innerText = data.subtitle;
        mArticle.innerHTML = data.content;

        // Reset Scroll and remove Button Focus
        btn.blur();
        document.querySelector('.modal-text').scrollTop = 0;

        // Show Modal & Lock Scroll
        lenis.stop();
        modalOverlay.classList.add('active');
    });
});

modalCloseBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    lenis.start();
});

document.addEventListener('keydown', (e) => {
    if ((e.key === 'Escape' || e.key.toLowerCase() === 'x') && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
        lenis.start();
    }
});

// ==========================================================================
// EASTER EGG (SYS.UNAUTHORIZED_ACCESS)
// ==========================================================================
setTimeout(() => {
    console.log("%c[SYS.BREACH_DETECTED]", "color: #ff003c; font-size: 30px; font-weight: 900; font-family: sans-serif; text-shadow: 2px 2px 0px #000;");
    console.log("%cCurious, aren't we, Engineer?", "color: #00ff41; font-size: 16px; font-family: monospace;");
    console.log("%cThe root override protocol requires the sacred sequence of the ancients.", "color: #8a8a93; font-size: 14px; font-family: monospace;");
    console.log("%cHint: ⬆️ ⬆️ ⬇️ ⬇️ ⬅️ ➡️ ⬅️ ➡️ B A", "color: #D2FF00; font-size: 14px; font-family: monospace; font-weight: bold;");
}, 2000);

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            console.log("%c[SYS.OVERRIDE_ACCEPTED] Accessing Mainframe...", "color: #D2FF00; font-size: 20px; font-weight: bold;");
            window.open('https://github.com/pedrozaz', '_blank');
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});
