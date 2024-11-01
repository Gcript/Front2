document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleDarkMode');

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode'); // 다크 모드 클래스 토글
        if (document.body.classList.contains('dark-mode')) {
            toggleButton.textContent = '다크 모드 끄기'; // 버튼 텍스트 변경
        } else {
            toggleButton.textContent = '다크 모드 켜기'; // 버튼 텍스트 변경
        }
    });
});
