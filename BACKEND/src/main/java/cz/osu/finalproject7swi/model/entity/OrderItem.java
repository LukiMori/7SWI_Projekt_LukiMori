package cz.osu.finalproject7swi.model.entity;

import jakarta.persistence.*;
import lombok.*;


@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "order_item")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_item_sequence")
    @SequenceGenerator(name = "order_item_sequence", sequenceName = "ORDER_ITEM_SEQ", allocationSize = 1)
    private int id;
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private OrderInformation orderInformation;
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    @Column(nullable = false)
    private int quantity;
    @Column(nullable = false)
    private double priceAtTime;
}
