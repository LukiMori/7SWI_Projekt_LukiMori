package cz.osu.finalproject7swi.controller;

import cz.osu.finalproject7swi.model.dto.*;
import cz.osu.finalproject7swi.model.entity.AppUser;
import cz.osu.finalproject7swi.model.repository.AppUserRepository;
import cz.osu.finalproject7swi.service.AuthService;
import cz.osu.finalproject7swi.util.UserUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final AuthService authService;


    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegistrationRequest registrationDTO) {
        String result = authService.register(
                registrationDTO.getEmail(),
                registrationDTO.getPassword(),
                registrationDTO.getFirstName(),
                registrationDTO.getLastName(),
                registrationDTO.getPhoneNumber(),
                registrationDTO.getAddress()
        );

        boolean isDuplicate = result.equals("Email je již zaregistrován.");
        return new ResponseEntity<>(result, isDuplicate ? HttpStatus.BAD_REQUEST : HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequest loginDTO) {
        try {
            AuthTokenResponse authTokenResponse = authService.login(loginDTO.getEmail(), loginDTO.getPassword());
            return new ResponseEntity<>(authTokenResponse, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile() {
        AppUser user = UserUtil.getCurrentUser();
        UserProfileDTO dto = new UserProfileDTO(
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber()
        );
        return ResponseEntity.ok(dto);
    }


    @PutMapping("/profile/update")
    public ResponseEntity<?> updateUser(@RequestBody Map<String, String> changes) {
        AppUser user = UserUtil.getCurrentUser();
        try {
            UserProfileDTO updated = authService.updateUserProfile(user, changes);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Nepodařilo se uložit profil.");
        }
    }

}
