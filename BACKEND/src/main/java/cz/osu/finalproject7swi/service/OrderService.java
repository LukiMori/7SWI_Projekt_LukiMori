package cz.osu.finalproject7swi.service;

import cz.osu.finalproject7swi.model.dto.OrderInformationDTO;
import cz.osu.finalproject7swi.model.dto.OrderItemDTO;
import cz.osu.finalproject7swi.model.entity.AppUser;
import cz.osu.finalproject7swi.model.entity.OrderInformation;
import cz.osu.finalproject7swi.model.repository.OrderInformationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderInformationRepository orderRepository;

    public OrderService(OrderInformationRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<OrderInformationDTO> getOrdersForUser(AppUser user) {
        List<OrderInformation> orders = orderRepository.findByUserId(user.getId());

        return orders.stream().map(order -> {
            OrderInformationDTO dto = new OrderInformationDTO();
            dto.setId(order.getId());
            dto.setStatus(order.getStatus());
            dto.setDeliveryDate(order.getDeliveryDate());
            dto.setTotalPrice(order.getTotalPrice());

            dto.setAddress(String.format(
                    "%s %s, %s %s, %s",
                    order.getAddress().getStreet(),
                    order.getAddress().getHouseNumber(),
                    order.getAddress().getZipCode(),
                    order.getAddress().getCity(),
                    order.getAddress().getCountry()
            ));

            List<OrderItemDTO> itemDTOs = order.getOrderItems().stream().map(item -> {
                OrderItemDTO i = new OrderItemDTO();
                i.setId(item.getProduct().getId());
                i.setProductName(item.getProduct().getName());
                i.setQuantity(item.getQuantity());
                i.setPriceAtTime(item.getPriceAtTime());
                return i;
            }).toList();

            dto.setItems(itemDTOs);
            return dto;
        }).toList();
    }
}
