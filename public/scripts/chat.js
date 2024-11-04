const socket = io('/');

const messageInput = document.getElementById('message'); 
const roomId = window.location.href.split('/').pop();
const username = sessionStorage.getItem("username");
const chatView = document.getElementById("chatView");
const home = "http://localhost:3000"

if(!username){
    window.location.replace(home);
    alert("Please enter a username");
}

function createChatContent(tag, type, content){
    const element = document.createElement(tag);
    element.classType = type;
    element.textContent = content;
    return element;
}

function updateChat(data) {
    const chatContainer = document.getElementById('messages');
    let chatContent;

    // Crear el contenido del mensaje basado en el tipo de data
    if (data.type === 0) {
        // Mensaje propio
        chatContent = createChatContent('div', 'own-message', `${data.username}: ${data.message}`);
    } else if (data.type === 1) {
        // Mensaje de otro
        chatContent = createChatContent('div', 'other-message', `${data.username}: ${data.message}`);
    } else if (data.type === 2) {
        // Notificación
        chatContent = createChatContent('div', 'notification', data.message);
    }

    // Asignar clase según el tipo de mensaje
    chatContent.classList.add(data.type);

    // Agregar el mensaje al contenedor del chat
    chatContainer.appendChild(chatContent);

    // Desplazar hacia abajo para ver el último mensaje
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function createMessage(msg, type){
    data = {
        username,
        message: msg,
        room: roomId,
        type
    }

    updateChat(data);
    if (type === 0 || type === 1) {
        socket.emit('sendNewMessage', data);
    } else {
        socket.emit('sendNewNotification', data);
    }
}

socket.emit('joinRoom', roomId);
createMessage(username + " joined the battle!", 2);

socket.on('messageReceived', (data) => {
    updateChat(data);
});

socket.on('notificationReceived', (data) => {
    updateChat(data);
});

document.getElementById('trigger').addEventListener('click', () => {
    const msg = messageInput.value;
    if(!msg) return;
    createMessage(msg,0);
    messageInput.value = '';
});