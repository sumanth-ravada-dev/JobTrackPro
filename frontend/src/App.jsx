
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [stats, setStats] = useState({
  totalApplications: 0,
  applied: 0,
  interviews: 0,
  offers: 0,
  rejected: 0,
  
});
const [showForm, setShowForm] = useState(false);
const [editingId, setEditingId] = useState(null);
const [formData, setFormData] = useState({
  companyName: "",
  jobTitle: "",
  location: "",
  status: "Applied",
  applicationDate: new Date().toISOString().split("T")[0],
  jobDescription: "",
  notes: "",
});

const [formMessage, setFormMessage] = useState("");
const [saving, setSaving] = useState(false);

const [loading, setLoading] = useState(true);
const [applications, setApplications] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("All");

const filteredApplications = applications.filter((application) => {
  const matchesSearch =
    (application.companyName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (application.jobTitle || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "All" ||
    application.status === statusFilter;

  return matchesSearch && matchesStatus;
});

const [applicationsLoading, setApplicationsLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  fetch("http://localhost:8080/api/job-applications/stats")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load application statistics");
      }
      return response.json();
    })
    .then((data) => {
      setStats(data);
      setError("");
    })
    .catch(() => {
      setError("Could not connect to the backend. Check Spring Boot.");
    })
    .finally(() => {
      setLoading(false);
    });
}, []);


useEffect(() => {
  fetch("http://localhost:8080/api/job-applications")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load applications");
      }
      return response.json();
    })
    .then((data) => {
      setApplications(data);
    })
    .catch((error) => {
      console.error("Error loading applications:", error);
    })
    .finally(() => {
      setApplicationsLoading(false);
    });
}, []);

  const menuItems = [
    "Overview",
    "My Applications",
    "Interviews",
    "Settings",
  ];
  const handleFormChange = (event) => {
  const { name, value } = event.target;

  setFormData((previous) => ({
    ...previous,
    [name]: value,
  }));
};


const handleAddApplication = async (event) => {
  event.preventDefault();
  setSaving(true);
  setFormMessage("");

  try {
    const isEditing = editingId !== null;

    const response = await fetch(
      isEditing
        ? `http://localhost:8080/api/job-applications/${editingId}`
        : "http://localhost:8080/api/job-applications",
      {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      throw new Error(
        isEditing
          ? "Failed to update application"
          : "Failed to save application"
      );
    }

    const savedApplication = await response.json();

    if (isEditing) {
      setApplications((previous) =>
        previous.map((application) =>
          application.id === editingId
            ? savedApplication
            : application
        )
      );
    } else {
      setApplications((previous) => [
        savedApplication,
        ...previous,
      ]);
    }

    const statsResponse = await fetch(
      "http://localhost:8080/api/job-applications/stats"
    );

    if (statsResponse.ok) {
      const updatedStats = await statsResponse.json();
      setStats(updatedStats);
    }

    setFormData({
      companyName: "",
      jobTitle: "",
      location: "",
      status: "Applied",
      applicationDate: new Date().toISOString().split("T")[0],
      jobDescription: "",
      notes: "",
    });

    setEditingId(null);
    setShowForm(false);
    setFormMessage(
      isEditing
        ? "Application updated successfully!"
        : "Application saved successfully!"
    );
  } catch (error) {
    setFormMessage(error.message);
  } finally {
    setSaving(false);
  }
};


const handleDeleteApplication = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this application?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `http://localhost:8080/api/job-applications/${id}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      throw new Error("Failed to delete application");
    }

    const deletedApplication = applications.find(
      (application) => application.id === id
    );

    setApplications((previous) =>
      previous.filter((application) => application.id !== id)
    );

    setStats((previous) => ({
      ...previous,
      totalApplications: Math.max(
        0,
        previous.totalApplications - 1
      ),
      applied: Math.max(
        0,
        previous.applied -
          (deletedApplication?.status === "Applied" ? 1 : 0)
      ),
      interviews: Math.max(
        0,
        previous.interviews -
          (deletedApplication?.status === "Interview Scheduled" ? 1 : 0)
      ),
      offers: Math.max(
        0,
        previous.offers -
          (deletedApplication?.status === "Offer" ? 1 : 0)
      ),
      rejected: Math.max(
        0,
        previous.rejected -
          (deletedApplication?.status === "Rejected" ? 1 : 0)
      ),
    }));
  } catch (error) {
    alert(error.message);
  }
};

const handleEditApplication = (application) => {
  setFormData({
    companyName: application.companyName || "",
    jobTitle: application.jobTitle || "",
    location: application.location || "",
    status: application.status || "Applied",
    applicationDate:
      application.applicationDate ||
      new Date().toISOString().split("T")[0],
    jobDescription: application.jobDescription || "",
    notes: application.notes || "",
  });

  setEditingId(application.id);
  setFormMessage("");
  setShowForm(true);
};


  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="logo">JobTrack<span>Pro</span></h2>

        <p className="menu-label">WORKSPACE</p>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item}
              className={`nav-item ${
                activeTab === item ? "active" : ""
              }`}
              onClick={() => setActiveTab(item)}
            >
              {item === "Overview" && "▦"}
              {item === "My Applications" && "▤"}
              {item === "Interviews" && "◷"}
              {item === "Settings" && "⚙"}
              <span>{item}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="avatar">S</div>
          <div>
            <strong>Sumanth</strong>
            <p>Job Seeker</p>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">JOB SEARCH WORKSPACE</p>
            <h1>{activeTab}</h1>
          </div>
          <div className="topbar-right">
            <span className="status-dot"></span>
            Backend project
          </div>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR CAREER JOURNEY</p>
            <h2>Keep moving forward, Sumanth.</h2>
            <p>
              Organize your applications and keep track of every opportunity.
            </p>
          </div>
          <div className="welcome-icon">↗</div>
        </section>
        {activeTab === "Overview" && (
        <section className="stats-grid">
  <div className="stat-card">
    <p>Total Applications</p>
    <h2>{loading ? "..." : stats.totalApplications}</h2>
    <span>All tracked opportunities</span>
  </div>

  <div className="stat-card">
    <p>Interviews</p>
    <h2>{loading ? "..." : stats.interviews}</h2>
    <span>Interview opportunities</span>
  </div>

  <div className="stat-card">
    <p>Offers</p>
    <h2>{loading ? "..." : stats.offers}</h2>
    <span>Offers received</span>
  </div>

  <div className="stat-card">
    <p>Rejected</p>
    <h2>{loading ? "..." : stats.rejected}</h2>
    <span>Applications declined</span>
  </div>
</section>)}

{activeTab === "Overview" && error && (
  <p role="alert">{error}</p>
)}

        {(activeTab === "Overview" ||
  activeTab === "My Applications") && (
  <section className="applications-panel">
          <div className="panel-heading">
            <div>
              <h2>{activeTab === "Overview" ? "Recent Applications" : activeTab}</h2>
              <p>Your job search activity will appear here.</p>
            </div>
            <button
              className="primary-button"
              onClick={() => {
                  setShowForm((previous) => !previous);
                  setFormMessage("");
              }}
            >
               {showForm ? "Cancel" : "+ Add Application"}
            </button>
          </div>
          {formMessage && (
              <p role="status">{formMessage}</p>
          )}

{showForm && (
  <form
    className="application-form"
    onSubmit={handleAddApplication}
  >
    <h3>
       {editingId !== null ? "Edit Application" : "Add New Application"}
    </h3>

    <div className="form-grid">
      <label>
        Company Name *
        <input
          name="companyName"
          value={formData.companyName}
          onChange={handleFormChange}
          required
        />
      </label>

      <label>
        Job Title *
        <input
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleFormChange}
          required
        />
      </label>

      <label>
        Location
        <input
          name="location"
          value={formData.location}
          onChange={handleFormChange}
        />
      </label>

      <label>
        Status
        <select
          name="status"
          value={formData.status}
          onChange={handleFormChange}
        >
          <option value="Applied">Applied</option>
          <option value="Interview Scheduled">Interview Scheduled</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </label>

      <label>
        Application Date *
        <input
          type="date"
          name="applicationDate"
          value={formData.applicationDate}
          onChange={handleFormChange}
          required
        />
      </label>

      <label>
        Job Description
        <textarea
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleFormChange}
        />
      </label>

      <label className="full-width">
        Notes
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleFormChange}
        />
      </label>
    </div>

    <button className="primary-button"  type="submit" disabled={saving}>
            {saving? "Saving..." : editingId !== null ? "Update Application"
             : "Save Application"}
  
    </button>

  </form>)}

<div className="application-filters">
  <input
    type="text"
    placeholder="Search by company or job title..."
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
  />

  <select
    value={statusFilter}
    onChange={(event) => setStatusFilter(event.target.value)}
  >
    <option value="All">All Statuses</option>
    <option value="Applied">Applied</option>
    <option value="Interview Scheduled">Interview Scheduled</option>
    <option value="Offer">Offer</option>
    <option value="Rejected">Rejected</option>
  </select>
</div>

    
{applicationsLoading ? (
  <p>Loading applications...</p>
) : applications.length === 0 ? (
  <div className="empty-state">
    <div className="empty-icon">▤</div>
    <h3>No applications yet</h3>
    <p>Add your first job application through your backend API.</p>
  </div>
) : filteredApplications.length === 0 ? (
  <div className="empty-state">
    <div className="empty-icon">⌕</div>
    <h3>No matching applications found</h3>
    <p>
      Try another company name, job title, or application status.
    </p>
  </div>
) : (
  <div className="application-list">
    {filteredApplications.map((application) => (
      <div className="application-row" key={application.id}>
        <div>
          <h3>{application.companyName}</h3>
          <p>{application.jobTitle}</p>
        </div>

        <span className="application-status">
          {application.status}
        </span>

        <span className="application-date">
          {application.applicationDate || "Date not provided"}
        </span>

        <button
          className="edit-button"
          onClick={() => handleEditApplication(application)}
        >
          Edit
        </button>

        <button
          className="delete-button"
          onClick={() => handleDeleteApplication(application.id)}
        >
          Delete
        </button>
      </div>
    ))}
  </div>
)}

        </section>)}

{activeTab === "Interviews" && (
  <section className="applications-panel">
    <div className="panel-heading">
      <div>
        <h2>Upcoming Interviews</h2>
        <p>Track the interviews scheduled with companies.</p>
      </div>
    </div>

    {applications.filter(
      (application) =>
        application.status === "Interview Scheduled"
    ).length === 0 ? (
      <div className="empty-state">
        <h3>No interviews scheduled yet</h3>
        <p>
          Applications marked as Interview Scheduled
          will appear here.
        </p>
      </div>
    ) : (
      applications
        .filter(
          (application) =>
            application.status === "Interview Scheduled"
        )
        .map((application) => (
          <div className="application-row" key={application.id}>
            <div>
              <h3>{application.companyName}</h3>
              <p>{application.jobTitle}</p>
              <p>{application.applicationDate}</p>
            </div>
          </div>
        ))
    )}
  </section>
)}


{activeTab === "Settings" && (
  <section className="applications-panel">
    <div className="panel-heading">
      <div>
        <h2>Settings</h2>
        <p>Manage your JobTrackPro preferences.</p>
      </div>
    </div>

    <div className="application-row">
      <div>
        <h3>Account Information</h3>
        <p>Name: Sumanth</p>
        <p>Role: Job Seeker</p>
      </div>
    </div>

    <div className="application-row">
      <div>
        <h3>Application Filters</h3>
        <p>Reset your search and status filters.</p>
      </div>

      <button
        onClick={() => {
          setSearchTerm("");
          setStatusFilter("All");
          setFormMessage("Filters reset successfully!");
        }}
      >
        Reset Filters
      </button>
    </div>

    <p>{formMessage}</p>
  </section>
)}

      </main>
    </div>
  );
}

export default App;
