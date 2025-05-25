package cz.osu.finalproject7swi.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "cart_item")
public class CartItem {
    @EmbeddedId
    private CartItemKey id;
    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id", nullable = false, insertable = false, updatable = false)
    private Product product;
    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name="user_id", nullable = false, insertable = false, updatable = false)
    @JsonBackReference
    private AppUser user;
    @Column(nullable = false)
    private int quantity;
}