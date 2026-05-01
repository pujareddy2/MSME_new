import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateBcryptHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Generate hashes for team members (phone numbers as passwords)
        String[] passwords = {
            "9999999005",  // member@organization.local
            "9121290912"   // puja
        };
        
        for (String password : passwords) {
            String hash = encoder.encode(password);
            System.out.println("Password: " + password + " => Hash: " + hash);
        }
    }
}
