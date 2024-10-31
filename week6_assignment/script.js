document.querySelectorAll('.plant').forEach(plant => {
    plant.addEventListener('dragstart', dragStart);
    plant.addEventListener('dblclick', bringToFront);
});

const terrarium = document.getElementById('terrarium');
terrarium.addEventListener('dragover', dragOver);
terrarium.addEventListener('drop', drop);

let zIndexCounter = 1;

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    console.log(`Dragging element: ${e.target.id}`);
}

function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
}

function drop(e) {
    e.preventDefault();
    const plantId = e.dataTransfer.getData('text');
    const plant = document.getElementById(plantId);

    terrarium.appendChild(plant);

    const rect = terrarium.getBoundingClientRect();
    const dropX = e.clientX
    const dropY = e.clientY

    plant.style.position = 'absolute'
    plant.style.left = `${dropX - (plant.clientWidth / 2)}px`;
    plant.style.top = `${dropY - (plant.clientHeight / 2)}px`;
    
    console.log(`Dropped element: ${plantId} at (${dropX}, ${dropY})`);
}

function bringToFront(e) {
    zIndexCounter++;
    e.target.style.zIndex = zIndexCounter;
    console.log(`Element ${e.target.id} z-index: ${zIndexCounter}`);
}
