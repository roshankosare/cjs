package com.cjs.cjs_service.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cjs.cjs_service.model.Tag;

public interface TagRepository extends JpaRepository<Tag,Integer> {
    
    Optional<Tag> findByName(String name);
}
