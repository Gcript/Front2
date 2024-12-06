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

        this.life = 3; // 12.06
        this.points = 0; // 12.06
    }

    decrementLife() {
        this.life--;
        if (this.life === 0) {
            this.dead = true;
        }
    } // 

    incrementPoints(isBoss) {
        if (isBoss) {
            this.points += 500; // 보스를 죽이면 500점 추가
        } else {
            this.points += 100; // 일반 적을 죽이면 100점 추가
        }
    }
    

    fire() {
        if (this.canFire()) { // 쿨다운 확인
            gameObjects.push(new Laser(this.x + 45, this.y - 10)); // 레이저 생성
            this.cooldown = 100; // 쿨다운 500ms 설정
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
        this.health = 1; // 일반 적은 한 번의 충돌로 죽음
        this.dx = Math.random() < 0.5 ? -1 : 1;
        this.dy = Math.random() < 0.5 ? -1 : 1;

        // 적 캐릭터의 랜덤 이동
        let id = setInterval(() => {
            // 이동 업데이트
            this.x += this.dx * 1; // X축 이동
            this.y += this.dy * 1; // Y축 이동

            // 캔버스 가장자리에 도달하면 방향 반전
            if (this.x <= 0 || this.x + this.width >= canvas.width) {
                this.dx *= -1; // X축 방향 반전
            }
            if (this.y <= 0 || this.y + this.height >= canvas.height) {
                this.dy *= -1; // Y축 방향 반전
            }

            // 만약 객체가 파괴되면 타이머 종료
            if (this.dead) {
                clearInterval(id);
            }
        }, 30);
    }

    takeDamage() {
        this.health -= 1;
        if (this.health <= 0) {
            this.dead = true;
        }
    }
}


class BossEnemy extends GameObject {
    constructor(x, y, stage) {
        super(x, y);
        this.width = 98 * 4; // 보스는 기존 적보다 4배 큼
        this.height = 50 * 4;
        this.type = "Boss";
        this.health = stage * 2; // 보스는 스테이지 * 2번 레이저와 충돌해야 죽음
        this.img = bossImg;

        // 보스 이동
        this.dx = Math.random() < 0.5 ? -1 : 1;
        this.dy = Math.random() < 0.5 ? -1 : 1;

        let id = setInterval(() => {
            // 이동 업데이트
            this.x += this.dx * 1.5; // 보스는 느리게 움직임
            this.y += this.dy * 1.5;

            // 벽에 부딪히면 반전
            if (this.x <= 0 || this.x + this.width >= canvas.width) {
                this.dx *= -1;
            }
            if (this.y <= 0 || this.y + this.height >= canvas.height) {
                this.dy *= -1;
            }

            // 보스가 죽으면 타이머 종료
            if (this.dead) {
                clearInterval(id);
            }
        }, 30);
    }

    takeDamage() {
        this.health -= 1;
        if (this.health <= 0) {
            this.dead = true;
        }
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
        }, 100); // 0.1초 후 사라짐


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
    clear() {
        this.listeners = {};
    }

}

const Messages = {
    KEY_EVENT_UP: "KEY_EVENT_UP",
    KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
    KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
    KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
    KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
    KEY_EVENT_ENTER: "KEY_EVENT_ENTER",
    COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
    COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
    GAME_END_LOSS: "GAME_END_LOSS",
    GAME_END_WIN: "GAME_END_WIN",
};
let heroImg,
    lifeImg,
    assistance_heroImg1,
    assistance_heroImg2,
    enemyImg,
    bossImg,
    shotImg,
    laserImg,
    canvas, ctx,
    gameObjects = [],
    hero,
    assistance_hero1,
    assistance_hero2,
    assistanceWidth,
    assistanceHeight,
    stageIntervalId,
    stage = 1,
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
    bossImg = await loadTexture("assets/enemyShip.png");
    shotImg = await loadTexture("assets/laserGreenShot.png");
    laserImg = await loadTexture("assets/laserRed.png");
    lifeImg = await loadTexture("assets/life.png");

    initGame();
};


let gameLoopId = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawPoints();
    drawLife();

    if (stage % 5 === 0 && !bossSpawned) {
        createBoss(stage);
        bossSpawned = true; // 보스가 생성되었음을 표시

        if (stage === 20){
            boss.type = "lastboss";
        }
    }

    drawGameObjects(ctx);
    updateGameObjects(); // 충돌 감지
    // console.log(canvas, ctx);
}, 100)


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
}

function createBoss(stage) {
    const boss = new BossEnemy(canvas.width / 2 - 196, 50, stage);
    boss.img = bossImg; // 보스 이미지 설정
    boss.type = stage === 20 ? "lastboss" : "Boss"; // 20 스테이지 보스의 타입을 "lastboss"로 설정
    gameObjects.push(boss);
    return boss;
}


function respawnEnemies() {
    // 적을 5초마다 지속적으로 소환하지만 마지막 스테이지에서는 적 생성 중지
    if (stage < 20) {
        setInterval(() => {
            for (let i = 0; i < 3; i++) {
                const x = Math.random() * (canvas.width - 98); // 캔버스 내 랜덤 위치
                const y = 50; // 화면 상단 외부에서 시작
                const enemy = new Enemy(x, y);
                enemy.img = enemyImg;
                gameObjects.push(enemy);
            }
        }, 5000); // 5000ms = 5초
    }
}

function drawGameObjects(ctx) {
    gameObjects.forEach(go => go.draw(ctx));
};

function updateGameObjects() {
    const enemies = gameObjects.filter(go => go.type === 'Enemy' || go.type === 'Boss' || go.type === 'lastboss');
    const lasers = gameObjects.filter((go) => go.type === "Laser");

    enemies.forEach(enemy => {
        const heroRect = hero.rectFromGameObject();
        if (intersectRect(heroRect, enemy.rectFromGameObject())) {
            if (enemy.type === 'Boss' || enemy.type === 'lastboss') {
                hero.life = 0; // 보스와 충돌 시 히어로의 생명력을 0으로 설정
                eventEmitter.emit(Messages.GAME_END_LOSS);
                return; // 충돌 후 게임 종료
            }
            eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
        }
    });
    

    lasers.forEach((l) => {
        enemies.forEach((enemy) => {
            if (intersectRect(l.rectFromGameObject(), enemy.rectFromGameObject())) {
                enemy.takeDamage();
                l.dead = true; // 레이저 제거
                if (enemy.dead) {
                    hero.incrementPoints(enemy.type === 'Boss' || enemy.type === 'lastboss'); // 보스를 죽이면 점수 증가
                    eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
                        first: l,
                        second: enemy,
                    });
                }
            }
        });
    });

    // 죽은 객체 제거
    gameObjects = gameObjects.filter(go => !go.dead);
}


function intersectRect(r1, r2) {
    return !(
        r2.left > r1.right ||  // r2가 r1의 오른쪽에 있음
        r2.right < r1.left ||  // r2가 r1의 왼쪽에 있음
        r2.top > r1.bottom ||  // r2가 r1의 아래에 있음
        r2.bottom < r1.top     // r2가 r1의 위에 있음
    );
};


window.addEventListener("keydown", (evt) => {
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
    else if (evt.key === "Enter") {
        eventEmitter.emit(Messages.KEY_EVENT_ENTER);
    }
});

function drawLife() {
    const START_POS = canvas.width - 180;
    for (let i = 0; i < hero.life; i++) {
        ctx.drawImage(
            lifeImg,
            START_POS + (45 * (i + 1)),
            canvas.height - 37);
    }
} // 12.06

function drawPoints() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "left";
    drawText("Points: " + hero.points, 10, canvas.height - 20);
} // 12.06

function drawText(message, x, y) {
    ctx.fillText(message, x, y);
} // 12.06

function isHeroDead() {
    return hero.life <= 0;
}

function isEnemiesDead() {
    if (stage === 20) {
        // 20스테이지의 마지막 보스가 존재하고, 보스가 죽었는지 확인
        const lastboss = gameObjects.find((go) => go.type === "lastboss" && go.dead);
        return lastboss !== undefined; // 마지막 보스가 죽으면 true 반환
    }
    return gameObjects.filter((go) => go.type === "Enemy" && !go.dead).length === 0;
}

function displayMessage(message, color = "red") {
    ctx.font = "30px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

function resetGame() {
    if (gameLoopId) {
        clearInterval(gameLoopId); // 게임 루프 중지, 중복 실행 방지
        eventEmitter.clear();  // 모든 이벤트 리스너 제거, 이전 게임 세션 충돌 방지
        initGame();  // 게임 초기 상태 실행
        gameLoopId = setInterval(() => {  // 100ms 간격으로 새로운 게임 루프 시작
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawPoints();
            drawLife();
            updateGameObjects();
            drawGameObjects(ctx);
        }, 100);
    }
}

function endGame(win) {
    clearInterval(gameLoopId); // 게임 루프 중지
    if (stageIntervalId) {
        clearInterval(stageIntervalId); // 스테이지 증가 중지
    }

    // 게임 화면이 겹칠 수 있으니, 200ms 지연
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (win) {
            displayMessage(
                "Victory!!! Pew Pew... - Press [Enter] to start a new game Captain Pew Pew",
                "green"
            );
        } else {
            displayMessage(
                "You died !!! Press [Enter] to start a new game Captain Pew Pew"
            );
        }
    }, 200);
}

const mycanvas = document.querySelector("#myCanvas");
const stageDisplay = document.querySelector("#stage-display");
const stagePopup = document.querySelector("#stage-popup");


// 캔버스 중앙 좌표를 반환하는 함수
function getCanvasCenter() {
    const canvasRect = mycanvas.getBoundingClientRect();
    return {
        x: canvasRect.left + canvasRect.width / 2,
        y: canvasRect.top + canvasRect.height / 2,
    };
}

// 스테이지 팝업을 캔버스 중앙에 표시
function showStagePopup() {
    const { x, y } = getCanvasCenter();

    // 중앙에 팝업 배치
    stagePopup.style.left = `${x}px`;
    stagePopup.style.top = `${y}px`;
    stagePopup.innerText = `Stage ${stage}`;
    stagePopup.style.opacity = "1"; // 팝업 표시
    stagePopup.style.transform = "translate(-50%, -50%) scale(1.2)"; // 확대 효과

    // 일정 시간 후 팝업 숨김
    setTimeout(() => {
        stagePopup.style.opacity = "0";
        stagePopup.style.transform = "translate(-50%, -50%) scale(1)";
    }, 1000);
}

function lastStage() {
    clearInterval(stageIntervalId); // 스테이지 증가 중지
    // 보스 소환 후 더 이상 적을 생성하지 않음
    const lastboss = createBoss(stage);
    lastboss.type = "lastboss"; // 20 스테이지 보스의 타입을 "lastboss"로 설정
    bossSpawned = true;
}


// 스테이지를 증가시키는 함수
function incrementStage() {
    stageIntervalId = setInterval(() => {
        stage += 1;
        bossSpawned = false; // 새로운 스테이지가 시작되면 보스 생성 가능하도록 초기화

        // 좌측 상단 기본 스테이지 업데이트
        stageDisplay.innerText = `Stage: ${stage}`;

        // 스테이지가 20일 때 lastStage 호출
        if (stage == 20) {
            lastStage();
            return; // 20스테이지에서 스테이지 증가 멈춤
        }

        // 캔버스 중앙에 팝업 표시
        showStagePopup();
    }, 1000); // 20초마다 실행
}


function initGame() {
    let move = 15;

    gameObjects = [];
    createEnemies();
    createHero();
    createAssistanceHero();
    respawnEnemies();
    incrementStage(); // 스테이지 증가 시작

    stageDisplay.innerText = `Stage: ${stage}`; // 초기 스테이지 표시

    eventEmitter.on(Messages.KEY_EVENT_UP, () => {
        hero.y -= move;
        assistance_hero1.y -= move;
        assistance_hero2.y -= move;
    })
    eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
        hero.y += move;
        assistance_hero1.y += move;
        assistance_hero2.y += move;
    });
    eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
        hero.x -= move;
        assistance_hero1.x -= move;
        assistance_hero2.x -= move;
    });
    eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
        hero.x += move;
        assistance_hero1.x += move;
        assistance_hero2.x += move;
    });

    eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
        if (hero.canFire()) {
            hero.fire();
        }
    });

    eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
        first.dead = true;

        if (second.type === 'Boss' || second.type === 'lastboss') {
            second.takeDamage();
            if (second.dead) {
                hero.incrementPoints(true); // 보스를 죽이면 500점 추가
            }
        } else {
            second.dead = true;
            hero.incrementPoints(false); // 일반 적을 죽이면 100점 추가
        }

        if (isEnemiesDead()) {
            eventEmitter.emit(Messages.GAME_END_WIN);
        }

        // 적 위치에 Shot 생성 (일반 적이든 보스든 동일)
        if (second.dead) {
            const shot = new Shot(second.x, second.y);
            shot.img = shotImg;
            gameObjects.push(shot);
        }
    });

    eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
        enemy.dead = true;
        hero.decrementLife();
        if (isHeroDead()) {
            eventEmitter.emit(Messages.GAME_END_LOSS);
            return; // loss before victory
        }
        if (isEnemiesDead()) {
            eventEmitter.emit(Messages.GAME_END_WIN);
        }
    });

    eventEmitter.on(Messages.GAME_END_WIN, () => {
        endGame(true);
    });
    eventEmitter.on(Messages.GAME_END_LOSS, () => {
        endGame(false);
    });

    eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
        resetGame();
    });
}