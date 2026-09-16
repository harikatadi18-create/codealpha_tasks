import java.io.*;
import java.util.*;

public class FileManager {

    private static final String ROOMS_FILE = "data/rooms.txt";
    private static final String RESERVATIONS_FILE = "data/reservations.txt";

    // Create data folder and files if they don't exist
    public static void initializeFiles() {

        File dataFolder = new File("data");

        if (!dataFolder.exists()) {
            dataFolder.mkdir();
        }

        File roomsFile = new File(ROOMS_FILE);
        File reservationsFile = new File(RESERVATIONS_FILE);

        try {
            if (!roomsFile.exists()) {
                roomsFile.createNewFile();
            }

            if (!reservationsFile.exists()) {
                reservationsFile.createNewFile();
            }
        } catch (IOException e) {
            System.out.println("Error creating data files: " + e.getMessage());
        }
    }

    // Save room information
    public static void saveRooms(List<Room> rooms) {

        try (BufferedWriter writer = new BufferedWriter(
                new FileWriter(ROOMS_FILE))) {

            for (Room room : rooms) {

                writer.write(
                    room.getRoomNumber() + "," +
                    room.getCategory() + "," +
                    room.getPricePerNight() + "," +
                    room.isAvailable()
                );

                writer.newLine();
            }

        } catch (IOException e) {
            System.out.println("Error saving rooms: " + e.getMessage());
        }
    }

    // Load room information
    public static List<Room> loadRooms() {

        List<Room> rooms = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new FileReader(ROOMS_FILE))) {

            String line;

            while ((line = reader.readLine()) != null) {

                String[] data = line.split(",");

                if (data.length == 4) {

                    int roomNumber = Integer.parseInt(data[0]);
                    String category = data[1];
                    double price = Double.parseDouble(data[2]);
                    boolean available = Boolean.parseBoolean(data[3]);

                    Room room = new Room(roomNumber, category, price);
                    room.setAvailable(available);

                    rooms.add(room);
                }
            }

        } catch (IOException | NumberFormatException e) {
            System.out.println("Error loading rooms: " + e.getMessage());
        }

        return rooms;
    }

    // Save reservation information
    public static void saveReservation(Reservation reservation) {

        try (BufferedWriter writer = new BufferedWriter(
                new FileWriter(RESERVATIONS_FILE, true))) {

            writer.write(
                reservation.getBookingId() + "|" +
                reservation.getCustomer().getName() + "|" +
                reservation.getCustomer().getPhone() + "|" +
                reservation.getRoom().getRoomNumber() + "|" +
                reservation.getRoom().getCategory() + "|" +
                reservation.getCheckInDate() + "|" +
                reservation.getCheckOutDate() + "|" +
                reservation.getNumberOfNights() + "|" +
                reservation.getTotalAmount() + "|" +
                reservation.getPaymentStatus() + "|" +
                reservation.getReservationStatus()
            );

            writer.newLine();

        } catch (IOException e) {
            System.out.println(
                "Error saving reservation: " + e.getMessage()
            );
        }
    }

    // Display all stored bookings
    public static void displaySavedReservations() {

        System.out.println("\n========== SAVED BOOKINGS ==========");

        try (BufferedReader reader = new BufferedReader(
                new FileReader(RESERVATIONS_FILE))) {

            String line;
            boolean found = false;

            while ((line = reader.readLine()) != null) {

                if (!line.trim().isEmpty()) {
                    System.out.println(line);
                    found = true;
                }
            }

            if (!found) {
                System.out.println("No bookings found.");
            }

        } catch (IOException e) {
            System.out.println(
                "Error reading reservations: " + e.getMessage()
            );
        }

        System.out.println("====================================");
    }
}