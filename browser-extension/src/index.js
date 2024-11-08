import axios from '../node_modules/axios';

// form fields
const form = document.querySelector('.form-data');
const regionFields = document.querySelectorAll('.region-name');
const apiKey = document.querySelector('.api-key');
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const clearBtn = document.querySelector('.clear-btn');
const resultContainers = [
    document.getElementById('result-container-1'),
    document.getElementById('result-container-2'),
    document.getElementById('result-container-3')
];

// result 영역
const resultArea = document.querySelector('.result');

// 초기 display 상태 설정
form.style.display = 'block';
resultArea.style.display = 'none';

const calculateColor = async (value) => {
    const co2Scale = [0, 150, 600, 750, 800];
    const colors = ['#2AA364', '#F5EB4D', '#9E4229', '#381D02', '#381D02'];
    const closestNum = co2Scale.sort((a, b) => Math.abs(a - value) - Math.abs(b - value))[0];
    const scaleIndex = co2Scale.findIndex(element => element > closestNum);
    const closestColor = colors[scaleIndex];
    chrome.runtime.sendMessage({ action: 'updateIcon', value: { color: closestColor } });
};

const displayCarbonUsage = async (apiKey, regions) => {
    loading.style.display = 'block';
    errors.textContent = '';

    for (let i = 0; i < regions.length; i++) {
        const regionName = regions[i];
        const container = resultContainers[i];

        try {
            const response = await axios.get('https://api.co2signal.com/v1/latest', {
                params: { countryCode: regionName },
                headers: { 'auth-token': apiKey }
            });

            const CO2 = Math.floor(response.data.data.carbonIntensity);
            await calculateColor(CO2);

            const carbonUsage = `${Math.round(response.data.data.carbonIntensity)} grams (grams CO2 emitted per kilowatt hour)`;
            const fossilFuelPercentage = `${response.data.data.fossilFuelPercentage.toFixed(2)}% (percentage of fossil fuels used to generate electricity)`;

            container.innerHTML = `
                <p><strong>Region: </strong><span>${regionName}</span></p>
                <p><strong>Carbon Usage: </strong><span>${carbonUsage}</span></p>
                <p><strong>Fossil Fuel Percentage: </strong><span>${fossilFuelPercentage}</span></p>
            `;
            container.style.display = 'block';

        } catch (error) {
            console.error(error);
            errors.textContent = `Sorry, no data available for ${regionName}.`;
        }
    }

    loading.style.display = 'none';
};

function setUpUser(apiKey, regionNames) {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('regionNames', JSON.stringify(regionNames));
    displayCarbonUsage(apiKey, regionNames);
}

function handleSubmit(e) {
    e.preventDefault();
    const regionNames = Array.from(regionFields).map(input => input.value.trim());
    setUpUser(apiKey.value, regionNames);

    // form을 숨기고 result를 표시
    form.style.display = 'none';
    resultArea.style.display = 'block';
}

function init() {
    chrome.runtime.sendMessage({
        action: 'updateIcon',
            value: {
                color: 'green',
            },
     });
     
    const storedApiKey = localStorage.getItem('apiKey');
    const storedRegions = JSON.parse(localStorage.getItem('regionNames')) || [];

    if (storedApiKey && storedRegions.length > 0) {
        form.style.display = 'none';
        resultArea.style.display = 'block';
        displayCarbonUsage(storedApiKey, storedRegions);
    } else {
        form.style.display = 'block';
        resultArea.style.display = 'none';
        loading.style.display = 'none';
        errors.textContent = '';
    }
}

function reset(e) {
    e.preventDefault();
    localStorage.removeItem('regionNames');
    form.style.display = 'block';
    resultArea.style.display = 'none';
    resultContainers.forEach(container => container.style.display = 'none');
}

// 이벤트 리스너 등록
form.addEventListener('submit', handleSubmit);
clearBtn.addEventListener('click', reset);

init();
