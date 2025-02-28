let tab = document.querySelector('.tab-form');
let tabHeader = tab.querySelector('.tab-header');
let tabHeaderElements = tab.querySelectorAll('.tab-header > div');
let tabBody = tab.querySelector('.tab-body');
let tabBodyElements = tab.querySelectorAll('.tab-body > div');

for (let i = 0; i < tabHeaderElements.length; i++) {
    tabHeaderElements[i].addEventListener('click', () => {
        tabHeader.querySelector('.active').classList.remove('active');
        tabHeaderElements[i].classList.add('active');
        tabBody.querySelector('.active').classList.remove('active');
        tabBodyElements[i].classList.add('active');
    });
}

let btnSignUp = document.querySelector("#btn-signup");
btnSignUp.addEventListener('click', async function() {
    const userName = document.querySelector("#signup-username").value
    const email = document.querySelector("#signup-email").value;
    const password = document.querySelector("#signup-password").value;
    let body = 
    { 
        type: 'Insert', 
        commands: 
        [ 
            {
                sql: "InsertUser", 
                params: [userName, email, password] 
            }
        ] 
    };

    const response = await fetch(`/api/insert`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    });
    const json = await response.text();
});

let btnLogin = document.querySelector("#btn-login");
btnLogin.addEventListener('click', async function() {
    const userName = document.querySelector("#login-username").value;
    const password = document.querySelector("#login-password").value;
    let body = 
    { 
        type: 'Select', 
        commands: 
        [ 
            {
                sql: "SelectUser", 
                params: [userName, password] 
            }
        ] 
    };

    const response = await fetch(`/api/user`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => res.json())
    .then((result) => {
        if (result.message === 'SUCCESS') {
            alert('Login successful.');
            window.location.href = '/web/Main.html'
        }
        else {
            alert(result.message);
        }
    });
});