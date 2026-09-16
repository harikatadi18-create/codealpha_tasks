import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ChatHistory {

    private static final String FILE_PATH =
            "data/chat_history.txt";

    public void saveMessage(String userMessage, String botResponse) {

        try {

            File dataFolder = new File("data");

            if (!dataFolder.exists()) {
                dataFolder.mkdir();
            }

            try (BufferedWriter writer = new BufferedWriter(
                    new FileWriter(FILE_PATH, true))) {

                String time = LocalDateTime.now()
                        .format(DateTimeFormatter.ofPattern(
                                "dd-MM-yyyy HH:mm:ss"));

                writer.write("[" + time + "]");
                writer.newLine();

                writer.write("User: " + userMessage);
                writer.newLine();

                writer.write("SmartBot: " + botResponse);
                writer.newLine();

                writer.write("----------------------------------------");
                writer.newLine();
            }

        } catch (IOException e) {

            System.out.println(
                    "Error saving chat history: "
                    + e.getMessage()
            );
        }
    }

    public void displayHistory() {

        File file = new File(FILE_PATH);

        if (!file.exists()) {
            System.out.println("\nNo chat history found.");
            return;
        }

        System.out.println("\n========== CHAT HISTORY ==========");

        try (BufferedReader reader =
                     new BufferedReader(new FileReader(file))) {

            String line;

            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }

        } catch (IOException e) {

            System.out.println(
                    "Error reading chat history: "
                    + e.getMessage()
            );
        }

        System.out.println("==================================");
    }
}