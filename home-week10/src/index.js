const weatherAPIKey = 'ec4ab57ddc68416c842115821241811';
const googleAPIKey = 'AIzaSyAkeGuuIMBBGl8vW093K-s2OC8MTpz9sy0';

document.getElementById('get-info').addEventListener('click', async () => {
    const date = document.getElementById('selected-date').value;
    const location = document.getElementById('location').value;

    if (!date) {
        alert('Please select a date!');
        return;
    }

    const weather = await getWeather(location, date);
    const events = await getGoogleCalendarEvents(date);

    displayWeather(weather);
    displayCalendarEvents(events);
    loadDiary(date);
    disableDiaryEditing(); // 다이어리 기본적으로 비활성화
});

async function getWeather(location, date) {
    const weatherResponse = await fetch(
        `https://api.weatherapi.com/v1/history.json?key=${weatherAPIKey}&q=${location},South Korea&dt=${date}`
    );

    const weatherData = await weatherResponse.json();
    if (weatherData.error) {
        console.error('Weather data error:', weatherData.error.message);
        return null;
    }

    const dayWeather = weatherData.forecast.forecastday[0].day;
    return {
        temp: dayWeather.avgtemp_c,
        condition: dayWeather.condition.text,
    };
}

async function getGoogleCalendarEvents(date) {
    const timeMin = new Date(date).toISOString();
    const timeMax = new Date(new Date(date).setHours(23, 59, 59)).toISOString();

    const eventsResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&key=${googleAPIKey}`
    );

    const eventsData = await eventsResponse.json();
    return eventsData.items || [];
}

function displayWeather(weather) {
    const weatherDiv = document.getElementById('weather');
    if (weather) {
        weatherDiv.innerHTML = `Temperature: ${weather.temp}°C<br>Weather: ${weather.condition}`;
    } else {
        weatherDiv.innerText = 'No weather data available for the selected date.';
    }
}

function displayCalendarEvents(events) {
    if (events.length > 0) {
        console.log('Google Calendar Events:', events); // 이벤트 데이터를 콘솔에서 확인 가능
    } else {
        console.log('No events found for the selected date.');
    }
}

// 다이어리 관련 로직
document.getElementById('save-diary').addEventListener('click', () => {
    const date = document.getElementById('selected-date').value;
    const diary = document.getElementById('diary').value;

    if (!date) {
        alert('Please select a date!');
        return;
    }

    if (diary.trim() === '') {
        alert('Diary cannot be empty!');
        return;
    }

    // Save diary to localStorage
    localStorage.setItem(`diary_${date}`, diary);

    // Display confirmation message
    const message = document.getElementById('saved-message');
    message.style.display = 'block';
    setTimeout(() => (message.style.display = 'none'), 2000);

    disableDiaryEditing(); // 저장 후 수정 비활성화
});

document.getElementById('edit-diary').addEventListener('click', () => {
    enableDiaryEditing(); // 수정 모드 활성화
});

function loadDiary(date) {
    const savedDiary = localStorage.getItem(`diary_${date}`);
    const diaryField = document.getElementById('diary');
    diaryField.value = savedDiary || '';
}

function disableDiaryEditing() {
    const diaryField = document.getElementById('diary');
    const saveButton = document.getElementById('save-diary');

    diaryField.disabled = true;
    saveButton.disabled = true;
}

function enableDiaryEditing() {
    const diaryField = document.getElementById('diary');
    const saveButton = document.getElementById('save-diary');

    diaryField.disabled = false;
    saveButton.disabled = false;
}
