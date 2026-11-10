package JobTrackPro.service;

import JobTrackPro.entity.JobApplication;
import JobTrackPro.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;

    // Constructor injection
    public JobApplicationService(
            JobApplicationRepository jobApplicationRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
    }

    // Add a new job application
    public JobApplication addJobApplication(JobApplication application) {
        return jobApplicationRepository.save(application);
    }

    // Get all job applications
    public List<JobApplication> getAllJobApplications() {
        return jobApplicationRepository.findAll();
    }

    // Get a job application by ID
    public JobApplication getJobApplicationById(Long id) {
        return jobApplicationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Job application not found with ID: " + id));
    }

    // Update an existing job application
    public JobApplication updateJobApplication(
            Long id, JobApplication updatedApplication) {

        JobApplication existingApplication =
                getJobApplicationById(id);

        existingApplication.setCompanyName(
                updatedApplication.getCompanyName());

        existingApplication.setJobTitle(
                updatedApplication.getJobTitle());

        existingApplication.setLocation(
                updatedApplication.getLocation());

        existingApplication.setStatus(
                updatedApplication.getStatus());

        existingApplication.setApplicationDate(
                updatedApplication.getApplicationDate());

        existingApplication.setJobDescription(
                updatedApplication.getJobDescription());

        existingApplication.setNotes(
                updatedApplication.getNotes());

        return jobApplicationRepository.save(existingApplication);
    }

    // Delete a job application
    public void deleteJobApplication(Long id) {
        JobApplication application = getJobApplicationById(id);
        jobApplicationRepository.delete(application);
    }

    public long getApplicationCountByStatus(String status) {
        return jobApplicationRepository.countByStatus(status);
    }

    public long getTotalApplications() {
        return jobApplicationRepository.count();
    }

    public List<JobApplication> getApplicationsByStatus(String status) {
        return jobApplicationRepository.findByStatus(status);
    }
    public List<JobApplication> searchByCompanyName(String companyName) {
        return jobApplicationRepository
                .findByCompanyNameContainingIgnoreCase(companyName);
    }
    public Page<JobApplication> getPaginatedApplications(
            Pageable pageable) {

        return jobApplicationRepository.findAll(pageable);
    }
}