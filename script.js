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

    const botResponses = {
        "skills": "I specialize in web development, focusing on HTML, CSS, JavaScript, and learning frameworks like React and Express. I also code in Python!",
        "contact": "You can reach me via email using the button at the top or connect with me on LinkedIn/GitHub!",
        "projects": "I've built several projects like FourStack (a Connect Four + Tetris mashup) and an Expense Tracker in Python. Check out the Recent Projects section!",
        "default": "That's interesting! I'm an automated assistant, but feel free to ask me about Arthur's 'skills', 'projects', or 'contact' info."
    };

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message');
        msgDiv.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleChat() {
        const text = chatInput.value.trim();
        if (!text) return;

        // User message
        appendMessage(text, 'user');
        chatInput.value = '';

        // Bot response
        setTimeout(() => {
            let reply = botResponses["default"];
            const lowerText = text.toLowerCase();
            
            if (lowerText.includes('skill') || lowerText.includes('tech') || lowerText.includes('stack')) {
                reply = botResponses["skills"];
            } else if (lowerText.includes('contact') || lowerText.includes('email') || lowerText.includes('reach')) {
                reply = botResponses["contact"];
            } else if (lowerText.includes('project') || lowerText.includes('portfolio') || lowerText.includes('build')) {
                reply = botResponses["projects"];
            }

            appendMessage(reply, 'bot');
        }, 600);
    }

    if (chatSend) {
        chatSend.addEventListener('click', handleChat);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChat();
        });
    }

});
