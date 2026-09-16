const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");

const STORAGE_KEY = "smartbot_chat_history";


// ===============================
// FAQ KNOWLEDGE BASE
// ===============================

const faqData = {

    greeting: {
        keywords: ["hello", "hi", "hey", "greetings"],
        response:
            "Hello! 👋 Welcome to SmartBot. How can I help you today?"
    },

    java: {
        keywords: ["java", "jdk", "jvm", "java programming"],
        response:
            "Java is a high-level, object-oriented programming language. " +
            "It is widely used for application, web and enterprise development."
    },

    dsa: {
        keywords: [
            "dsa",
            "data structure",
            "data structures",
            "algorithm",
            "algorithms"
        ],
        response:
            "DSA stands for Data Structures and Algorithms. " +
            "Data structures organize information efficiently, while algorithms " +
            "provide steps for solving computational problems."
    },

    oop: {
        keywords: [
            "oop",
            "object oriented",
            "object oriented programming",
            "inheritance",
            "polymorphism",
            "encapsulation",
            "abstraction"
        ],
        response:
            "OOP stands for Object-Oriented Programming. " +
            "Its major concepts include Encapsulation, Inheritance, " +
            "Polymorphism and Abstraction."
    },

    html: {
        keywords: ["html", "web page", "markup"],
        response:
            "HTML stands for HyperText Markup Language. " +
            "It provides the structure and content of web pages."
    },

    css: {
        keywords: ["css", "stylesheet", "styling", "styles"],
        response:
            "CSS stands for Cascading Style Sheets. " +
            "It is used to control the appearance, layout and responsiveness of web pages."
    },

    javascript: {
        keywords: [
            "javascript",
            "js",
            "javascript programming"
        ],
        response:
            "JavaScript is a programming language commonly used to make web pages interactive and dynamic."
    },

    database: {
        keywords: [
            "database",
            "dbms",
            "sql",
            "mysql",
            "database management"
        ],
        response:
            "A database stores and organizes information so that applications can efficiently create, read, update and manage data."
    },

    internship: {
        keywords: [
            "internship",
            "intern",
            "training",
            "industrial training"
        ],
        response:
            "An internship gives students practical experience by allowing them to work on real-world tasks and apply their technical knowledge."
    },

    project: {
        keywords: [
            "project",
            "software project",
            "application",
            "build project"
        ],
        response:
            "A good software project starts with a problem statement, requirements, technology selection, implementation, testing and documentation."
    },

    ai: {
        keywords: [
            "artificial intelligence",
            "ai",
            "machine learning",
            "ml",
            "chatbot"
        ],
        response:
            "Artificial Intelligence enables computer systems to perform tasks that normally require human intelligence. Machine Learning is one approach used to build AI systems."
    },

    nlp: {
        keywords: [
            "nlp",
            "natural language processing",
            "language processing"
        ],
        response:
            "NLP stands for Natural Language Processing. It enables computers to process and understand human language. SmartBot uses text preprocessing and keyword-based intent detection."
    },

    help: {
        keywords: [
            "help",
            "what can you do",
            "how can you help",
            "features"
        ],
        response:
            "I can answer questions about Java, DSA, OOP, HTML, CSS, JavaScript, databases, internships, projects, AI and NLP."
    },

    thanks: {
        keywords: [
            "thank you",
            "thanks",
            "thank"
        ],
        response:
            "You're welcome! 😊 I'm happy to help."
    },

    goodbye: {
        keywords: [
            "bye",
            "goodbye",
            "see you",
            "exit",
            "quit"
        ],
        response:
            "Goodbye! 👋 Keep learning and building great projects!"
    }
};


// ===============================
// TEXT PREPROCESSING
// ===============================

function preprocess(text) {

    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


// ===============================
// NLP INTENT DETECTION
// ===============================

function detectIntent(message) {

    const text = preprocess(message);

    if (!text) {
        return "unknown";
    }

    let bestIntent = "unknown";
    let highestScore = 0;

    for (const intent in faqData) {

        let score = 0;

        faqData[intent].keywords.forEach(keyword => {

            const cleanKeyword = preprocess(keyword);

            if (text.includes(cleanKeyword)) {
                score += cleanKeyword.split(" ").length;
            }
        });

        if (score > highestScore) {
            highestScore = score;
            bestIntent = intent;
        }
    }

    return bestIntent;
}


// ===============================
// RESPONSE GENERATION
// ===============================

function getBotResponse(message) {

    const intent = detectIntent(message);

    if (intent === "unknown") {

        return {
            intent: "UNKNOWN",
            response:
                "I'm not sure about that yet. 🤔 " +
                "Try asking about Java, DSA, OOP, HTML, CSS, JavaScript, " +
                "databases, internships, projects, AI or NLP."
        };
    }

    return {
        intent: intent.toUpperCase(),
        response: faqData[intent].response
    };
}


// ===============================
// SAFE TEXT DISPLAY
// ===============================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ===============================
// ADD MESSAGE
// ===============================

function addMessage(text, sender, intent = "") {

    const message = document.createElement("div");

    message.classList.add(
        "message",
        sender === "user"
            ? "user-message"
            : "bot-message"
    );

    const avatar = sender === "user" ? "👤" : "🤖";
    const name = sender === "user" ? "You" : "SmartBot";

    message.innerHTML = `
        <div class="avatar">${avatar}</div>

        <div class="message-content">

            <div class="message-name">
                ${name}
            </div>

            <div class="bubble">
                ${escapeHTML(text)}
            </div>

            ${
                sender === "bot" && intent
                ? `<div class="intent-label">
                    Intent: ${escapeHTML(intent)}
                   </div>`
                : ""
            }

        </div>
    `;

    chatMessages.appendChild(message);

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


// ===============================
// TYPING INDICATOR
// ===============================

function showTypingIndicator() {

    const typing = document.createElement("div");

    typing.className = "message bot-message";
    typing.id = "typingIndicator";

    typing.innerHTML = `
        <div class="avatar">🤖</div>

        <div class="message-content">

            <div class="message-name">
                SmartBot
            </div>

            <div class="bubble typing">
                <span></span>
                <span></span>
                <span></span>
            </div>

        </div>
    `;

    chatMessages.appendChild(typing);

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


function removeTypingIndicator() {

    const typing =
        document.getElementById("typingIndicator");

    if (typing) {
        typing.remove();
    }
}


// ===============================
// SAVE CHAT
// ===============================

function saveChat() {

    localStorage.setItem(
        STORAGE_KEY,
        chatMessages.innerHTML
    );
}


// ===============================
// LOAD CHAT
// ===============================

function loadChat() {

    const savedChat =
        localStorage.getItem(STORAGE_KEY);

    if (savedChat) {
        chatMessages.innerHTML = savedChat;
    }
}


// ===============================
// SEND MESSAGE
// ===============================

function sendMessage() {

    const message = userInput.value.trim();

    if (!message) {
        return;
    }

    addMessage(message, "user");

    userInput.value = "";

    saveChat();

    showTypingIndicator();

    setTimeout(() => {

        removeTypingIndicator();

        const result =
            getBotResponse(message);

        addMessage(
            result.response,
            "bot",
            result.intent
        );

        saveChat();

    }, 600);
}


// ===============================
// QUICK MESSAGE
// ===============================

function sendQuickMessage(message) {

    userInput.value = message;

    sendMessage();
}


// ===============================
// CLEAR CHAT
// ===============================

function clearChat() {

    localStorage.removeItem(STORAGE_KEY);

    chatMessages.innerHTML = `
        <div class="message bot-message">

            <div class="avatar">🤖</div>

            <div class="message-content">

                <div class="message-name">
                    SmartBot
                </div>

                <div class="bubble">
                    Chat cleared! 👋
                    <br><br>
                    How can I help you?
                </div>

            </div>

        </div>
    `;
}


// ===============================
// ENTER KEY
// ===============================

userInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            sendMessage();
        }
    }
);


// ===============================
// LOAD SAVED CONVERSATION
// ===============================

loadChat();