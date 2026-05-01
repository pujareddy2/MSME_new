package com.sih.backend.repository;

import com.sih.backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleNameIgnoreCase(String roleName);
    boolean existsByRoleNameIgnoreCase(String roleName);
}