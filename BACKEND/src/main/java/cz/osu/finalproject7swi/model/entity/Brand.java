package cz.osu.finalproject7swi.model.entity;

import jakarta.persistence.*;
import lombok.*;

@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "brand")
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "brand_sequence")
    @SequenceGenerator(name = "brand_sequence", sequenceName = "BRAND_SEQ", allocationSize = 1)
    private int id;
    @Column(nullable = false, unique = true)
    private String name;
    @Column
    private String url;
    @Column
    private String description;
}