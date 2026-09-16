import java.util.*;

public class Chatbot {

    private NLPProcessor nlpProcessor;
    private List<FAQ> faqList;

    public Chatbot() {

        nlpProcessor = new NLPProcessor();
        faqList = new ArrayList<>();

        loadFAQs();
    }

    private void loadFAQs() {

        faqList.add(new FAQ(
                "Hello",
                "Hello! 👋 Welcome to SmartBot. How can I help you today?",
                Intent.GREETING
        ));

        faqList.add(new FAQ(
                "What is Java?",
                "Java is a high-level, object-oriented programming language used to build many types of applications.",
                Intent.JAVA
        ));

        faqList.add(new FAQ(
                "What is DSA?",
                "DSA stands for Data Structures and Algorithms. It helps organize data efficiently and solve computational problems.",
                Intent.DSA
        ));

        faqList.add(new FAQ(
                "What is a college?",
                "A college is an educational institution where students develop academic, technical and professional skills.",
                Intent.COLLEGE
        ));

        faqList.add(new FAQ(
                "What is an internship?",
                "An internship provides students with practical experience and an opportunity to apply their technical knowledge.",
                Intent.INTERNSHIP
        ));

        faqList.add(new FAQ(
                "How do I create a project?",
                "Start by identifying a problem, defining requirements, choosing technologies, implementing the solution and testing it.",
                Intent.PROJECT
        ));

        faqList.add(new FAQ(
                "What can you do?",
                "I can answer frequently asked questions about Java, DSA, college, internships and projects.",
                Intent.HELP
        ));

        faqList.add(new FAQ(
                "Thank you",
                "You're welcome! 😊 I'm happy to help.",
                Intent.THANKS
        ));

        faqList.add(new FAQ(
                "Goodbye",
                "Goodbye! 👋 Have a great day and keep learning!",
                Intent.GOODBYE
        ));
        faqList.add(new FAQ(
        "What is OOP?",
        "OOP stands for Object-Oriented Programming. Its main concepts are Encapsulation, Inheritance, Polymorphism and Abstraction.",
        Intent.JAVA
));

faqList.add(new FAQ(
        "What is an algorithm?",
        "An algorithm is a step-by-step procedure used to solve a problem or perform a computation.",
        Intent.DSA
));

faqList.add(new FAQ(
        "What is a data structure?",
        "A data structure is a way of organizing and storing data so it can be accessed and processed efficiently.",
        Intent.DSA
));

faqList.add(new FAQ(
        "What is an internship?",
        "An internship provides practical experience and helps students apply their technical knowledge to real-world tasks.",
        Intent.INTERNSHIP
));

faqList.add(new FAQ(
        "How do I create a project?",
        "Start with a problem statement, define requirements, select technologies, implement the solution, test it and document the project.",
        Intent.PROJECT
));
    }

    public String getResponse(String userInput) {

        Intent detectedIntent =
                nlpProcessor.detectIntent(userInput);

        for (FAQ faq : faqList) {

            if (faq.getIntent() == detectedIntent) {
                return faq.getAnswer();
            }
        }

        return "I'm sorry, I don't understand that yet. " +
               "Try asking me about Java, DSA, internships, " +
               "college or projects.";
    }
}