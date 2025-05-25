package cz.osu.finalproject7swi.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_sequence")
    @SequenceGenerator(name = "product_sequence", sequenceName = "PRODUCT_SEQ", allocationSize = 1)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column
    private String imageUrl;
    @Column(nullable = false)
    private int quantityInStock;
    @Column(nullable = false)
    private double price;
    @Column
    private String description;
    @ManyToOne
    @JoinColumn(name="category_id", nullable = false)
    private ProductCategory category;
    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

}
