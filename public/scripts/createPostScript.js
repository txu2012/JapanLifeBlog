const create = document.querySelector('#btn-post-create');
create.addEventListener('click', async function() {
    var d = new Date();
    const postTitle = document.getElementById("post-title-textbox").value;
    const postBody = document.getElementById("post-content-container").innerText;
    const userId = 1;
    
    let body = 
    { 
        type: 'Insert', 
        commands: 
        [
            {
                sql: "InsertPost",
                params: [ postTitle, userId ], 
            },
            {
                sql: "InsertPostDetail",
                params: [ postBody ]
            }
        ]  
    };
    
    const response = await fetch(`/api/insert`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.json())
    .then((result) => {
        if (result.message === 'SUCCESS') {
            alert('Post Created');
            window.location.href = '/web/Main.html';
        }
        else {
            alert('Failed to create post.');
        }
    });
});

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
    const json = await response.json();
}