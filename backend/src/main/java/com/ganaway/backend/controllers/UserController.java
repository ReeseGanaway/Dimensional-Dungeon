package com.ganaway.backend.controllers;

import com.ganaway.backend.model.User;
import com.ganaway.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;


    //get all characters

    @GetMapping("/get-all-users")
    public List<User> getAllUsers(){
        System.out.println(userRepository.findAll());
        return userRepository.findAll();
    }

    @GetMapping("/create-user")
    public void testCreateUser(){
        User user = new User();
        user.setEmail("r@gmail.com");
        user.setUsername("r");
        user.setPassword("rPass");
        userRepository.save(user);
    }
}
