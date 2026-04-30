package com.sih.backend.repository;

import com.sih.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmailIgnoreCase(String email);

	Optional<User> findByPhoneNumberIgnoreCase(String phoneNumber);

	boolean existsByEmailIgnoreCase(String email);

	boolean existsByPhoneNumberIgnoreCase(String phoneNumber);

	List<User> findByRoleNameIgnoreCase(String roleName);
}
