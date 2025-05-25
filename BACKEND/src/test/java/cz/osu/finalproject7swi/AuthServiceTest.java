package cz.osu.finalproject7swi;

import cz.osu.finalproject7swi.config.JwtUtil;
import cz.osu.finalproject7swi.model.dto.AuthTokenResponse;
import cz.osu.finalproject7swi.model.entity.Address;
import cz.osu.finalproject7swi.model.entity.AppUser;
import cz.osu.finalproject7swi.model.repository.AppUserRepository;
import cz.osu.finalproject7swi.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private AppUserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtUtil jwtUtil;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(AppUserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtUtil = mock(JwtUtil.class);

        authService = new AuthService(passwordEncoder, userRepository, jwtUtil);
    }

    @Test
    void register_ShouldRegisterNewUser() {
        String email = "test@example.com";
        String rawPassword = "Password123";
        Address address = new Address();
        when(userRepository.existsByEmailIgnoreCase(email)).thenReturn(false);
        when(passwordEncoder.encode(rawPassword)).thenReturn("hashedPassword");

        String result = authService.register(email, rawPassword, "John", "Doe", "123456789", address);

        verify(userRepository).save(Mockito.any(AppUser.class));
        assertEquals("Uživatele s emailem test@example.com zaregistrován.", result);
    }


    @Test
    void login_ShouldReturnTokenOnSuccess() {
        String email = "user@example.com";
        String rawPassword = "Password123";
        String hashedPassword = "hashedPassword";
        String token = "jwtToken";

        AppUser user = new AppUser();
        user.setEmail(email);
        user.setPassword(hashedPassword);

        when(userRepository.findByEmail(email)).thenReturn(user);
        when(passwordEncoder.matches(rawPassword, hashedPassword)).thenReturn(true);
        when(jwtUtil.generateToken(email)).thenReturn(token);

        AuthTokenResponse response = authService.login(email, rawPassword);

        assertEquals(token, response.getToken());
    }

    @Test
    void login_ShouldFailIfUserDoesNotExist() {
        String email = "nonexistent@example.com";
        when(userRepository.findByEmail(email)).thenReturn(null);

        Exception exception = assertThrows(IllegalArgumentException.class, () ->
                authService.login(email, "password")
        );

        assertEquals("Uživatel s tímto emailem neexistuje!", exception.getMessage());
    }

    @Test
    void login_ShouldFailIfPasswordIncorrect() {
        String email = "user@example.com";
        AppUser user = new AppUser();
        user.setEmail(email);
        user.setPassword("hashedPassword");

        when(userRepository.findByEmail(email)).thenReturn(user);
        when(passwordEncoder.matches("wrongPassword", "hashedPassword")).thenReturn(false);

        Exception exception = assertThrows(RuntimeException.class, () ->
                authService.login(email, "wrongPassword")
        );

        assertEquals("Špatné heslo!", exception.getMessage());
    }

}
