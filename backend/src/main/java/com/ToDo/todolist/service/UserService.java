package com.ToDo.todolist.service;

import com.ToDo.todolist.model.User;
import com.ToDo.todolist.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> findAll() {
        return this.userRepository.findAll();
    }

    public User findById(String id) {
        return this.userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User save(User user) {
        return this.userRepository.save(user);
    }

    public User update(User user) {
        var userEntity = this.findById(user.getId());
        BeanUtils.copyProperties(user, userEntity, "id");
        return this.userRepository.save(userEntity);
    }

    public void delete(String id){
        this.userRepository.deleteById(id);
    }
}
