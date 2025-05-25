package cz.osu.finalproject7swi.service;

import cz.osu.finalproject7swi.model.dto.AddressDTO;
import cz.osu.finalproject7swi.model.entity.Address;
import cz.osu.finalproject7swi.model.entity.AppUser;

public class AddressMapper {
    public static AddressDTO toDto(Address address) {
        AddressDTO dto = new AddressDTO();
        dto.setId(address.getId());
        dto.setStreet(address.getStreet());
        dto.setHouseNumber(address.getHouseNumber());
        dto.setCity(address.getCity());
        dto.setZipCode(address.getZipCode());
        dto.setCountry(address.getCountry());
        return dto;
    }

    public static Address toEntity(AddressDTO dto, AppUser user) {
        Address address = new Address();
        address.setUser(user);
        address.setStreet(dto.getStreet());
        address.setHouseNumber(dto.getHouseNumber());
        address.setCity(dto.getCity());
        address.setZipCode(dto.getZipCode());
        address.setCountry(dto.getCountry());
        return address;
    }
}
