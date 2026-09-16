public class Reservation {

    private String bookingId;
    private Customer customer;
    private Room room;
    private String checkInDate;
    private String checkOutDate;
    private int numberOfNights;
    private double totalAmount;
    private String paymentStatus;
    private String reservationStatus;

    public Reservation(String bookingId, Customer customer, Room room,
                       String checkInDate, String checkOutDate,
                       int numberOfNights, double totalAmount) {

        this.bookingId = bookingId;
        this.customer = customer;
        this.room = room;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.numberOfNights = numberOfNights;
        this.totalAmount = totalAmount;
        this.paymentStatus = "Pending";
        this.reservationStatus = "Confirmed";
    }

    public String getBookingId() {
        return bookingId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public Room getRoom() {
        return room;
    }

    public String getCheckInDate() {
        return checkInDate;
    }

    public String getCheckOutDate() {
        return checkOutDate;
    }

    public int getNumberOfNights() {
        return numberOfNights;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public String getReservationStatus() {
        return reservationStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public void cancelReservation() {
        this.reservationStatus = "Cancelled";
        this.room.setAvailable(true);
    }

    public void displayBookingDetails() {

        System.out.println("\n========== BOOKING DETAILS ==========");
        System.out.println("Booking ID       : " + bookingId);
        System.out.println("Customer Name    : " + customer.getName());
        System.out.println("Phone Number     : " + customer.getPhone());
        System.out.println("Room Number      : " + room.getRoomNumber());
        System.out.println("Room Category    : " + room.getCategory());
        System.out.println("Price/Night      : ₹" + room.getPricePerNight());
        System.out.println("Check-in Date    : " + checkInDate);
        System.out.println("Check-out Date   : " + checkOutDate);
        System.out.println("Number of Nights : " + numberOfNights);
        System.out.println("Total Amount     : ₹" + totalAmount);
        System.out.println("Payment Status   : " + paymentStatus);
        System.out.println("Reservation      : " + reservationStatus);
        System.out.println("=====================================");
    }
}