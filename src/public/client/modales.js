export function getModalInfo(elem, message) {
    // const elem = document.createElement("div")
    // elem.classList()
    elem.innerHTML  += `
        <div class="modal-confirm">
            <div class="modal-header">
                <h2 class="modal-title">Confirmar</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
        </div>
    `;

    closeModal(elem, ".modal-close")

}

export function getToastSuccessfull(elem, message){
    elem.innerHTML =`
        <div id="toast" class="toast" style="display: flex;">
            <div class="toast-icon">✅</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">&times;</button>
        </div>
        `
    setTimeout(()=>{
        elem.innerHTML = ""
    }, 3000)
    
    //  closesetTime(elem)
    // closeModal(elem, ".toast-close")
    
}
function closeModal(elem, selector){
    const close = document.querySelector(selector)

    if(close){
        close.addEventListener("click", ()=>{
            elem.innerHTML = "";
        })
    }
    
}

function closesetTime(elem){
    elem.innerHTML = ""
}