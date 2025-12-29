// ピクミンを入れておく箱
const redList = [];
const iceList = [];
const blueList = [];

// ピクミンを出す
function spawn(type) {
    const pikmin = document.createElement("div");
    pikmin.classList.add(type);
    pikmin.style.left = "-100px";
    pikmin.style.bottom = "0px";
    document.getElementById("field").appendChild(pikmin);

    if (type === "red_pikmin") redList.push(pikmin);
    if (type === "ice_pikmin") iceList.push(pikmin);
    if (type === "blue_pikmin") blueList.push(pikmin);

    setTimeout(() => {
        const x = Math.random() * (window.innerWidth - 120);
        pikmin.style.left = x + "px";
    }, 50);
}

// ピクミン移動
function moveRed() {
    redList.forEach(p => {
        let x = parseInt(p.style.left);
        x += 20;
        if (x > window.innerWidth) x = -100;
        p.style.left = x + "px";
    });
}

function moveIce() {
    iceList.forEach(p => {
        let x = parseInt(p.style.left);
        x += 15;
        if (x > window.innerWidth) x = -100;
        p.style.left = x + "px";
    });
}

function moveBlue() {
    blueList.forEach(p => {
        let x = parseInt(p.style.left);
        x += 15;
        if (x > window.innerWidth) x = -100;
        p.style.left = x + "px";
    });
}

setInterval(moveRed, 200);
setInterval(moveIce, 200);
setInterval(moveBlue, 200);
setInterval(moveEnemy, 200);


// ボタン
document.getElementById("spawn_red").addEventListener("click", () => spawn("red_pikmin"));
document.getElementById("spawn_ice").addEventListener("click", () => spawn("ice_pikmin"));
document.getElementById("spawn_blue").addEventListener("click", () => spawn("blue_pikmin"));

// ブリトニー操作
const brittany = document.getElementById("brittany");
let brittanyX = 300;
let brittanyY = 100;

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (key === "ArrowLeft") brittanyX -= 20;
    if (key === "ArrowRight") brittanyX += 20;
    if (key === "ArrowDown") brittanyY -= 20;
    if (key === "ArrowUp") brittanyY += 20;

    if (key === "e") blowWhistle();
    if (key === " ") throwPikmin();  // ← スペースキーで投げる！

    // 画面外に行かないように
    if (brittanyX < 0) brittanyX = 0;
    if (brittanyX > window.innerWidth - 120) brittanyX = window.innerWidth - 120;

    if (brittanyY < 0) brittanyY = 0;
    if (brittanyY > window.innerHeight - 120) brittanyY = window.innerHeight - 120;

    brittany.style.left = brittanyX + "px";
    brittany.style.bottom = brittanyY + "px";
});

// 笛（ピクミンを集める）
function blowWhistle() {
    redList.concat(iceList, blueList).forEach(p => {
        p.style.left = brittanyX + "px";
        p.style.bottom = brittanyY + "px";
    });
}

// 一番近いピクミンを選ぶ
function getNearestPikmin() {
    const all = redList.concat(iceList, blueList);
    if (all.length === 0) return null;
    return all[0];
}

// ピクミンを投げる
function throwPikmin() {
    const p = getNearestPikmin();
    if (!p) return;

    let x = parseInt(p.style.left);
    let y = parseInt(p.style.bottom);

    let vx = 10;  // 横方向
    let vy = 20;  // 上方向の初速

    const timer = setInterval(() => {
        x += vx;
        y += vy;
        vy -= 2; // 重力

        p.style.left = x + "px";
        p.style.bottom = y + "px";

        if (y <= 0) {
            p.style.bottom = "0px";
            clearInterval(timer);
        }
    }, 50);
}
function isHit(a, b) {
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();

    return !(
        ar.right < br.left ||
        ar.left > br.right ||
        ar.bottom < br.top ||
        ar.top > br.bottom
    );
}
function throwPikmin() {
    const p = getNearestPikmin();
    if (!p) return;

    let x = parseInt(p.style.left);
    let y = parseInt(p.style.bottom);

    let vx = 10;
    let vy = 20;

    const timer = setInterval(() => {
        x += vx;
        y += vy;
        vy -= 2;

        p.style.left = x + "px";
        p.style.bottom = y + "px";

        // ★ 敵との当たり判定
        enemyList.forEach((enemy, index) => {
            if (isHit(p, enemy)) {
                enemy.remove();
                enemyList.splice(index, 1);
                clearInterval(timer);
            }
        });

        // 地面に落ちたら終了
        if (y <= 0) {
            p.style.bottom = "0px";
            clearInterval(timer);
        }
    }, 50);
}   

function moveEnemy() {
    enemyList.forEach(e => {
        let x = parseInt(e.style.left);
        x -= 10;
        e.style.left = x + "px";

        // ★ ピクミンを食べる処理
        const allPikmin = redList.concat(iceList, blueList);

        allPikmin.forEach(p => {
            if (isHit(p, e)) {
                p.remove();
                redList.splice(redList.indexOf(p), 1);
                iceList.splice(iceList.indexOf(p), 1);
                blueList.splice(blueList.indexOf(p), 1);
            }
        });

        // 画面外に出たら消す
        if (x < -200) {
            e.remove();
            enemyList.splice(enemyList.indexOf(e), 1);
        }
    });
}


const enemyList = [];
function spawnEnemy() {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");

    enemy.style.left = window.innerWidth + "px"; // 右端から出現
    enemy.style.bottom = "0px";

    document.getElementById("field").appendChild(enemy);
    enemyList.push(enemy);
}
