package com.cjs.auth_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cjs.auth_service.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    public Optional<User> findUserByUsername(String username);

    public Optional<User> findUserByEmail(String email);

}
