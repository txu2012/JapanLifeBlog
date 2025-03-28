// Reload upon entering
(function () {
    window.onpageshow = function(event) {
        if (event.persisted) {
            window.location.reload();
        }
    };
})();

document.addEventListener("DOMContentLoaded", async function() {
    console.log('Executed on page load');

    const userId = 1;
    let body = { type: 'SELECT', userId };
    const response = await fetch(`/api/posts?q=SelectAllPosts&userid=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const json = await response.json();

    // process data
    let content = processPosts(json.posts);  

    if (content.length > 0) {
        let postList = document.querySelector('#ul-posts');
        for (let post of content) {
            postList.appendChild(post);
        }

        let postListElements = postList.querySelectorAll('.li-post');
        for(let i = 0; i < postListElements.length; i++) {
            postListElements[i].addEventListener('mouseenter', (event) => {
                let elems =  postList.querySelector('.active');
                if (elems) elems.classList.remove('active');
                postListElements[i].classList.add('active');
            });
        }
    }
})

function processPosts(posts) {
    let li_posts = []
    if (posts.length <= 0) return li_posts;

    for(let row of posts) {
        // Create li
        let li = document.createElement('li');
        li.classList.add('li-post');
        
        let a = document.createElement('a');
        a.href = `/web/Post.html?userid=${row["UserId"]}&postid=${row["PostId"]}`;
        a.innerText = row["PostTitle"];

        let div = document.createElement('div');
        let date = document.createElement('a');
        date.innerText = row["PostDate"];
        let user = document.createElement('a');
        user.innerText = row["UserName"];
        
        div.appendChild(user);
        div.appendChild(date);

        li.appendChild(a);
        li.appendChild(div);

        // Append to list
        li_posts.push(li);
    }

    return li_posts;
}