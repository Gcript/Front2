document.querySelectorAll('.plant').forEach(plant => {
    plant.addEventListener('dragstart', dragStart);
    plant.ondblclick = bringToFront; // 더블클릭 이벤트로 변경
});

const terrarium = document.getElementById('terrarium');
terrarium.addEventListener('dragover', dragOver);
terrarium.addEventListener('drop', drop);

let zIndex = 1; // 초기 z-index 값 설정

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

    const dropX = e.clientX;
    const dropY = e.clientY;

    plant.style.position = 'absolute';
    plant.style.left = `${dropX - (plant.clientWidth / 2)}px`;
    plant.style.top = `${dropY - (plant.clientHeight / 2)}px`;

    console.log(`Dropped element: ${plantId} at (${dropX}, ${dropY})`);
}

function bringToFront(e) {
    zIndex++; // z-index 증가
    e.target.style.zIndex = zIndex; // 해당 요소의 z-index 업데이트
    console.log(`Element ${e.target.id} z-index set to ${zIndex}`);
}
