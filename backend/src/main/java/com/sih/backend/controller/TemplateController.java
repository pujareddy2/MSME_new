package com.sih.backend.controller;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/template")
@CrossOrigin(origins = "*")
public class TemplateController {

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadTemplate() {
        String templateContent = "Presentation Template\n====================\n1. Problem Statement\n2. Idea & Abstract\n3. Technology Stack\n4. Prototype/Demo Details";
        ByteArrayResource resource = new ByteArrayResource(templateContent.getBytes());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Project_Template.txt")
                .contentType(MediaType.TEXT_PLAIN)
                .contentLength(resource.contentLength())
                .body(resource);
    }
}
