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

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const text = await response.text();
            console.log('Login response:', text); // Debugging output

            const result = text ? JSON.parse(text) : {};
            if (response.ok) {
                localStorage.setItem('token', result.token);
                showSection('posts-section');
            } else {
                alert(result.message || 'An error occurred');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login');
        }
    });

    registerButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const text = await response.text();
            console.log('Register response:', text); // Debugging output

            const result = text ? JSON.parse(text) : {};
            alert(result.message || 'An error occurred');
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred during registration');
        }
    });

    postForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const content = document.getElementById('post-content').value;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            });

            const text = await response.text();
            console.log('Post response:', text); // Debugging output

            const result = text ? JSON.parse(text) : {};
            alert(result.message || 'An error occurred');
            if (response.ok) {
                loadPosts();
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('An error occurred while creating the post');
        }
    });

    messageForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const receiverId = document.getElementById('receiver-id').value;
        const content = document.getElementById('message-content').value;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`/api/users/${receiverId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            });

            const text = await response.text();
            console.log('Message response:', text); // Debugging output

            const result = text ? JSON.parse(text) : {};
            alert(result.message || 'An error occurred');
            if (response.ok) {
                loadMessages(receiverId);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('An error occurred while sending the message');
        }
    });

    const loadPosts = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/posts', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const text = await response.text();
            console.log('Posts response:', text); // Debugging output

            const posts = text ? JSON.parse(text) : [];
            const postsList = document.getElementById('posts-list');
            postsList.innerHTML = posts.map(post => `<div><h3>Post ${post.id}</h3><p>${post.content}</p></div>`).join('');
        } catch (error) {
            console.error('Error loading posts:', error);
            alert('An error occurred while loading posts');
        }
    };

    const loadMessages = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`/api/users/${userId}/messages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const text = await response.text();
            console.log('Messages response:', text); // Debugging output

            const messages = text ? JSON.parse(text) : [];
            const messagesList = document.getElementById('messages-list');
            messagesList.innerHTML = messages.map(message => `<div><p>${message.content}</p></div>`).join('');
        } catch (error) {
            console.error('Error loading messages:', error);
            alert('An error occurred while loading messages');
        }
    };
});
