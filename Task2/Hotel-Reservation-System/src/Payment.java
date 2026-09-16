public class Payment {

    private String paymentMethod;
    private double amount;
    private String paymentStatus;

    public Payment(String paymentMethod, double amount) {
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.paymentStatus = "Pending";
    }

    public boolean processPayment() {

        System.out.println("\n========== PAYMENT ==========");
        System.out.println("Payment Method : " + paymentMethod);
        System.out.println("Amount         : ₹" + amount);

        // Payment simulation
        paymentStatus = "Paid";

        System.out.println("Payment Status : " + paymentStatus);
        System.out.println("Payment successful!");
        System.out.println("=============================");

        return true;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public double getAmount() {
        return amount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }
}