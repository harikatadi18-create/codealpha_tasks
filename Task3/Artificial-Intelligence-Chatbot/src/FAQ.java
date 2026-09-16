public class FAQ {

    private String question;
    private String answer;
    private Intent intent;

    public FAQ(String question, String answer, Intent intent) {
        this.question = question;
        this.answer = answer;
        this.intent = intent;
    }

    public String getQuestion() {
        return question;
    }

    public String getAnswer() {
        return answer;
    }

    public Intent getIntent() {
        return intent;
    }
}