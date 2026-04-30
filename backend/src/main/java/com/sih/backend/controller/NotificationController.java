package com.sih.backend.controller;

import com.sih.backend.dto.ActivityLogRequest;
import com.sih.backend.dto.NotificationRequest;
import com.sih.backend.dto.NotificationResponse;
import com.sih.backend.service.NotificationService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/user/{userId}")
    public List<NotificationResponse> getNotifications(@PathVariable Long userId) {
        return notificationService.getNotifications(userId);
    }

    @GetMapping("/{userId}")
    public List<NotificationResponse> getNotificationsLegacy(@PathVariable Long userId) {
        return notificationService.getNotifications(userId);
    }

    @PostMapping
    public void createNotification(@RequestBody NotificationRequest request) {
        if (request == null || request.getUserId() == null || request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "userId and message are required");
        }
        notificationService.createNotification(request.getUserId(), request.getMessage().trim(), request.getType());
    }

    @PostMapping("/activity")
    public void createActivity(@RequestBody ActivityLogRequest request) {
        if (request == null || request.getUserId() == null || request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "userId and message are required");
        }
        notificationService.createNotification(request.getUserId(), request.getMessage().trim(), "GENERAL");
    }

    @PutMapping("/read/{id}")
    public NotificationResponse markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }
}
