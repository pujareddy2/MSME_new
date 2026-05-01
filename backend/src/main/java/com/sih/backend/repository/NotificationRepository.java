package com.sih.backend.repository;

import com.sih.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Timestamp;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Timestamp> {
    List<Notification> findByUser_UserIdOrderByTimestampDesc(Long userId);
}
