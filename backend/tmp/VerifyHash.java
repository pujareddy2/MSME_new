import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class VerifyHash {
    public static void main(String[] args) {
        String raw = "1234";
        String hash = "";
        System.out.println(new BCryptPasswordEncoder().matches(raw, hash));
    }
}
