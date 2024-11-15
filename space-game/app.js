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
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    // background
    const backgroundImg = await loadTexture('assets/starBackground.png');
    const pattern = ctx.createPattern(backgroundImg, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const heroImg = await loadTexture('assets/player.png')
    const assistance_heroImg1 = await loadTexture('assets/player.png')
    const assistance_heroImg2 = await loadTexture('assets/player.png')
    const enemyImg = await loadTexture('assets/enemyShip.png')    
    ctx.drawImage(heroImg, canvas.width / 2 - 45, canvas.height - (canvas.height / 4));

    const assistanceWidth = assistance_heroImg1.width * 0.5;
    const assistanceHeight = assistance_heroImg1.height * 0.5;
    ctx.drawImage(assistance_heroImg1, canvas.width / 3 + 60, canvas.height - (canvas.height / 4 - 20), assistanceWidth, assistanceHeight);
    ctx.drawImage(assistance_heroImg2, canvas.width / 2 + 70, canvas.height - (canvas.height / 4 -20), assistanceWidth, assistanceHeight);
    createEnemies(ctx, canvas, enemyImg);
};


function createEnemies(ctx, canvas, enemyImg) {
    const MONSTER_TOTAL = 5;
    const START_Y = 0;  // 첫 줄의 y 좌표 시작 위치

    for (let row = 0; row < MONSTER_TOTAL; row++) {
        const monstersInRow = MONSTER_TOTAL - row; // 각 줄의 적 개수
        const rowWidth = monstersInRow * enemyImg.width;
        const startX = (canvas.width - rowWidth) / 2; // 줄을 중앙 정렬

        for (let x = startX; x < startX + rowWidth; x += enemyImg.width) {
            const y = START_Y + row * enemyImg.height;
            ctx.drawImage(enemyImg, x, y);
        }
    }
}




