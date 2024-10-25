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

const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const startButton = document.getElementById('start');

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

typedValueElement.addEventListener('keydown', (event) => {
    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value.trim(); // 입력값에서 공백 제거

    // 스페이스바를 누를 때
    if (event.key === ' ') {
        event.preventDefault(); // 스페이스바 기본 동작 방지
        if (typedValue === currentWord) {
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
                const message = `CONGRATULATIONS! You finished in ${(elapsedTime / 1000).toFixed(2)} seconds.`;
                messageElement.innerText = message;

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
