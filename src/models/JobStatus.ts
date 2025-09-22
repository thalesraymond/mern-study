/**
 * Represents the possible statuses for a job application.
 *
 * @enum {string}
 * @property {string} INTERVIEW - The job application is in the interview stage.
 * @property {string} DECLINED - The job application has been declined.
 * @property {string} PENDING - The job application is pending and awaiting a decision.
 */
enum JobStatus {
  INTERVIEW = "interview",
  DECLINED = "declined",
  PENDING = "pending",
}

export default JobStatus;
