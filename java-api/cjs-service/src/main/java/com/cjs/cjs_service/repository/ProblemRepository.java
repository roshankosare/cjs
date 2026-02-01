package com.cjs.cjs_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cjs.cjs_service.model.Problem;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProblemRepository extends JpaRepository<Problem, Integer>, JpaSpecificationExecutor<Problem> {

    public Optional<Problem> findBySlug(String slug);
}
