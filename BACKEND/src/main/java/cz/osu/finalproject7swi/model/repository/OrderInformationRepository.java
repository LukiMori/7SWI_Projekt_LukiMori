package cz.osu.finalproject7swi.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import cz.osu.finalproject7swi.model.entity.OrderInformation;
import java.util.List;

public interface OrderInformationRepository extends JpaRepository<OrderInformation, Long> {
    List<OrderInformation> findByUserId(Long userId);
}
