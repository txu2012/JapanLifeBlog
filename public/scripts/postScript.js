let postData;
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userid');
const postId = urlParams.get('postid');

document.addEventListener("DOMContentLoaded", async function() {
    console.log('Executed on page load');

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
    let postComments = responses[2].comments;
    console.log(postComments);

    if (content !== undefined) {
        const post = document.querySelector('.post-container');
        post.appendChild(content);

        let cmt_list = createComments(postComments); 
        const comment_list = document.querySelector('#ul-comments');
        for (let cmt of cmt_list) {
            comment_list.appendChild(cmt);
        }

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
    let newPostId = postData["CurrentPostId"];
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
    newPostId = postData["PostIds"][idx]["PostId"];

    window.location.href = `/web/Post.html?userid=${postData["UserId"]}&postid=${newPostId}`;
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
    let div = document.createElement('div');
    div.classList.add('post-header');
    let h2 = document.createElement('h2');
    h2.innerText = postTitle;
    div.appendChild(h2);

    let div2 = document.createElement('div');
    let p = document.createElement('p');
    p.innerText = `${userName} ${postDate}`;
    div.appendChild(p);

    return div;
}

function createPostBody(postBody) {
    let section = document.createElement('section');
    section.classList.add('post-body');

    let p = document.createElement('p');
    p.innerText = postBody;

    section.appendChild(p);

    return section;
}

function createComments(comments) {
    let li_comments = []
    if (comments.length <= 0) return li_comments;

    for (let row of comments) {
        // Create li
        let li = document.createElement('li');
        li.classList.add('li-comment');

        // Full comment
        let div_cmt_whole = document.createElement('div');

        // Header
        let div_cmt_header = document.createElement('div');
        div_cmt_header.classList.add('div-comment-header');
        
        let h4_name = document.createElement('h4');
        h4_name.innerText = row['UserName'];
        
        let p_date = document.createElement('p');
        p_date.innerText = row['CommentDate'];

        div_cmt_header.appendChild(h4_name);
        div_cmt_header.appendChild(p_date);

        // Add break line
        let br = document.createElement('br');

        // Body
        let div_cmt_body = document.createElement('div');
        div_cmt_body.classList.add('div-comment-body');

        let p_body = document.createElement('p');
        p_body.innerText = row['Comment'];

        div_cmt_body.appendChild(p_body);

        // Dividing line
        let hr = document.createElement('hr');
        hr.classList.add('hr-solid');

        div_cmt_whole.appendChild(div_cmt_header);
        div_cmt_whole.appendChild(br);
        div_cmt_whole.appendChild(div_cmt_body);
        div_cmt_whole.appendChild(hr);

        li.appendChild(div_cmt_whole);

        li_comments.push(li);
    }

    return li_comments;
}

const comment = document.querySelector('#btn-post-comment');
comment.addEventListener('click', async function() {
    let success = false;
    const commentBody = document.getElementById('comment-input').value;

    let body = {
        type: 'Insert',
        commands:
        [
            {
                sql: 'InsertComment',
                params: [ commentBody, postId, userId ]
            }
        ]
    };

    const response = await fetch('/api/insert', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.json())
    .then((result) => {
        if (result.message === 'SUCCESS') {
            success = true;
            document.getElementById('comment-input').value = "";
        }
    });    

    if (success) {
        let cmt_response = await fetch(`/api/comments?q=SelectComments&postid=${postId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then((res) => res.json());

        const comment_list = document.querySelector('#ul-comments');
        while(comment_list.firstChild) {
            comment_list.removeChild(comment_list.firstChild);
        }

        let cmt_list = createComments(cmt_response.comments); 
        for (let cmt of cmt_list) {
            comment_list.appendChild(cmt);
        }
    }
});