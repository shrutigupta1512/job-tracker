import React, { useEffect, useState } from "react";
import API from "../api/axios";
import type { IJob } from "../types";

const statusColors: Record<string, string> = {
  Applied: "primary",
  Interview: "warning",
  Offer: "success",
  Rejected: "danger",
};

const emptyForm = {
  company: "",
  role: "",
  status: "Applied" as IJob["status"],
  dateApplied: new Date().toISOString().split("T")[0],
  jobLink: "",
  notes: "",
};

const Jobs = () => {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchJobs = async () => {
    const res = await API.get("/jobs");
    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await API.put(`/jobs/${editId}`, form);
    } else {
      await API.post("/jobs", form);
    }
    setForm(emptyForm);
    setEditId(null);
    setShowModal(false);
    fetchJobs();
  };

  const handleEdit = (job: IJob) => {
    setForm({
      company: job.company,
      role: job.role,
      status: job.status,
      dateApplied: job.dateApplied.split("T")[0],
      jobLink: job.jobLink || "",
      notes: job.notes || "",
    });
    setEditId(job._id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this application?")) {
      await API.delete(`/jobs/${id}`);
      fetchJobs();
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">💼 My Applications</h2>
        <button className="btn btn-primary"
          onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true); }}>
          + Add Job
        </button>
      </div>
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Date Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    No applications yet. Add your first one!
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job._id}>
                    <td className="fw-semibold">{job.company}</td>
                    <td>{job.role}</td>
                    <td>
                      <span className={`badge bg-${statusColors[job.status]}`}>
                        {job.status}
                      </span>
                    </td>
                    <td>{new Date(job.dateApplied).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => handleEdit(job)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(job._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editId ? "Edit Job" : "Add Job"}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Company</label>
                    <input className="form-control" value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <input className="form-control" value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as IJob["status"] })}>
                      <option>Applied</option>
                      <option>Interview</option>
                      <option>Offer</option>
                      <option>Rejected</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date Applied</label>
                    <input type="date" className="form-control" value={form.dateApplied}
                      onChange={(e) => setForm({ ...form, dateApplied: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Job Link (optional)</label>
                    <input className="form-control" value={form.jobLink}
                      onChange={(e) => setForm({ ...form, jobLink: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Notes (optional)</label>
                    <textarea className="form-control" value={form.notes} rows={3}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary"
                    onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    {editId ? "Update" : "Add Job"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;