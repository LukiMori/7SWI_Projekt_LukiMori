package cz.osu.finalproject7swi.model.dto;

import java.time.LocalDate;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderInformationDTO {
    private Long id;
    private String status;
    private LocalDate deliveryDate;
    private double totalPrice;
    private String address;
    private List<OrderItemDTO> items;
}