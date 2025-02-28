document.addEventListener("DOMContentLoaded", async function() {
    console.log('Executed on page load');

    const userId = 1;
    let body = { type: 'SELECT', userId };
    const response = await fetch(`/api/posts?userid=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const json = await response.json();
    console.log(json);

    // process data
    let content = processPosts(json);  

    if (content.length > 0) {
        const list = document.querySelector('#ul-posts');
        for (let post of content) {
            list.appendChild(post);
        }
    }
})

function processPosts(posts) {
    let li_posts = []
    if (posts.length <= 0) return li_posts;

    for(let row of posts) {
        console.log(row);

        // Create li
        let li = document.createElement('li');
        li.style = 'border:solid;border-width:1px;width:650px';

        let a = document.createElement('a');
        a.href = `/CreatePost.html?username=${posts["UserName"]}&postid=${posts["PostId"]}`;
        a.data
        // Append to list
        li_posts.push(li);
    }

    return li_posts;
}

function moveToPost() {

}