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

});
