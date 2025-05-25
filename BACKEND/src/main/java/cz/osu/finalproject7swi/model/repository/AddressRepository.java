package cz.osu.finalproject7swi.model.repository;

import cz.osu.finalproject7swi.model.entity.AppUser;
import cz.osu.finalproject7swi.model.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findAllByUser(AppUser user);
    boolean existsByUserAndStreetAndHouseNumberAndCityAndZipCodeAndCountry(
            AppUser user,
            String street,
            String houseNumber,
            String city,
            String zipCode,
            String country
    );
}