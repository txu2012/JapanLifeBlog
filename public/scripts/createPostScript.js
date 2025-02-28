const create = document.querySelector('#btn-post-create');
create.addEventListener('click', async function() {
    var d = new Date();
    let curDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    const postTitle = document.getElementById("post-title-textbox").value;
    const postBody = document.getElementById("post-content-container").innerText;
    const userId = 1;

    let body = { type: 'Post', postTitle, postBody, curDate, userId };
    const response = await fetch(`/api/insert`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    });
    const json = await response.text();
});

// const contentTarget = document.getElementById('post-content-container');                           // Target our DIV's DOM node.

// contentTarget.onpaste = (e) => {                                                      // When there's an paste event on our target DIV:
//    let cbPayload = [...(e.clipboardData || e.originalEvent.clipboardData).items];     // Capture the ClipboardEvent's eventData payload as an array
//        cbPayload = cbPayload.filter(i => /images/.test(i.type));                       // Strip out the non-image bits
   
//    if(!cbPayload.length || cbPayload.length === 0) return false;                      // If no image was present in the collection, bail.
   
//    let reader = new FileReader();                                                     // Instantiate a FileReader...
//    reader.onload = (e) => contentTarget.innerHTML = `<img src="${e.target.result}">`; // ... set its onLoad to render the event target's payload
//    reader.readAsDataURL(cbPayload[0].getAsFile());                                    // ... then read in the pasteboard image data as Base64
// };

document.getElementById('post-content-container').addEventListener("paste", (event) => {
    var clipboardData = event.clipboardData;
    clipboardData.types.forEach((type, i) => {
        const fileType = clipboardData.items[i].type;
        if (fileType.match(/image.*/)) {
            const file = clipboardData.items[i].getAsFile();
            const reader = new FileReader();
            reader.onload = function (evt) {
                const dataURL = evt.target.result;
                const img = document.createElement("img");
                img.src = dataURL;
                document.execCommand('insertHTML', true, img.outerHTML);

                sendImage(dataURL);
            };
            reader.readAsDataURL(file);
        }
    });
});

async function sendImage(dataurl) {
    let body = { type: 'Image', dataurl };
    const response = await fetch(`/api/image/save`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    });
    const json = await response.text();
}