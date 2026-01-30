package com.ToDo.todolist.controller;


import com.ToDo.todolist.model.Task;
import com.ToDo.todolist.service.TaskService;
import com.ToDo.todolist.service.UserService;
import com.ToDo.todolist.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(){
        var tasks = this.taskService.findAll();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> findById(@PathVariable String id){
        var task = this.taskService.findById(id);
        return ResponseEntity.ok(task);
    }

    @PostMapping
    public ResponseEntity<Task> save(@RequestBody Task task){
        task = this.taskService.save(task);
        return  ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    @GetMapping("/{id}/completed")
    public ResponseEntity<Void> completed(@PathVariable String id){
        this.taskService.completed(id);
        return  ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id){
        this.taskService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@RequestBody Task task, @PathVariable String id){
        task.setId(id);

        //Chama o save
        var updatedTask = this.taskService.save(task);

        return ResponseEntity.ok(updatedTask);
    }
}
