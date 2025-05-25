package cz.osu.finalproject7swi.controller;

import cz.osu.finalproject7swi.model.dto.CartItemRequest;
import cz.osu.finalproject7swi.model.dto.CartItemResponse;
import cz.osu.finalproject7swi.model.dto.StockCheckResponse;
import cz.osu.finalproject7swi.model.entity.AppUser;
import cz.osu.finalproject7swi.service.CartService;
import cz.osu.finalproject7swi.util.UserUtil;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartItemRequest request) {
        AppUser user = UserUtil.getCurrentUser();
        cartService.addToCart(user, request);
        return ResponseEntity.ok("Product added to cart");
    }

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getUserCart() {
        AppUser user = UserUtil.getCurrentUser();
        List<CartItemResponse> response = cartService.getUserCart(user);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/update")
    public ResponseEntity<String> updateCartItem(@RequestBody CartItemRequest request) {
        AppUser user = UserUtil.getCurrentUser();
        String response = cartService.updateCartItem(user, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/check-availability")
    public ResponseEntity<List<StockCheckResponse>> checkAvailability(@RequestBody List<CartItemRequest> cartItems) {
        List<StockCheckResponse> issues = cartService.checkStockAvailability(cartItems);
        return ResponseEntity.ok(issues);
    }

    @PostMapping("/confirm-order")
    public ResponseEntity<?> confirmOrder(
            @RequestParam Long addressId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate deliveryDate) {
        AppUser user = UserUtil.getCurrentUser();
        return cartService.confirmOrder(user, addressId, deliveryDate);
    }
}
