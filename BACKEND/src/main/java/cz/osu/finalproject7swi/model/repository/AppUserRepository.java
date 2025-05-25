package cz.osu.finalproject7swi.model.repository;

import cz.osu.finalproject7swi.model.entity.AppUser;
import org.springframework.data.repository.CrudRepository;

public interface AppUserRepository extends CrudRepository<AppUser, Long> {
    AppUser findByEmail(String email);
    boolean existsByEmailIgnoreCase(String email);
}
