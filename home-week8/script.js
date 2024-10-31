const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];

let words = [];
let wordIndex = 0;
let startTime = Date.now();
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : Infinity;

const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const startButton = document.getElementById('start');
const modal = document.getElementById('modal');
const finalMessageElement = document.getElementById('final-message');
const highScoreMessageElement = document.getElementById('high-score-message');
const fireworksContainer = document.getElementById('fireworks');
const retryButton = document.getElementById('retry-button'); // 다시하기 버튼 추가

startButton.addEventListener('click', () => {
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[quoteIndex];
    words = quote.split(' ');
    wordIndex = 0;
    const spanWords = words.map(word => `<span>${word} </span>`);
    quoteElement.innerHTML = spanWords.join('');
    quoteElement.childNodes[0].className = 'highlight'; // 첫 단어 강조
    messageElement.innerText = '';
    typedValueElement.value = '';
    typedValueElement.className = ''; // 클래스 초기화
    typedValueElement.disabled = false; // 입력 필드 활성화
    typedValueElement.focus();
    startTime = new Date().getTime();

    // 게임 시작 시 버튼 비활성화
    startButton.disabled = true; // 게임 시작 버튼 비활성화
});

// 폭죽을 랜덤한 위치에 생성하는 함수
function createFirework(x, y) {
    for (let i = 0; i < 100; i++) { // 100개의 폭죽 생성
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`; // 랜덤 색상
        // 랜덤한 위치에 폭죽 생성
        firework.style.left = `${x + (Math.random() - 0.5) * 1500}px`; // 중앙을 기준으로 좌우로 이동
        firework.style.top = `${y + (Math.random() - 0.5) * 700}px`; // 중앙을 기준으로 상하로 이동

        fireworksContainer.appendChild(firework);
        fireworksContainer.style.display = 'block'; // 폭죽 보이기

        // 애니메이션이 끝나면 폭죽 요소 제거
        firework.addEventListener('animationend', () => {
            firework.remove();
        });
    }
}

// 입력 필드에서 스페이스바 키 이벤트 처리
typedValueElement.addEventListener('keydown', (event) => {
    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value.trim(); // 입력값에서 공백 제거

    // 스페이스바를 누를 때
    if (event.key === ' ') {
        event.preventDefault(); // 스페이스바 기본 동작 방지
        if (typedValue === currentWord) {
            // 폭죽 효과 생성
            const rect = typedValueElement.getBoundingClientRect();
            createFirework(rect.x + rect.width / 2, rect.y); // 입력 필드 중앙에 폭죽 생성

            typedValueElement.value = ''; // 입력 필드 초기화
            wordIndex++; // 다음 단어로 이동

            // 모든 단어에 대해 클래스 초기화
            for (const wordElement of quoteElement.childNodes) {
                wordElement.className = '';
            }

            // 다음 단어가 있을 경우 하이라이트 적용
            if (wordIndex < words.length) {
                quoteElement.childNodes[wordIndex].className = 'highlight'; // 다음 단어에 하이라이트 추가
            } else {
                // 모든 단어를 입력했을 때
                const elapsedTime = new Date().getTime() - startTime;
                const message = `축하합니다! 문장을 완성하는 데 ${(elapsedTime / 1000).toFixed(2)}초 소요되었습니다.`;
                messageElement.innerText = message;

                // 최고 점수 업데이트
                if (elapsedTime < highScore) {
                    highScore = elapsedTime;
                    localStorage.setItem('highScore', highScore); // 최고 점수 저장
                }

                // 모달 창에 결과 표시
                finalMessageElement.innerText = message;
                highScoreMessageElement.innerText = `최고 기록: ${(highScore / 1000).toFixed(2)}초`; // 최고 기록 표시
                modal.style.display = 'block'; // 모달 표시

                // 게임 종료 처리
                typedValueElement.disabled = true; // 입력 필드 비활성화
                startButton.disabled = false; // 버튼 다시 활성화
            }
        } else {
            typedValueElement.className = 'error'; // 틀리면 빨간색으로 표시
        }
    } else {
        // 현재 단어의 시작 부분이 입력값과 일치하는지 확인
        if (currentWord.startsWith(typedValue)) {
            typedValueElement.className = ''; // 올바르게 입력 중이면 오류 클래스 제거
        } else {
            typedValueElement.className = 'error'; // 틀리면 빨간색으로 표시
        }
    }
});

// 모달 닫기 버튼 이벤트
document.querySelector('.close-button').addEventListener('click', () => {
    modal.style.display = 'none';
});

// 다시하기 버튼 이벤트
retryButton.addEventListener('click', () => {
    // 상태 초기화
    quoteElement.innerHTML = '';
    messageElement.innerText = '';
    typedValueElement.value = '';
    typedValueElement.className = '';
    typedValueElement.disabled = true; // 입력 필드 비활성화
    startButton.disabled = false; // 버튼 다시 활성화
    fireworksContainer.style.display = 'none'; // 폭죽 컨테이너 숨기기

    // 모달 닫기
    modal.style.display = 'none';

    // 게임 초기화
    startButton.click(); // 게임 시작 버튼 클릭 이벤트 트리거
});

// 입력 이벤트 리스너 추가
typedValueElement.addEventListener('input', () => {
    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value.trim(); // 입력값에서 공백 제거

    // 현재 단어의 시작 부분이 입력값과 일치하는지 확인
    if (!currentWord.startsWith(typedValue)) {
        typedValueElement.className = 'error'; // 입력값이 틀리면 오류 클래스 추가
    } else {
        typedValueElement.className = ''; // 올바르게 입력 중이면 오류 클래스 제거
    }
});
