document.addEventListener('DOMContentLoaded', () => {

    // 1. Dark/Light Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (body.getAttribute('data-theme') === 'dark') {
                body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // 2. Terminal Typing Effect
    const typingText = document.getElementById('typing-text');
    const terminalOutput = document.getElementById('terminal-output');
    
    if (typingText) {
        const textToType = "run profile.exe --verbose";
        let index = 0;
        
        // Wait 1 second before starting to type
        setTimeout(() => {
            const typingInterval = setInterval(() => {
                if (index < textToType.length) {
                    typingText.textContent += textToType.charAt(index);
                    index++;
                } else {
                    clearInterval(typingInterval);
                    // Show output after typing finishes
                    setTimeout(() => {
                        if (terminalOutput) {
                            terminalOutput.classList.remove('hidden');
                            terminalOutput.classList.add('visible');
                        }
                    }, 500);
                }
            }, 100); // typing speed
        }, 1000);
    }

    // 3. Chatbot Logic
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotBody = document.getElementById('chatbot-body');
    const chatbotIcon = document.getElementById('chatbot-icon');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    // Store chat history so the bot remembers the conversation
    let chatHistory = [];

    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', () => {
            chatbotBody.classList.toggle('hidden');
            if (chatbotBody.classList.contains('hidden')) {
                chatbotIcon.classList.remove('fa-chevron-down');
                chatbotIcon.classList.add('fa-chevron-up');
            } else {
                chatbotIcon.classList.remove('fa-chevron-up');
                chatbotIcon.classList.add('fa-chevron-down');
                chatInput.focus();
            }
        });
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message');
        msgDiv.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');
        // Render text preserving some basic formatting if needed, but textContent is safer
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function handleChat() {
        const text = chatInput.value.trim();
        if (!text) return;

        // User message
        appendMessage(text, 'user');
        chatInput.value = '';

        // Show typing indicator
        const typingId = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot-message');
        typingDiv.id = typingId;
        typingDiv.textContent = 'Typing...';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            // Call out to the local Node.js server, passing both message and history
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: text, history: chatHistory })
            });

            // Remove typing indicator
            const indicator = document.getElementById(typingId);
            if (indicator) indicator.remove();

            if (!response.ok) {
                appendMessage('Oops! The server ran into an error.', 'bot');
                return;
            }

            const data = await response.json();
            const botReply = data.response;
            appendMessage(botReply, 'bot');
            
            // Save the exchange to history so the bot remembers it next time!
            chatHistory.push({ role: 'user', parts: [{ text: text }] });
            chatHistory.push({ role: 'model', parts: [{ text: botReply }] });
        } catch (error) {
            console.error('Chat error:', error);
            // Remove typing indicator
            const indicator = document.getElementById(typingId);
            if (indicator) indicator.remove();
            
            appendMessage('Unable to connect to the Node.js server. Make sure it is running on port 3000!', 'bot');
        }
    }

    if (chatSend) {
        chatSend.addEventListener('click', handleChat);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChat();
        });
    }

});
