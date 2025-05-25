package cz.osu.finalproject7swi.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@EqualsAndHashCode
@Embeddable
@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
public class CartItemKey implements Serializable {

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "product_id")
    private Long productId;

}