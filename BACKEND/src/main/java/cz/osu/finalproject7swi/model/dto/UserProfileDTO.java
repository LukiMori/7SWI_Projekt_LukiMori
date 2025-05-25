package cz.osu.finalproject7swi.model.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDTO {
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
}