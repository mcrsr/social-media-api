document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('auth-form');
    const postForm = document.getElementById('post-form');
    const messageForm = document.getElementById('message-form');
    const authButton = document.getElementById('auth-button');
    const registerButton = document.getElementById('register-button');

    const postsSection = document.getElementById('posts-section');
    const usersSection = document.getElementById('users-section');
    const messagesSection = document.getElementById('messages-section');

    const mainContent = document.getElementById('main-content');

    const showSection = (sectionId) => {
        document.querySelectorAll('section').forEach(section => section.classList.add('hidden'));
        document.getElementById(sectionId).classList.remove('hidden');
    };

    document.getElementById('home-link').addEventListener('click', () => showSection('auth-section'));
    document.getElementById('posts-link').addEventListener('click', () => showSection('posts-section'));
    document.getElementById('users-link').addEventListener('click', () => showSection('users-section'));
    document.getElementById('messages-link').addEventListener('click', () => showSection('messages-section'));
    document.getElementById('logout-link').addEventListener('click', () => {
        localStorage.removeItem('token');
        showSection('auth-section');
    });

    authButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('token', result.token);
            showSection('posts-section');
        } else {
            alert(result.message);
        }
    });

    registerButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        alert(result.message);
    });

    postForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const content = document.getElementById('post-content').value;

        const token = localStorage.getItem('token');
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        const result = await response.json();
        alert(result.message);
        if (response.ok) {
            loadPosts();
        }
    });

    messageForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const receiverId = document.getElementById('receiver-id').value;
        const content = document.getElementById('message-content').value;

        const token = localStorage.getItem('token');
        const response = await fetch(`/api/users/${receiverId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        const result = await response.json();
        alert(result.message);
        if (response.ok) {
            loadMessages(receiverId);
        }
    });

    const loadPosts = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/posts', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const posts = await response.json();
        const postsList = document.getElementById('posts-list');
        postsList.innerHTML = posts.map(post => `<div><h3>Post ${post.id}</h3><p>${post.content}</p></div>`).join('');
    };

    const loadMessages = async (userId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/users/${userId}/messages`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const messages = await response.json();
        const messagesList = document.getElementById('messages-list');
        messagesList.innerHTML = messages.map(message => `<div><p>${message.content}</p></div>`).join('');
    };
});
