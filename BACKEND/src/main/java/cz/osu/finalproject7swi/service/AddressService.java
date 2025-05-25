package cz.osu.finalproject7swi.service;

import cz.osu.finalproject7swi.model.dto.AddressDTO;
import cz.osu.finalproject7swi.model.entity.Address;
import cz.osu.finalproject7swi.model.entity.AppUser;
import cz.osu.finalproject7swi.model.repository.AddressRepository;
import cz.osu.finalproject7swi.service.result.AddressSaveResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public AddressSaveResult saveAddress(AppUser user, AddressDTO dto) {
        boolean exists = addressRepository.existsByUserAndStreetAndHouseNumberAndCityAndZipCodeAndCountry(
                user, dto.getStreet(), dto.getHouseNumber(), dto.getCity(), dto.getZipCode(), dto.getCountry()
        );

        if (exists) return AddressSaveResult.DUPLICATE;

        Address address = AddressMapper.toEntity(dto, user);
        addressRepository.save(address);
        return AddressSaveResult.SUCCESS;
    }

    public List<AddressDTO> getUserAddresses(AppUser user) {
        return addressRepository.findAllByUser(user).stream()
                .map(AddressMapper::toDto)
                .toList();
    }
}
