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

function createChatContent(tag, className, content) {
    const element = document.createElement(tag);
    element.className = className; // Usamos className en lugar de classType
    element.textContent = content;
    return element;
}

function updateChat(data) {
    const chatContainer = document.getElementById('messages');

    // Crear el contenido del mensaje basado en el tipo de data
    if (data.type === 0) {
        // Mensaje propio o de otro usuario
        const isOwnMessage = data.username === username;
        const messageContainer = document.createElement('div');
        const messageClass = isOwnMessage ? 'own-message' : 'other-message';
        messageContainer.className = `message ${messageClass}`;

        // Agregar el nombre del usuario en un elemento separado
        const usernameElement = createChatContent('div', 'message-username', data.username);
        messageContainer.appendChild(usernameElement);

        // Agregar el contenido del mensaje en otro elemento
        const messageElement = createChatContent('div', 'message-content', data.message);
        messageContainer.appendChild(messageElement);

        chatContainer.appendChild(messageContainer);
    } else if (data.type === 2) {
        // Notification
        const notificationElement = createChatContent('div', 'notification', data.message);
        chatContainer.appendChild(notificationElement);
    }

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

window.addEventListener('beforeunload', () => {
    createMessage(username + " left the battle!", 2);
    sessionStorage.removeItem("username");
})

document.getElementById('trigger').addEventListener('click', () => {
    const msg = messageInput.value;
    if(!msg) return;
    createMessage(msg,0);
    messageInput.value = '';
});