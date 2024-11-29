class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dead = false;     // 객체가 파괴되었는지 여부
        this.type = "";        // 객체 타입 (영웅/적)
        this.width = 0;        // 객체의 폭
        this.height = 0;       // 객체의 높이
        this.img = undefined;  // 객체의 이미지
    }

    rectFromGameObject() {
        return {
            top: this.y,
            left: this.x,
            bottom: this.y + this.height,
            right: this.x + this.width,
        };
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height); // 캔버스에 이미지 그리기
    }
}

class Hero extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 99;
        this.height = 75;
        this.type = 'Hero';
        this.cooldown = 0; // 초기화
    }
    fire() {
        if (this.canFire()) { // 쿨다운 확인
            gameObjects.push(new Laser(this.x + 45, this.y - 10)); // 레이저 생성
            this.cooldown = 500; // 쿨다운 500ms 설정
            let id = setInterval(() => {
                if (this.cooldown > 0) {
                    this.cooldown -= 100;
                } else {
                    clearInterval(id); // 쿨다운 완료 후 타이머 종료
                }
            }, 100);
        }
    }
    canFire() {
        return this.cooldown === 0; // 쿨다운 상태 확인
    }
}

class AssistanceHero extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 99;
        this.height = 75;
        this.type = 'AssistanceHero';
        this.cooldown = 0; // 초기화

        let id = setInterval(() => {
            gameObjects.push(new Laser(this.x + 20, this.y - 10));
        }, 2000);
    }
}


class Enemy extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 98;
        this.height = 50;
        this.type = "Enemy";
        // 적 캐릭터의 자동 이동(Y축 방향)
        let id = setInterval(() => {
            if (this.y < canvas.height - this.height) {
                this.y += 5;  // 아래로 이동
            } else {
                console.log('Stopped at', this.y);
                clearInterval(id); // 화면 끝에 도달하면 정지
            }
        }, 300);
    }
}

class Laser extends GameObject {
    constructor(x, y) {
        super(x, y);
        (this.width = 9), (this.height = 33);
        this.type = 'Laser';
        this.img = laserImg;
        let id = setInterval(() => {
            if (this.y > 0) {
                this.y -= 15; // 레이저가 위로 이동
            } else {
                this.dead = true; // 화면 상단에 도달하면 제거
                clearInterval(id);
            }
        }, 100);
    }
}

class Shot extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 98;
        this.height = 50;
        this.type = "Shot";

        setTimeout(() => {
            this.dead = true; // 일정 시간이 지나면 객체 제거
        }, 100); // 0.5초 후 사라짐

        
    }
}


class EventEmitter {
    constructor() {
        this.listeners = {};
    }
    on(message, listener) {
        if (!this.listeners[message]) {
            this.listeners[message] = [];
        }
        this.listeners[message].push(listener);
    }
    emit(message, payload = null) {
        if (this.listeners[message]) {
            this.listeners[message].forEach((l) => l(message, payload));
        }
    }
}

const Messages = {
    KEY_EVENT_UP: "KEY_EVENT_UP",
    KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
    KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
    KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
    KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
    COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
    COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
};
let heroImg,
    assistance_heroImg1,
    assistance_heroImg2,
    enemyImg,
    shotImg,
    laserImg,
    canvas, ctx,
    gameObjects = [],
    hero,
    assistance_hero1,
    assistance_hero2,
    assistanceWidth,
    assistanceHeight,
    eventEmitter = new EventEmitter();

let onKeyDown = function (e) {
    console.log(e.keyCode);
    switch (e.keyCode) {
        case 37: // 왼쪽 화살표
        case 39: // 오른쪽 화살표
        case 38: // 위쪽 화살표
        case 40: // 아래쪽 화살표
        case 32: // 스페이스바
            e.preventDefault();
            break;
        default:
            break;
    }
};
window.addEventListener('keydown', onKeyDown);

function loadTexture(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        };
    })
};

window.onload = async () => {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    heroImg = await loadTexture("assets/player.png");
    assistance_heroImg1 = await loadTexture('assets/player.png');
    assistance_heroImg2 = await loadTexture('assets/player.png');
    assistanceWidth = assistance_heroImg1.width * 0.5;
    assistanceHeight = assistance_heroImg1.height * 0.5;
    enemyImg = await loadTexture("assets/enemyShip.png");
    shotImg = await loadTexture("assets/laserGreenShot.png");
    laserImg = await loadTexture("assets/laserRed.png");
    initGame();
    let gameLoopId = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGameObjects(ctx);
        updateGameObjects(); // 충돌 감지
        console.log(canvas, ctx);

    }, 100)
};

function createHero() {
    hero = new Hero(
        canvas.width / 2 - 45,
        canvas.height - canvas.height / 4
    );

    hero.img = heroImg;
    gameObjects.push(hero);
};

function createAssistanceHero() {
    assistance_hero1 = new AssistanceHero(
        canvas.width / 3 + 60,
        canvas.height - (canvas.height / 4 - 20)
    );

    assistance_hero2 = new AssistanceHero(
        canvas.width / 2 + 70,
        canvas.height - (canvas.height / 4 - 20)
    );

    assistance_hero1.width = assistanceWidth;
    assistance_hero1.height = assistanceHeight;
    assistance_hero2.width = assistanceWidth;
    assistance_hero2.height = assistanceHeight;

    assistance_hero1.img = assistance_heroImg1;
    assistance_hero2.img = assistance_heroImg2;

    gameObjects.push(assistance_hero1);
    gameObjects.push(assistance_hero2);
}



function createEnemies() {
    const MONSTER_TOTAL = 5;
    const MONSTER_WIDTH = MONSTER_TOTAL * 98;
    const START_X = (canvas.width - MONSTER_WIDTH) / 2;
    const STOP_X = START_X + MONSTER_WIDTH;
    for (let x = START_X; x < STOP_X; x += 98) {
        for (let y = 0; y < 50 * 5; y += 50) {
            const enemy = new Enemy(x, y);
            enemy.img = enemyImg;
            gameObjects.push(enemy);
        }
    }
};



function drawGameObjects(ctx) {
    gameObjects.forEach(go => go.draw(ctx));
};

function updateGameObjects() {
    const enemies = gameObjects.filter(go => go.type === 'Enemy');
    const lasers = gameObjects.filter((go) => go.type === "Laser");

    lasers.forEach((l) => {
        enemies.forEach((m) => {
            if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
                eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
                    first: l,
                    second: m,
                });
            }
        });
    });
    // 죽은 객체 제거
    gameObjects = gameObjects.filter(go => !go.dead);
};

function intersectRect(r1, r2) {
    return !(
        r2.left > r1.right ||  // r2가 r1의 오른쪽에 있음
        r2.right < r1.left ||  // r2가 r1의 왼쪽에 있음
        r2.top > r1.bottom ||  // r2가 r1의 아래에 있음
        r2.bottom < r1.top     // r2가 r1의 위에 있음
    );
};


window.addEventListener("keyup", (evt) => {
    if (evt.key === "ArrowUp") {
        eventEmitter.emit(Messages.KEY_EVENT_UP);
    } else if (evt.key === "ArrowDown") {
        eventEmitter.emit(Messages.KEY_EVENT_DOWN);
    } else if (evt.key === "ArrowLeft") {
        eventEmitter.emit(Messages.KEY_EVENT_LEFT);
    } else if (evt.key === "ArrowRight") {
        eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
    }
    else if (evt.keyCode === 32) {
        eventEmitter.emit(Messages.KEY_EVENT_SPACE);
    }
});

function initGame() {
    gameObjects = [];
    createEnemies();
    createHero();
    createAssistanceHero();

    eventEmitter.on(Messages.KEY_EVENT_UP, () => {
        hero.y -= 5;
        assistance_hero1.y -= 5;
        assistance_hero2.y -= 5;
    })
    eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
        hero.y += 5;
        assistance_hero1.y += 5;
        assistance_hero2.y += 5;
    });
    eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
        hero.x -= 5;
        assistance_hero1.x -= 5;
        assistance_hero2.x -= 5;
    });
    eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
        hero.x += 5;
        assistance_hero1.x += 5;
        assistance_hero2.x += 5;
    });

    eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
        if (hero.canFire()) {
            hero.fire();
        }
    });
    eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
        first.dead = true;
        second.dead = true;

        // 적 위치에 Shot 생성
        const shot = new Shot(second.x, second.y);
        shot.img = shotImg;
        gameObjects.push(shot);
    });
};
