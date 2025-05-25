package cz.osu.finalproject7swi.model.dto;


import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StockCheckResponse {
    private Long productId;
    private String productName;
    private int available;
    private int requested;
}