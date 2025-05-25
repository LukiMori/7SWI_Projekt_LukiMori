package cz.osu.finalproject7swi.service;

import cz.osu.finalproject7swi.config.JwtUtil;
import cz.osu.finalproject7swi.model.dto.UserProfileDTO;
import cz.osu.finalproject7swi.model.entity.AppUser;
import cz.osu.finalproject7swi.model.entity.Address;
import cz.osu.finalproject7swi.model.repository.AppUserRepository;
import cz.osu.finalproject7swi.model.dto.AuthTokenResponse;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;


@Service
public class AuthService {
    private final PasswordEncoder passwordEncoder;
    private final AppUserRepository userRepository;
    private final JwtUtil jwtUtil;


    public AuthService(PasswordEncoder passwordEncoder, AppUserRepository userRepository, JwtUtil jwtUtil) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public String register(String email, String rawPassword, String firstName, String lastName, String phoneNumber, Address address) {
        String ret;
        if (userRepository.existsByEmailIgnoreCase(email)) {
            ret = "Email je již zaregistrován.";
        } else {
            AppUser user = new AppUser();
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setPhoneNumber(phoneNumber);
            user.getAddresses().add(address);
            String hashedPassword = passwordEncoder.encode(rawPassword);
            user.setPassword(hashedPassword);
            userRepository.save(user);
            ret = "Uživatele s emailem " + email + " zaregistrován.";
        }

        return ret;
    }

    public AuthTokenResponse login(String email, String rawPassword) {
        AppUser user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(rawPassword, user.getPassword())) {
            String token = jwtUtil.generateToken(user.getEmail());
            return new AuthTokenResponse(token);
        } else if (user == null) {
            throw new IllegalArgumentException("Uživatel s tímto emailem neexistuje!");
        } else {
            throw new RuntimeException("Špatné heslo!");
        }
    }

    public UserProfileDTO updateUserProfile(AppUser user, Map<String, String> changes) {
        if (changes.containsKey("firstName")) user.setFirstName(changes.get("firstName"));
        if (changes.containsKey("lastName")) user.setLastName(changes.get("lastName"));
        if (changes.containsKey("phoneNumber")) user.setPhoneNumber(changes.get("phoneNumber"));

        userRepository.save(user);

        return new UserProfileDTO(
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber()
        );
    }


}
