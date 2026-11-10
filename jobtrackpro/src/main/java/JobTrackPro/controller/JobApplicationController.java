package JobTrackPro.controller;

import JobTrackPro.entity.JobApplication;
import JobTrackPro.service.JobApplicationService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/job-applications")
@CrossOrigin(origins = "*")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    // Constructor injection
    public JobApplicationController(
            JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    // 1. Add a new job application
    @PostMapping
    public ResponseEntity<JobApplication> addJobApplication(
            @RequestBody JobApplication application) {

        JobApplication savedApplication =
                jobApplicationService.addJobApplication(application);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedApplication);
    }

    // 2. Get all job applications
    @GetMapping
    public ResponseEntity<List<JobApplication>> getAllJobApplications() {

        return ResponseEntity.ok(
                jobApplicationService.getAllJobApplications());
    }

    // 3. Get a job application by ID
    @GetMapping("/{id}")
    public ResponseEntity<JobApplication> getJobApplicationById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                jobApplicationService.getJobApplicationById(id));
    }

    // 4. Update a job application
    @PutMapping("/{id}")
    public ResponseEntity<JobApplication> updateJobApplication(
            @PathVariable Long id,
            @RequestBody JobApplication application) {

        return ResponseEntity.ok(
                jobApplicationService.updateJobApplication(
                        id, application));
    }

    // 5. Delete a job application
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobApplication(
            @PathVariable Long id) {

        jobApplicationService.deleteJobApplication(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats() {

        Map<String, Long> stats = new HashMap<>();

        stats.put("totalApplications",
                jobApplicationService.getTotalApplications());
        stats.put("applied",
                jobApplicationService.getApplicationCountByStatus("Applied"));

        stats.put("interviews",
                jobApplicationService.getApplicationCountByStatus("Interview Scheduled"));

        stats.put("offers",
                jobApplicationService.getApplicationCountByStatus("Offer"));

        stats.put("rejected",
                jobApplicationService.getApplicationCountByStatus("Rejected"));

        return ResponseEntity.ok(stats);
    }
    @GetMapping("/status/{status}")
    public ResponseEntity<List<JobApplication>> getApplicationsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                jobApplicationService.getApplicationsByStatus(status));
    }
    @GetMapping("/search")
    public ResponseEntity<List<JobApplication>> searchByCompanyName(
            @RequestParam String companyName) {

        return ResponseEntity.ok(
                jobApplicationService.searchByCompanyName(companyName));
    }

    @GetMapping("/page")
    public ResponseEntity<Page<JobApplication>> getPaginatedApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size);

        return ResponseEntity.ok(
                jobApplicationService.getPaginatedApplications(pageable));
    }

}