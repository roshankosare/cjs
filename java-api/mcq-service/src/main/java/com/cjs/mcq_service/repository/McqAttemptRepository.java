package com.cjs.mcq_service.repository;

import com.cjs.mcq_service.model.McqAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface McqAttemptRepository extends JpaRepository<McqAttempt, Long> {
    List<McqAttempt> findByQuizSessionId(Long quizSessionId);
    List<McqAttempt> findByUserIdAndQuestionId(Long userId, Long questionId);
    java.util.Optional<McqAttempt> findByQuizSessionIdAndQuestionId(Long quizSessionId, Long questionId);
}