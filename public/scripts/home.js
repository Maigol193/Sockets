sessionStorage.removeItem("username");

document.getElementById('saveUser').addEventListener('click', () => {
    const usernameInput = document.getElementById('username');
    if (!usernameInput.value) {
        alert("Ingrese un nombre de usuario");
    } else {
        sessionStorage.setItem("username", usernameInput.value);
        document.getElementById('view').innerHTML =
            `<ul>
                <li><a href="chat/1">Sala 1</a></li>
                <li><a href="chat/2">Sala 2</a></li>
                <li><a href="chat/3">Sala 3</a></li>
                <li><a href="chat/4">Sala 4</a></li>
            </ul>`;
    }
});