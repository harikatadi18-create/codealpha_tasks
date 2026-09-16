import java.util.*;

public class NLPProcessor {

    public String preprocess(String input) {

        if (input == null) {
            return "";
        }

        return input
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    public Intent detectIntent(String input) {

        String text = preprocess(input);

        if (text.isEmpty()) {
            return Intent.UNKNOWN;
        }

        Map<Intent, String[]> keywords = new LinkedHashMap<>();

        keywords.put(Intent.GREETING,
                new String[]{
                        "hello", "hi", "hey", "greetings"
                });

        keywords.put(Intent.JAVA,
                new String[]{
                        "java", "jdk", "jvm",
                        "java programming"
                });

        keywords.put(Intent.DSA,
                new String[]{
                        "dsa", "data structure",
                        "data structures",
                        "algorithm", "algorithms"
                });

        keywords.put(Intent.COLLEGE,
                new String[]{
                        "college", "university",
                        "campus", "student"
                });

        keywords.put(Intent.INTERNSHIP,
                new String[]{
                        "internship", "intern",
                        "training", "industrial training"
                });

        keywords.put(Intent.PROJECT,
                new String[]{
                        "project",
                        "software project",
                        "application",
                        "build project"
                });

        keywords.put(Intent.HELP,
                new String[]{
                        "help",
                        "what can you do",
                        "how can you help",
                        "features"
                });

        keywords.put(Intent.THANKS,
                new String[]{
                        "thank you",
                        "thanks",
                        "thank"
                });

        keywords.put(Intent.GOODBYE,
                new String[]{
                        "bye",
                        "goodbye",
                        "see you",
                        "exit",
                        "quit"
                });

        Intent bestIntent = Intent.UNKNOWN;
        int highestScore = 0;

        for (Map.Entry<Intent, String[]> entry : keywords.entrySet()) {

            int score = 0;

            for (String keyword : entry.getValue()) {

                String cleanKeyword = preprocess(keyword);

                if (text.contains(cleanKeyword)) {

                    if (cleanKeyword.contains(" ")) {
                        score += 2;
                    } else {
                        score += 1;
                    }
                }
            }

            if (score > highestScore) {
                highestScore = score;
                bestIntent = entry.getKey();
            }
        }

        return bestIntent;
    }
}