import java.util.*;

public class Main {

    private static Scanner scanner = new Scanner(System.in);
    private static List<Room> rooms = new ArrayList<>();
    private static List<Reservation> reservations = new ArrayList<>();

    public static void main(String[] args) {

        FileManager.initializeFiles();

        rooms = FileManager.loadRooms();

        // Add default rooms if the file is empty
        if (rooms.isEmpty()) {
            addDefaultRooms();
            FileManager.saveRooms(rooms);
        }

        System.out.println("========================================");
        System.out.println("     WELCOME TO HOTEL RESERVATION");
        System.out.println("              SYSTEM");
        System.out.println("========================================");

        while (true) {

            displayMenu();

            int choice = readInt("Enter your choice: ");

            switch (choice) {

                case 1:
                    searchRooms();
                    break;

                case 2:
                    makeReservation();
                    break;

                case 3:
                    viewBooking();
                    break;

                case 4:
                    cancelReservation();
                    break;

                case 5:
                    FileManager.displaySavedReservations();
                    break;

                case 6:
                    System.out.println("\nThank you for using Hotel Reservation System!");
                    scanner.close();
                    return;

                default:
                    System.out.println("\nInvalid choice. Please try again.");
            }
        }
    }

    // Main menu
    private static void displayMenu() {

        System.out.println("\n========== MAIN MENU ==========");
        System.out.println("1. Search Available Rooms");
        System.out.println("2. Make Reservation");
        System.out.println("3. View Booking Details");
        System.out.println("4. Cancel Reservation");
        System.out.println("5. View All Saved Bookings");
        System.out.println("6. Exit");
        System.out.println("===============================");
    }

    // Add default hotel rooms
    private static void addDefaultRooms() {

        rooms.add(new Room(101, "Standard", 1500));
        rooms.add(new Room(102, "Standard", 1500));
        rooms.add(new Room(201, "Deluxe", 2500));
        rooms.add(new Room(202, "Deluxe", 2500));
        rooms.add(new Room(301, "Suite", 4000));
        rooms.add(new Room(302, "Suite", 4000));
    }

    // Search rooms
    private static void searchRooms() {

        System.out.println("\n========== SEARCH ROOMS ==========");
        System.out.println("1. All Available Rooms");
        System.out.println("2. Standard");
        System.out.println("3. Deluxe");
        System.out.println("4. Suite");

        int choice = readInt("Choose category: ");

        String category = "";

        switch (choice) {

            case 1:
                category = "All";
                break;

            case 2:
                category = "Standard";
                break;

            case 3:
                category = "Deluxe";
                break;

            case 4:
                category = "Suite";
                break;

            default:
                System.out.println("Invalid category.");
                return;
        }

        boolean found = false;

        System.out.println("\nAvailable Rooms:");
        System.out.println("----------------------------------------");

        for (Room room : rooms) {

            if (room.isAvailable() &&
                (category.equals("All") ||
                 room.getCategory().equalsIgnoreCase(category))) {

                room.displayRoom();
                found = true;
            }
        }

        if (!found) {
            System.out.println("No rooms available in this category.");
        }
    }

    // Make reservation
    private static void makeReservation() {

        System.out.println("\n========== MAKE RESERVATION ==========");

        searchRooms();

        int roomNumber = readInt("\nEnter room number to book: ");

        Room selectedRoom = findRoom(roomNumber);

        if (selectedRoom == null) {
            System.out.println("Room not found.");
            return;
        }

        if (!selectedRoom.isAvailable()) {
            System.out.println("Sorry, this room is already booked.");
            return;
        }

        scanner.nextLine();

        System.out.print("Enter customer name: ");
        String name = scanner.nextLine().trim();

        if (name.isEmpty()) {
            System.out.println("Customer name cannot be empty.");
            return;
        }

        System.out.print("Enter phone number: ");
        String phone = scanner.nextLine().trim();

        if (phone.isEmpty()) {
            System.out.println("Phone number cannot be empty.");
            return;
        }

        System.out.print("Enter check-in date (DD-MM-YYYY): ");
        String checkIn = scanner.nextLine().trim();

        System.out.print("Enter check-out date (DD-MM-YYYY): ");
        String checkOut = scanner.nextLine().trim();

        int nights = readInt("Enter number of nights: ");

        if (nights <= 0) {
            System.out.println("Number of nights must be greater than 0.");
            return;
        }

        double totalAmount =
                selectedRoom.getPricePerNight() * nights;

        System.out.println("\n========== BOOKING SUMMARY ==========");
        System.out.println("Customer       : " + name);
        System.out.println("Room Number    : " + selectedRoom.getRoomNumber());
        System.out.println("Category       : " + selectedRoom.getCategory());
        System.out.println("Price/Night    : ₹" + selectedRoom.getPricePerNight());
        System.out.println("Check-in       : " + checkIn);
        System.out.println("Check-out      : " + checkOut);
        System.out.println("Nights         : " + nights);
        System.out.println("Total Amount   : ₹" + totalAmount);
        System.out.println("=====================================");

        scanner.nextLine();

        System.out.println("\nSelect Payment Method:");
        System.out.println("1. UPI");
        System.out.println("2. Card");
        System.out.println("3. Cash");

        int paymentChoice = readInt("Choose payment method: ");

        String paymentMethod;

        switch (paymentChoice) {

            case 1:
                paymentMethod = "UPI";
                break;

            case 2:
                paymentMethod = "Card";
                break;

            case 3:
                paymentMethod = "Cash";
                break;

            default:
                System.out.println("Invalid payment method.");
                return;
        }

        Payment payment =
                new Payment(paymentMethod, totalAmount);

        boolean paymentSuccessful = payment.processPayment();

        if (!paymentSuccessful) {
            System.out.println("Payment failed. Reservation cancelled.");
            return;
        }

        String bookingId = generateBookingId();

        Customer customer =
                new Customer(name, phone);

        Reservation reservation =
                new Reservation(
                        bookingId,
                        customer,
                        selectedRoom,
                        checkIn,
                        checkOut,
                        nights,
                        totalAmount
                );

        reservation.setPaymentStatus(
                payment.getPaymentStatus()
        );

        selectedRoom.setAvailable(false);

        reservations.add(reservation);

        FileManager.saveReservation(reservation);
        FileManager.saveRooms(rooms);

        System.out.println("\n========================================");
        System.out.println("       RESERVATION SUCCESSFUL!");
        System.out.println("       Booking ID: " + bookingId);
        System.out.println("========================================");
    }

    // View booking details
    private static void viewBooking() {

        System.out.println("\n========== VIEW BOOKING ==========");

        scanner.nextLine();

        System.out.print("Enter Booking ID: ");
        String bookingId = scanner.nextLine().trim();

        Reservation reservation =
                findReservation(bookingId);

        if (reservation != null) {
            reservation.displayBookingDetails();
        } else {
            System.out.println("Booking not found in current session.");
            System.out.println(
                    "Use option 5 to view bookings saved in the file."
            );
        }
    }

    // Cancel reservation
    private static void cancelReservation() {

        System.out.println("\n========== CANCEL RESERVATION ==========");

        scanner.nextLine();

        System.out.print("Enter Booking ID: ");
        String bookingId = scanner.nextLine().trim();

        Reservation reservation =
                findReservation(bookingId);

        if (reservation == null) {
            System.out.println("Booking not found in current session.");
            return;
        }

        if (reservation.getReservationStatus().equals("Cancelled")) {
            System.out.println("This reservation is already cancelled.");
            return;
        }

        reservation.cancelReservation();

        FileManager.saveRooms(rooms);

        System.out.println("\nReservation cancelled successfully.");
        System.out.println(
                "Room " + reservation.getRoom().getRoomNumber()
                + " is now available."
        );
    }

    // Find room
    private static Room findRoom(int roomNumber) {

        for (Room room : rooms) {

            if (room.getRoomNumber() == roomNumber) {
                return room;
            }
        }

        return null;
    }

    // Find reservation
    private static Reservation findReservation(String bookingId) {

        for (Reservation reservation : reservations) {

            if (reservation.getBookingId().equalsIgnoreCase(bookingId)) {
                return reservation;
            }
        }

        return null;
    }

    // Generate booking ID
    private static String generateBookingId() {

        return "B" + (1001 + reservations.size());
    }

    // Read integer safely
    private static int readInt(String message) {

        while (true) {

            System.out.print(message);

            if (scanner.hasNextInt()) {
                return scanner.nextInt();
            }

            System.out.println("Please enter a valid number.");
            scanner.next();
        }
    }
}