chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log("Message received:", msg);
    if (msg.action === 'updateIcon') {
        let iconSizes = [16, 32, 48, 128];
        let imageDataDict = {};
        
        iconSizes.forEach((size) => {
            imageDataDict[size] = drawIcon(msg.value.color, size);
        });
        
        chrome.action.setIcon({ imageData: imageDataDict }, () => {
            if (chrome.runtime.lastError) {
                console.error("Error setting icon:", chrome.runtime.lastError);
            } else {
                console.log("Icon updated successfully!");
            }
        });
    }
});

function drawIcon(color, size) {
    console.log(`Drawing icon with color ${color} and size ${size}`);
    let canvas = new OffscreenCanvas(size, size);
    let context = canvas.getContext('2d');
    
    context.clearRect(0, 0, size, size);
    context.beginPath();
    context.fillStyle = color;
    context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    context.fill();
    
    return context.getImageData(0, 0, size, size);
}
