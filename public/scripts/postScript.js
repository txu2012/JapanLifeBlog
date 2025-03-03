let postData;

document.addEventListener("DOMContentLoaded", async function() {
    console.log('Executed on page load');
    const urlParams = new URLSearchParams(window.location.search);

    const userId = urlParams.get('userid');
    const postId = urlParams.get('postid');

    const responses = await Promise.all(
    [
        fetch(`/api/posts?q=SelectPost&userid=${userId}&postid=${postId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()),
        fetch(`/api/posts?q=SelectAllPosts&userid=${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()),
        fetch(`/api/comments?q=SelectComments&postid=${postId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json())
    ]);

    // process data
    let content = createPost(responses[0].posts);  
    let postComments = responses[2]

    if (content !== undefined) {
        const post = document.querySelector('.post-container');
        post.appendChild(content);

        const comments = document.querySelector('.post-comments');
        comments.appendChild(createComments());

        let data = 
        {
            CurrentPostId: postId,
            UserId: userId,
            PostIds: responses[1].posts.reverse()
        }
        postData = data;
    }
});

async function changePost(next) {
    let postId = postData["CurrentPostId"];
    let idx = postData["PostIds"].findIndex((obj) => obj.PostId == postId);

    if (next === true && idx < postData["PostIds"].length - 1 && idx > -1) {
        idx++;
    }
    else if (next === false && idx > 0) {
        idx--;  
    }
    else {
        return;
    }
    postId = postData["PostIds"][idx]["PostId"];

    const response = await fetch(`/api/posts?q=SelectPost&userid=${postData["UserId"]}&postid=${postId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const jsonPost = await response.json();

    const post = document.querySelector('.post-container');
    post.replaceChildren(createPost(jsonPost.posts));

    const comments = document.querySelector('.post-display-comments');
    comments.replaceChildren(createComments(""));
    
    postData["CurrentPostId"] = postId;
}

function createPost(contentJson) {
    let article = document.createElement('article');
    for (let row of contentJson) {
        article.appendChild(createPostTitle(row["PostTitle"], row["UserName"], row["PostDate"]));
        article.appendChild(createPostBody(row["PostText"]));
    }
    return article;
}

function createPostTitle(postTitle, userName, postDate) {
    //let header = document.createElement('header');
    //header.style = 'margin-left:5px';

    let div = document.createElement('div');
    div.classList.add('post-header');
    let h2 = document.createElement('h2');
    h2.innerText = postTitle;
    div.appendChild(h2);

    let div2 = document.createElement('div');
    let p = document.createElement('p');
    p.innerText = `${userName} ${postDate}`;
    //p.style = 'margin-top:-10px;margin-left:510px;position:relative';
    div.appendChild(p);

    //header.appendChild(div);

    return div;
}

function createPostBody(postBody) {
    let section = document.createElement('section');
    section.classList.add('post-body');
    //section.style = 'margin-left:5px';

    let p = document.createElement('p');
    p.innerText = postBody;
    //p.style = 'width:800px;text-wrap:wrap';

    section.appendChild(p);

    return section;
}

function createComments(comments) {
    let div = document.createElement('div');
    div.classList.add('display-comments');
    //section.style = 'margin-left:5px';

    let h4 = document.createElement('h4');
    h4.innerText = 'Comments';

    div.appendChild(h4);

    return div;
}