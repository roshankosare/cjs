package com.cjs.cjs_service.service;

import com.cjs.cjs_service.dto.TestCaseDto;
import com.cjs.cjs_service.dto.request.CreateProblemDto;
import com.cjs.cjs_service.dto.request.UpdateProblemDto;
import com.cjs.cjs_service.model.Problem;
import com.cjs.cjs_service.model.ProblemTag;
import com.cjs.cjs_service.model.Tag;
import com.cjs.cjs_service.model.TestCase;
import com.cjs.cjs_service.repository.ProblemRepository;
import com.cjs.cjs_service.repository.TagRepository;
import com.cjs.cjs_service.service.ProblemService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final TagRepository tagRepository;

    public ProblemService(ProblemRepository problemRepository, TagRepository tagRepository) {
        this.problemRepository = problemRepository;
        this.tagRepository = tagRepository;
    }

    public Page<Problem> getProblems(
            String difficulty,
            String[] tags,
            Pageable pageable) {
        // For now: simple pagination
        // Later you can add Specification / filtering
        return problemRepository.findAll(pageable);
    }

    public Problem getProblemBySlug(String slug) {
        return problemRepository.findBySlug(slug).orElse(null);
    }

    public Problem getProblemById(Integer id) {
        return problemRepository.findById(id).orElse(null);
    }

    public int createProblem(CreateProblemDto dto) {
        Problem problem = new Problem();
        problem.setTitle(dto.getTitle());
        problem.setDescription(dto.getDescription());
        problem.setDifficulty(dto.getDifficulty());

        List<TestCase> testCases = new ArrayList<>();
        for (TestCaseDto tcDto : dto.getTestCases()) {  
            TestCase tc = new TestCase();
            tc.setInput(tcDto.getInput());
            tc.setExpectedOutput(tcDto.getOutput());
            tc.setSample(tcDto.isSample());
            tc.setProblem(problem);
            testCases.add(tc);
        }

        List<ProblemTag> problemTags = new ArrayList<>();
        for (String rawName : dto.getTags()) {
            String tagName = rawName.trim().toLowerCase();

            Tag tag = tagRepository.findByName(tagName)
                    .orElseGet(() -> {
                        Tag t = new Tag();
                        t.setName(tagName);
                        return tagRepository.save(t);
                    });

            ProblemTag pt = new ProblemTag();
            pt.setProblem(problem);
            pt.setTag(tag); // MapsId fills embedded key
            problemTags.add(pt);
        }

        problem.setSlug(dto.getTitle().toLowerCase().replaceAll("\\s+", "-"));

        problem.setTestCases(testCases);
        problem.setProblemTags(problemTags);    
        Problem saved = problemRepository.save(problem);
        return saved.getId();
    }

    @Transactional
    public boolean updateProblem(int id, UpdateProblemDto dto) {
        Optional<Problem> optionalProblem = problemRepository.findById(id);
        if (optionalProblem.isEmpty()) {
            return false;
        }

        Problem problem = optionalProblem.get();

        // ===============================
        // Basic fields
        // ===============================
        problem.setTitle(dto.getTitle());
        problem.setDescription(dto.getDescription());
        problem.setDifficulty(dto.getDifficulty());
        problem.setUpdatedAt(LocalDateTime.now());

        // ===============================
        // Update TestCases (OK to replace)
        // ===============================
        problem.getTestCases().clear();

        for (TestCaseDto tcDto : dto.getTestCases()) {
            TestCase tc = new TestCase();
            tc.setInput(tcDto.getInput());
            tc.setExpectedOutput(tcDto.getOutput());
            tc.setSample(tcDto.isSample());
            tc.setProblem(problem);
            problem.getTestCases().add(tc);
        }

        // ===============================
        // Update Tags (DIFF-BASED 🔥)
        // ===============================

        // Existing ProblemTags indexed by tagId
        Map<Integer, ProblemTag> existing = problem.getProblemTags()
                .stream()
                .collect(Collectors.toMap(
                        pt -> pt.getTag().getId(),
                        Function.identity()));

        // Incoming tag IDs
        Set<Integer> incomingTagIds = new HashSet<>();

        for (String rawName : dto.getTags()) {
            String tagName = rawName.trim().toLowerCase();

            Tag tag = tagRepository.findByName(tagName)
                    .orElseGet(() -> {
                        Tag t = new Tag();
                        t.setName(tagName);
                        return tagRepository.save(t);
                    });

            incomingTagIds.add(tag.getId());

            // ADD only if not already present
            if (!existing.containsKey(tag.getId())) {
                ProblemTag pt = new ProblemTag();
                pt.setProblem(problem);
                pt.setTag(tag); // MapsId fills embedded key
                problem.getProblemTags().add(pt);
            }
        }

        // REMOVE only those no longer present
        problem.getProblemTags().removeIf(
                pt -> !incomingTagIds.contains(pt.getTag().getId()));

        problemRepository.save(problem);
        return true;
    }

}
