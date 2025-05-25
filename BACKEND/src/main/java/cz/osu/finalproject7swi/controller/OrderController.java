package cz.osu.finalproject7swi.controller;

import cz.osu.finalproject7swi.model.dto.OrderInformationDTO;
import cz.osu.finalproject7swi.model.entity.AppUser;
import cz.osu.finalproject7swi.service.OrderService;
import cz.osu.finalproject7swi.util.UserUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderInformationDTO>> getUserOrders() {
        AppUser user = UserUtil.getCurrentUser();
        List<OrderInformationDTO> orders = orderService.getOrdersForUser(user);
        return ResponseEntity.ok(orders);
    }
}
