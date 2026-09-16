import java.util.Scanner;

public class Main {

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);

        Chatbot chatbot = new Chatbot();
        ChatHistory chatHistory = new ChatHistory();

        System.out.println("========================================");
        System.out.println("        🤖 WELCOME TO SMARTBOT");
        System.out.println("        AI FAQ CHATBOT");
        System.out.println("========================================");
        System.out.println("Type 'help' to see what I can answer.");
        System.out.println("Type 'history' to view chat history.");
        System.out.println("Type 'bye' to exit.");
        System.out.println("========================================");

        while (true) {

            System.out.print("\nYou: ");
            String userInput = scanner.nextLine().trim();

            if (userInput.isEmpty()) {
                System.out.println("SmartBot: Please enter a message.");
                continue;
            }

            if (userInput.equalsIgnoreCase("history")) {
                chatHistory.displayHistory();
                continue;
            }

            String response = chatbot.getResponse(userInput);

            System.out.println("SmartBot: " + response);

            chatHistory.saveMessage(userInput, response);

            if (userInput.equalsIgnoreCase("bye")
                    || userInput.equalsIgnoreCase("goodbye")
                    || userInput.equalsIgnoreCase("exit")
                    || userInput.equalsIgnoreCase("quit")) {

                break;
            }
        }

        System.out.println("\nThank you for chatting with SmartBot! 🤖");
        scanner.close();
    }
}