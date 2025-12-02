let celebrationStarted = false;

function updateCountdown() {
    const now = new Date();
    const year = now.getFullYear();
    let christmas = new Date(`December 25, ${year} 00:00:00`);
    let newYear = new Date(`January 1, ${year + 1} 00:00:00`);
    let target, message;
    const title = document.getElementById("title");

    if (now < christmas) {
        target = christmas;
        title.textContent = "🎄 Christmas Countdown 🎄";
        message = `🎉 Wishing the Terrasparq family a very Happy Christmas ${year} 🎉`;
    } else {
        target = newYear;
        title.textContent = "🎉 New Year Countdown 🎉";
        message = `🎉 Wishing the Terrasparq family a very Happy New Year ${year + 1} 🎉`;
    }

    const diff = target - now;

    if (diff > 0) {
        document.getElementById("days").textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
        document.getElementById("hours").textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
        document.getElementById("minutes").textContent = Math.floor((diff / (1000 * 60)) % 60);
        document.getElementById("seconds").textContent = Math.floor((diff / 1000) % 60);
    } else {
        document.querySelector(".countdown").style.display = "none";
        const msgDiv = document.getElementById("celebrationMessage");
        msgDiv.style.display = "block";
        msgDiv.textContent = message;

        if (!celebrationStarted) {
            celebrationStarted = true;
            document.getElementById("celebrationSound").play();
            startFireworks();
            startConfetti();
            startSanta();
        }
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

let snowflakes = [];
const maxSnow = 120;

function createSnow() {
    while (snowflakes.length < maxSnow) {
        snowflakes.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            speed: Math.random() * 1 + 0.5,
            size: Math.random() * 3 + 2
        });
    }
}

function updateSnow() {
    const body = document.body;
    snowflakes.forEach(s => {
        s.y += s.speed;
        if (s.y > window.innerHeight) {
            s.y = -10;
            s.x = Math.random() * window.innerWidth;
        }
    });

    body.querySelectorAll(".snowflake").forEach(e => e.remove());

    snowflakes.forEach(s => {
        const flake = document.createElement("div");
        flake.className = "snowflake";
        flake.textContent = "❄";
        flake.style.left = s.x + "px";
        flake.style.top = s.y + "px";
        flake.style.fontSize = s.size + "px";
        body.appendChild(flake);
    });

    requestAnimationFrame(updateSnow);
}

createSnow();
updateSnow();

const music = document.getElementById("bgMusic");
document.getElementById("musicBtn").onclick = function () {
    if (music.paused) {
        music.play();
        this.textContent = "⏸ Pause Music";
    } else {
        music.pause();
        this.textContent = "🎵 Play Music";
    }
};

const fwCanvas = document.getElementById("fireworks");
const fwCtx = fwCanvas.getContext("2d");

function resizeFW() {
    fwCanvas.width = innerWidth;
    fwCanvas.height = innerHeight;
}

resizeFW();
onresize = resizeFW;

let fireworks = [];

function startFireworks() {
    let interval = setInterval(() => {
        fireworks.push({
            x: Math.random() * fwCanvas.width,
            y: fwCanvas.height,
            speed: Math.random() * 3 + 3,
            color: `hsl(${Math.random() * 360}, 100%, 60%)`,
            explode: false,
            radius: 2
        });
    }, 300);
    setTimeout(() => clearInterval(interval), 20000);
}

function drawFireworks() {
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
    fireworks.forEach(fw => {
        if (!fw.explode) {
            fwCtx.beginPath();
            fwCtx.arc(fw.x, fw.y, fw.radius, 0, Math.PI * 2);
            fwCtx.fillStyle = fw.color;
            fwCtx.fill();
            fw.y -= fw.speed;
            if (fw.y < fwCanvas.height * (0.4 + Math.random() * 0.2)) {
                fw.explode = true;
                fw.particles = [];
                for (let i = 0; i < 45; i++) {
                    fw.particles.push({
                        x: fw.x,
                        y: fw.y,
                        angle: Math.random() * Math.PI * 2,
                        speed: Math.random() * 4 + 1,
                        radius: 2
                    });
                }
            }
        } else {
            fw.particles.forEach(p => {
                fwCtx.beginPath();
                fwCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                fwCtx.fillStyle = fw.color;
                fwCtx.fill();
                p.x += Math.cos(p.angle) * p.speed;
                p.y += Math.sin(p.angle) * p.speed;
                p.speed *= 0.98;
            });
        }
    });
    fireworks = fireworks.filter(fw => fw.explode ? fw.particles.some(p => p.speed > 0.2) : true);
    requestAnimationFrame(drawFireworks);
}

drawFireworks();

const confCanvas = document.getElementById("confetti");
const confCtx = confCanvas.getContext("2d");

function resizeConfetti() {
    confCanvas.width = innerWidth;
    confCanvas.height = innerHeight;
}

resizeConfetti();
onresize = resizeConfetti;

let confettiPieces = [];

function startConfetti() {
    for (let i = 0; i < 300; i++) {
        confettiPieces.push({
            x: Math.random() * confCanvas.width,
            y: Math.random() * -300,
            size: Math.random() * 8 + 4,
            speed: Math.random() * 3 + 2,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
    }
}

function drawConfetti() {
    confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
    confettiPieces.forEach(c => {
        confCtx.fillStyle = c.color;
        confCtx.fillRect(c.x, c.y, c.size, c.size);
        c.y += c.speed;
    });
    requestAnimationFrame(drawConfetti);
}

drawConfetti();

function startSanta() {
    const santa = document.getElementById("santa");
    function fly() {
        santa.style.transition = "none";
        santa.style.transform = `translateX(-300px)`;
        requestAnimationFrame(() => {
            santa.style.transition = "transform 18s linear";
            santa.style.transform = `translateX(${window.innerWidth + 500}px)`;
        });
    }
    fly();
    setInterval(fly, 18000);
}

function createLights() {
    const container = document.getElementById("lightsContainer");
    const lightCount = 25;

    for (let i = 0; i < lightCount; i++) {
        const light = document.createElement("div");
        light.classList.add("light");
        light.style.top = "0px";
        light.style.left = `${i * (window.innerWidth / lightCount)}px`;
        container.appendChild(light);
    }

    for (let i = 0; i < lightCount; i++) {
        const light = document.createElement("div");
        light.classList.add("light");
        light.style.bottom = "0px";
        light.style.left = `${i * (window.innerWidth / lightCount)}px`;
        container.appendChild(light);
    }

    for (let i = 1; i < lightCount - 1; i++) {
        const light = document.createElement("div");
        light.classList.add("light");
        light.style.left = "0px";
        light.style.top = `${i * (window.innerHeight / lightCount)}px`;
        container.appendChild(light);
    }

    for (let i = 1; i < lightCount - 1; i++) {
        const light = document.createElement("div");
        light.classList.add("light");
        light.style.right = "0px";
        light.style.top = `${i * (window.innerHeight / lightCount)}px`;
        container.appendChild(light);
    }
}

createLights();

function adjustResponsive() {
    const container = document.querySelector(".container");
    const scale = Math.min(window.innerWidth / 900, 1);
    container.style.transform = `scale(${scale})`;
}

adjustResponsive();
window.addEventListener("resize", adjustResponsive);
