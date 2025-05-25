package cz.osu.finalproject7swi.service;

import cz.osu.finalproject7swi.model.dto.CartItemRequest;
import cz.osu.finalproject7swi.model.dto.CartItemResponse;
import cz.osu.finalproject7swi.model.dto.StockCheckResponse;
import cz.osu.finalproject7swi.model.entity.*;
import cz.osu.finalproject7swi.model.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final OrderInformationRepository orderInformationRepository;
    private final AddressRepository addressRepository;

    public CartService(CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       OrderInformationRepository orderInformationRepository,
                       AddressRepository addressRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.orderInformationRepository = orderInformationRepository;
        this.addressRepository = addressRepository;
    }

    public void addToCart(AppUser user, CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Produkt nebyl nalezen."));

        CartItemKey key = new CartItemKey(user.getId(), product.getId());

        CartItem cartItem = cartItemRepository.findById(key).orElse(
                new CartItem(key, product, user, 0)
        );
        cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());

        cartItemRepository.save(cartItem);
    }

    public List<CartItemResponse> getUserCart(AppUser user) {
        return cartItemRepository.findByUserId(user.getId())
                .stream()
                .map(item -> new CartItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getImageUrl(),
                        item.getProduct().getPrice(),
                        item.getQuantity()
                ))
                .toList();
    }

    public String updateCartItem(AppUser user, CartItemRequest request) {
        CartItemKey key = new CartItemKey(user.getId(), request.getProductId());
        CartItem cartItem = cartItemRepository.findById(key)
                .orElseThrow(() -> new RuntimeException("Položka v košíku nebyla nalezena."));

        if (request.getQuantity() < 1) {
            cartItemRepository.deleteById(key);
            return "Item removed from cart";
        }

        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.save(cartItem);

        return "Quantity updated";
    }

    public List<StockCheckResponse> checkStockAvailability(List<CartItemRequest> cartItems) {
        List<StockCheckResponse> problems = new ArrayList<>();

        for (CartItemRequest item : cartItems) {
            Product product = productRepository.findById(item.getProductId()).orElse(null);
            if (product == null || product.getQuantityInStock() < item.getQuantity()) {
                StockCheckResponse response = new StockCheckResponse();
                response.setProductId(item.getProductId());
                response.setProductName(product != null ? product.getName() : "Neznámý produkt");
                response.setAvailable(product != null ? product.getQuantityInStock() : 0);
                response.setRequested(item.getQuantity());
                problems.add(response);
            }
        }

        return problems;
    }

    @Transactional
    public ResponseEntity<?> confirmOrder(AppUser user, Long addressId, LocalDate deliveryDate) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());

        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body("Košík je prázdný.");
        }

        List<StockCheckResponse> stockIssues = new ArrayList<>();
        for (CartItem item : cartItems) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Produkt nenalezen."));
            if (product.getQuantityInStock() < item.getQuantity()) {
                StockCheckResponse response = new StockCheckResponse();
                response.setProductId(product.getId());
                response.setProductName(product.getName());
                response.setAvailable(product.getQuantityInStock());
                response.setRequested(item.getQuantity());
                stockIssues.add(response);
            }
        }

        if (!stockIssues.isEmpty()) {
            return ResponseEntity.status(409).body(stockIssues);
        }

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Adresa nenalezena."));

        OrderInformation order = new OrderInformation();
        order.setUser(user);
        order.setAddress(address);
        order.setDeliveryDate(deliveryDate);
        order.setStatus("PŘIJATA");

        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0.0;

        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            int quantity = item.getQuantity();

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(quantity);
            orderItem.setPriceAtTime(product.getPrice());
            orderItem.setOrderInformation(order);

            orderItems.add(orderItem);

            product.setQuantityInStock(product.getQuantityInStock() - quantity);
            productRepository.save(product);

            total += quantity * product.getPrice();
        }

        order.setTotalPrice(total);
        order.setOrderItems(orderItems);
        orderInformationRepository.save(order);

        cartItemRepository.deleteAll(cartItems);

        return ResponseEntity.ok("Objednávka byla úspěšně vytvořena.");
    }
}
