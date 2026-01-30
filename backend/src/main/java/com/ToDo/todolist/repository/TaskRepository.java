package com.ToDo.todolist.repository;


import com.ToDo.todolist.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends MongoRepository <Task, String> {
}
