package JobTrackPro.repository;

import JobTrackPro.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long> {

    long countByStatus(String status);
    List<JobApplication> findByStatus(String status);
    List<JobApplication> findByCompanyNameContainingIgnoreCase(
            String companyName);

}
