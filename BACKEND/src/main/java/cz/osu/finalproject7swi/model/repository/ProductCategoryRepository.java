package cz.osu.finalproject7swi.model.repository;

import cz.osu.finalproject7swi.model.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {

}
