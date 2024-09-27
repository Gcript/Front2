let cardOne = 7;
let cardTwo = 5;
let cardOneBank = 7;
let cardTwoBank = 5;
let cardThreeBank = 6;
let cardFourBank = 4;
let cardThree = 7;

let pcards = [cardOne, cardTwo];
let dcards = [cardOneBank, cardTwoBank];

let psum = 0;
let dsum = 0;

for (let i = 0; i < pcards.length; i++) {
    psum += pcards[i];
}

for (let i = 0; i < dcards.length; i++) {
    dsum += dcards[i];
}

// 플레이어 버스트 및 블랙잭 체크
if (psum > 21) {
    console.log("플레이어 합계 :", psum, "Bust로 패배..");
} 
else if (psum === 21) {
    console.log("플레이어 합계 :", psum, "BlackJack !! 승리 !");
} 
else {
    // 딜러가 17 미만일 경우 카드 추가 합산
    while (dsum < 17 && dcards.length < 5) { // 딜러가 추가로 받을 카드 조건 조정
        dsum += cardFourBank; // 카드 한 장 더 추가
        break;
    }

    // 승패 판단
    if (psum > dsum) {
        console.log("플레이어 :", psum, "딜러 :", dsum, "로 승리 !");
    }
    else if (psum === dsum) {
        console.log("플레이어 :", psum, "딜러 :", dsum, "로 무승부");
    }
    else {
        console.log("플레이어 :", psum, ", 딜러 :", dsum, "로 패배..");
    }
}
