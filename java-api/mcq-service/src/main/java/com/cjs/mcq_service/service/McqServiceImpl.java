package com.cjs.mcq_service.service;

import com.cjs.mcq_service.dto.request.CreateMcqDto;
import com.cjs.mcq_service.dto.request.SubmitMcqAnswerDto;
import com.cjs.mcq_service.dto.request.SaveMcqAttemptDto;
import com.cjs.mcq_service.dto.response.*;
import com.cjs.mcq_service.model.McqQuestion;
import com.cjs.mcq_service.model.QuizSession;
import com.cjs.mcq_service.model.McqAttempt;
import com.cjs.mcq_service.repository.McqQuestionRepository;
import com.cjs.mcq_service.repository.QuizSessionRepository;
import com.cjs.mcq_service.repository.McqAttemptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class McqServiceImpl implements McqService {
    
    private final McqQuestionRepository questionRepository;
    private final QuizSessionRepository sessionRepository;
    private final McqAttemptRepository attemptRepository;
    
    @Override
    public McqQuestionWithAnswerDto createQuestion(CreateMcqDto dto, Long createdBy) {
        McqQuestion question = new McqQuestion();
        question.setQuestion(dto.getQuestion());
        question.setOptionA(dto.getOptionA());
        question.setOptionB(dto.getOptionB());
        question.setOptionC(dto.getOptionC());
        question.setOptionD(dto.getOptionD());
        question.setCorrectOption(dto.getCorrectOption());
        question.setCorrectExplanation(dto.getCorrectExplanation());
        question.setIncorrectExplanationA(dto.getIncorrectExplanationA());
        question.setIncorrectExplanationB(dto.getIncorrectExplanationB());
        question.setIncorrectExplanationC(dto.getIncorrectExplanationC());
        question.setIncorrectExplanationD(dto.getIncorrectExplanationD());
        question.setCategory(dto.getCategory());
        question.setDifficulty(dto.getDifficulty());
        question.setCreatedBy(createdBy);
        
        McqQuestion saved = questionRepository.save(question);
        return mapToWithAnswerDto(saved);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<McqQuestionWithAnswerDto> getAllQuestions(String category) {
        List<McqQuestion> questions = category != null ? 
            questionRepository.findByCategory(category) : 
            questionRepository.findAll();
        
        return questions.stream()
            .map(this::mapToWithAnswerDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<String> getCategories() {
        return questionRepository.findDistinctCategories();
    }
    
    @Override
    @Transactional(readOnly = true)
    public McqQuestionWithAnswerDto getQuestionById(Long id) {
        McqQuestion question = questionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Question not found"));
        return mapToWithAnswerDto(question);
    }
    
    @Override
    public McqQuestionWithAnswerDto updateQuestion(Long id, CreateMcqDto dto) {
        McqQuestion question = questionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Question not found"));
        
        question.setQuestion(dto.getQuestion());
        question.setOptionA(dto.getOptionA());
        question.setOptionB(dto.getOptionB());
        question.setOptionC(dto.getOptionC());
        question.setOptionD(dto.getOptionD());
        question.setCorrectOption(dto.getCorrectOption());
        question.setCorrectExplanation(dto.getCorrectExplanation());
        question.setIncorrectExplanationA(dto.getIncorrectExplanationA());
        question.setIncorrectExplanationB(dto.getIncorrectExplanationB());
        question.setIncorrectExplanationC(dto.getIncorrectExplanationC());
        question.setIncorrectExplanationD(dto.getIncorrectExplanationD());
        question.setCategory(dto.getCategory());
        question.setDifficulty(dto.getDifficulty());
        
        McqQuestion updated = questionRepository.save(question);
        return mapToWithAnswerDto(updated);
    }
    
    @Override
    public boolean deleteQuestion(Long id) {
        if (questionRepository.existsById(id)) {
            questionRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    @Override
    public QuizSessionDto startQuiz(Integer questionCount, String category, String difficulty, Long userId) {
        // 1. Fetch random questions
        List<McqQuestion> questions = questionRepository.findRandomQuestions(
            "All".equals(category) ? null : category, 
            "All".equals(difficulty) ? null : difficulty, 
            questionCount
        );

        if (questions.isEmpty()) {
            throw new RuntimeException("No questions available for the selected criteria.");
        }

        // 2. Create and save session
        QuizSession session = new QuizSession();
        session.setUserId(userId);
        session.setTotalQuestions(questions.size());
        QuizSession savedSession = sessionRepository.save(session);

        // 3. Create placeholder attempts for all selected questions
        List<McqAttempt> placeholderAttempts = questions.stream().map(q -> {
            McqAttempt attempt = new McqAttempt();
            attempt.setUserId(userId);
            attempt.setQuizSessionId(savedSession.getId());
            attempt.setQuestionId(q.getId());
            // isCorrect and selectedOption remain null
            return attempt;
        }).collect(Collectors.toList());

        attemptRepository.saveAll(placeholderAttempts);

        return mapToSessionDto(savedSession);
    }
    
    @Override
    public McqAttemptResultDto submitAnswer(SubmitMcqAnswerDto dto, Long userId) {
        McqQuestion question = questionRepository.findById(dto.getQuestionId())
            .orElseThrow(() -> new RuntimeException("Question not found"));
        
        QuizSession session = sessionRepository.findById(dto.getQuizSessionId())
            .orElseThrow(() -> new RuntimeException("Quiz session not found"));

        if (session.getIsCompleted()) {
            throw new RuntimeException("Quiz session is already completed.");
        }
        
        // Find existing placeholder attempt or create one
        McqAttempt attempt = attemptRepository.findByQuizSessionIdAndQuestionId(dto.getQuizSessionId(), dto.getQuestionId())
            .orElseGet(() -> {
                McqAttempt newAttempt = new McqAttempt();
                newAttempt.setUserId(userId);
                newAttempt.setQuizSessionId(dto.getQuizSessionId());
                newAttempt.setQuestionId(dto.getQuestionId());
                return newAttempt;
            });
        
        // Prevent double submission for the same question if already answered
        if (attempt.getSelectedOption() != null) {
            // Option already selected, we'll just update it or throw? Let's allow update but log it.
        }

        boolean isCorrect = question.getCorrectOption().equals(dto.getSelectedOption());
        
        attempt.setSelectedOption(dto.getSelectedOption());
        attempt.setIsCorrect(isCorrect);
        attempt.setAttemptedAt(java.time.LocalDateTime.now());
        
        attemptRepository.save(attempt);
        
        // Update session stats
        updateSessionStats(session);
        
        McqAttemptResultDto result = new McqAttemptResultDto();
        result.setIsCorrect(isCorrect);
        result.setCorrectOption(question.getCorrectOption());
        result.setExplanation(question.getCorrectExplanation());
        result.setQuizSession(mapToSessionDto(session));
        
        return result;
    }

    private void updateSessionStats(QuizSession session) {
        List<McqAttempt> attempts = attemptRepository.findByQuizSessionId(session.getId());
        long correct = attempts.stream().filter(a -> Boolean.TRUE.equals(a.getIsCorrect())).count();
        long incorrect = attempts.stream().filter(a -> Boolean.FALSE.equals(a.getIsCorrect())).count();
        long totalAnswered = correct + incorrect;

        session.setCorrectAnswers((int) correct);
        session.setIncorrectAnswers((int) incorrect);
        
        if (totalAnswered > 0) {
            session.setScorePercentage((double) correct / session.getTotalQuestions() * 100);
        }

        if (totalAnswered >= session.getTotalQuestions()) {
            session.setIsCompleted(true);
            session.setCompletedAt(java.time.LocalDateTime.now());
        }
        
        sessionRepository.save(session);
    }
    
    @Override
    @Transactional(readOnly = true)
    public QuizResultDto getQuizResult(Long sessionId, Long userId) {
        QuizSession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Quiz session not found"));
        
        List<McqAttempt> attempts = attemptRepository.findByQuizSessionId(sessionId);
        
        QuizResultDto result = new QuizResultDto();
        result.setSession(mapToSessionDto(session));
        result.setAttempts(attempts.stream()
            .map(this::mapToAttemptDetailDto)
            .collect(Collectors.toList()));
        
        return result;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<QuizSessionDto> getUserQuizHistory(Long userId) {
        List<QuizSession> sessions = sessionRepository.findByUserIdOrderByStartedAtDesc(userId);
        return sessions.stream()
            .map(this::mapToSessionDto)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<McqQuestionDto> getQuizQuestions(Long sessionId) {
        List<McqAttempt> attempts = attemptRepository.findByQuizSessionId(sessionId);
        return attempts.stream()
            .map(attempt -> mapToQuestionDto(attempt.getQuestion()))
            .collect(Collectors.toList());
    }
    
    @Override
    public void saveAttempt(SaveMcqAttemptDto dto, Long userId) {
        McqAttempt attempt = new McqAttempt();
        attempt.setUserId(userId);
        attempt.setQuizSessionId(dto.getQuizSessionId());
        attempt.setQuestionId(dto.getQuestionId());
        attempt.setSelectedOption(dto.getSelectedOption());
        attempt.setIsCorrect(dto.getIsCorrect());
        
        attemptRepository.save(attempt);
    }
    
    private McqQuestionWithAnswerDto mapToWithAnswerDto(McqQuestion question) {
        McqQuestionWithAnswerDto dto = new McqQuestionWithAnswerDto();
        dto.setId(question.getId());
        dto.setQuestion(question.getQuestion());
        dto.setOptionA(question.getOptionA());
        dto.setOptionB(question.getOptionB());
        dto.setOptionC(question.getOptionC());
        dto.setOptionD(question.getOptionD());
        dto.setCorrectOption(question.getCorrectOption());
        dto.setCorrectExplanation(question.getCorrectExplanation());
        dto.setIncorrectExplanationA(question.getIncorrectExplanationA());
        dto.setIncorrectExplanationB(question.getIncorrectExplanationB());
        dto.setIncorrectExplanationC(question.getIncorrectExplanationC());
        dto.setIncorrectExplanationD(question.getIncorrectExplanationD());
        dto.setCategory(question.getCategory());
        dto.setDifficulty(question.getDifficulty());
        dto.setCreatedAt(question.getCreatedAt());
        return dto;
    }
    
    private McqQuestionDto mapToQuestionDto(McqQuestion question) {
        McqQuestionDto dto = new McqQuestionDto();
        dto.setId(question.getId());
        dto.setQuestion(question.getQuestion());
        dto.setOptionA(question.getOptionA());
        dto.setOptionB(question.getOptionB());
        dto.setOptionC(question.getOptionC());
        dto.setOptionD(question.getOptionD());
        dto.setCategory(question.getCategory());
        dto.setDifficulty(question.getDifficulty());
        dto.setCreatedAt(question.getCreatedAt());
        return dto;
    }
    
    private QuizSessionDto mapToSessionDto(QuizSession session) {
        QuizSessionDto dto = new QuizSessionDto();
        dto.setId(session.getId());
        dto.setTotalQuestions(session.getTotalQuestions());
        dto.setCorrectAnswers(session.getCorrectAnswers());
        dto.setIncorrectAnswers(session.getIncorrectAnswers());
        dto.setScorePercentage(session.getScorePercentage());
        dto.setStartedAt(session.getStartedAt());
        dto.setCompletedAt(session.getCompletedAt());
        dto.setIsCompleted(session.getIsCompleted());
        return dto;
    }
    
    private McqAttemptDetailDto mapToAttemptDetailDto(McqAttempt attempt) {
        McqAttemptDetailDto dto = new McqAttemptDetailDto();
        dto.setQuestionId(attempt.getQuestionId());
        dto.setQuestion(attempt.getQuestion().getQuestion());
        dto.setSelectedOption(attempt.getSelectedOption());
        dto.setCorrectOption(attempt.getQuestion().getCorrectOption());
        dto.setIsCorrect(attempt.getIsCorrect());
        dto.setExplanation(attempt.getQuestion().getCorrectExplanation());
        return dto;
    }
}