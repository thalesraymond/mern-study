import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import { Link, Form } from "react-router-dom";
import Wrapper from "../assets/wrappers/Job";
import JobInfo from "./JobInfo";
import day from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
day.extend(advancedFormat);

const Job = ({
    id,
    position,
    company,
    location,
    jobType,
    createdAt,
    status,
}: {
    id: string;
    position: string;
    company: string;
    location: string;
    jobType: string;
    createdAt: Date;
    status: string;
}) => {
    const date = day(createdAt).format("MMM Do, YYYY");

    return (
        <Wrapper>
            <header>
                <div className="main-icon">{company.charAt(0)}</div>
                <div className="info">
                    <h5>{position}</h5>
                    <p>{company}</p>
                </div>
            </header>
            <div className="content">
                <div className="content-center">
                    <JobInfo icon={<FaLocationArrow />} text={location} />
                    <JobInfo icon={<FaCalendarAlt />} text={date} />
                    <JobInfo icon={<FaBriefcase />} text={jobType} />
                    <div className={`status ${status}`}>{status}</div>
                </div>

                <footer className="actions">
                    <Link className="btn edit-btn" to={`../edit-job/${id}`}>
                        Edit
                    </Link>
                    <Form>
                        <button type="submit" className="btn delete-btn">
                            Delete
                        </button>
                    </Form>
                </footer>
            </div>
        </Wrapper>
    );
};

export default Job;
