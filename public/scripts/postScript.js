let postData;

document.addEventListener("DOMContentLoaded", async function() {
    console.log('Executed on page load');
    const urlParams = new URLSearchParams(window.location.search);

    const userId = urlParams.get('userid');
    const postId = urlParams.get('postid');

    const responses = await Promise.all(
    [
        fetch(`/api/posts?userid=${userId}&postid=${postId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json())
        ,
        fetch(`/api/posts?userid=${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json())
    ]);

    // process data
    let content = createPost(responses[0]);  

    if (content !== undefined) {
        const post = document.querySelector('.main-container');
        post.appendChild(content);

        let data = {
            CurrentPostId: postId,
            UserId: userId,
            PostIds: responses[1]
        }
        postData = data;
    }
});

async function changePost(next) {
    console.log(postData);
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
    console.log(postId);

    const response = await fetch(`/api/posts?userid=${postData["UserId"]}&postid=${postId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const jsonPost = await response.json();

    const post = document.querySelector('.main-container');
    post.replaceChildren(createPost(jsonPost));

    postData["CurrentPostId"] = postId;
}

function createPost(contentJson) {
    let article = document.createElement('article');
    for (let row of contentJson) {
        console.log(row);
        article.appendChild(createPostTitle(row["PostTitle"], row["UserName"], row["PostDate"]));
        article.appendChild(createPostBody(row["PostText"]));
        article.appendChild(createComments(""));
    }

    return article;
}

function createPostTitle(postTitle, userName, postDate) {
    let header = document.createElement('header');
    header.style = 'margin-left:5px';

    let h2 = document.createElement('h2');
    h2.innerText = postTitle;

    let p = document.createElement('p');
    p.innerText = `${postDate} ${userName}`;
    p.style = 'margin-top:-10px;margin-left:510px;position:relative';

    header.appendChild(h2);
    header.appendChild(p);

    return header;
}

function createPostBody(postBody) {
    let section = document.createElement('section');
    section.style = 'margin-left:5px';

    let p = document.createElement('p');
    p.innerText = postBody;
    p.style = 'width:800px;text-wrap:wrap';

    section.appendChild(p);

    return section;
}

function createComments(comments) {
    let section = document.createElement('section');
    section.style = 'margin-left:5px';

    let h4 = document.createElement('h4');
    h4.innerText = 'Comments';

    section.appendChild(h4);

    return section;
}