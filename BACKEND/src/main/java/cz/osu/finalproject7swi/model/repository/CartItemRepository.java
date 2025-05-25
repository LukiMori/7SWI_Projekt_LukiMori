package cz.osu.finalproject7swi.model.repository;

import cz.osu.finalproject7swi.model.entity.CartItem;
import cz.osu.finalproject7swi.model.entity.CartItemKey;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, CartItemKey> {
    List<CartItem> findByUserId(Long userId);
}