package com.cjs.cjs_service.repository;

import com.cjs.cjs_service.model.Submission;
import com.cjs.cjs_service.model.SubmissionStatus;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SubmissionRepository extends JpaRepository<Submission, Integer> {
   
    List<Submission> findByUserIdAndProblemId(int userId, int problemId);
    List<Submission> findByUserId(int userId);

}
