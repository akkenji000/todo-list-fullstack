package com.ToDo.todolist.model;

import lombok.Data;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
public class Task {
    @Id
    private String id;
    @Setter
    private User user;
    private String title;
    private String description;
    private Boolean completed = Boolean.FALSE;
}



