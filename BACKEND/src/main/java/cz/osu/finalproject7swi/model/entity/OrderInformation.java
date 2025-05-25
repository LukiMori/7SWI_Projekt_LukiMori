package cz.osu.finalproject7swi.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "order_information")
public class OrderInformation {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private AppUser user;
    @ManyToOne
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;
    @Column(nullable = false)
    private LocalDate deliveryDate;
    @Column(nullable = false)
    private String status;
    @Column(nullable = false)
    private double totalPrice;
    @OneToMany(mappedBy = "orderInformation", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;
}
