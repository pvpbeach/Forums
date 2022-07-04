function login() {
    let div = document.getElementById('login-app');
    div.style = 'visibility: hidden; height: 0px;'

    let msg = document.getElementById('login-message');
    msg.innerHTML = '<progress class="progress is-small is-primary" max="100">15%</progress><h1 class="title is-3 has-text-centered" style="color: #fff;">Logging you in...</h1>';
}

function forgot() {
    let div = document.getElementById('forgot-app');
    div.style = 'visibility: hidden; height: 0px;'

    let msg = document.getElementById('forgot-message');
    msg.innerHTML = '<progress class="progress is-small is-primary" max="100">15%</progress><h1 class="title is-3 has-text-centered" style="color: #fff;">Please wait...</h1>';

}