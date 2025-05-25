package cz.osu.finalproject7swi.util;

import cz.osu.finalproject7swi.model.entity.AppUser;
import org.springframework.security.core.context.SecurityContextHolder;

public class UserUtil {
    public static AppUser getCurrentUser() {
        return (AppUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}