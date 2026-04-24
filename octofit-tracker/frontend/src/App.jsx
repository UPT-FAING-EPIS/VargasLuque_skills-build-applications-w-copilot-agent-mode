import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

const emptyStudent = { name: '', grade: 9, team: '' };
const emptyActivity = { student: '', name: '', category: 'Cardio', minutes: 20, calories: 120 };

function App() {
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activities, setActivities] = useState([]);
  const [leaderboard, setLeaderboard] = useState({ students: [], teams: [] });
  const [summary, setSummary] = useState({ teams: [], activity_counts: [] });
  const [studentForm, setStudentForm] = useState(emptyStudent);
  const [activityForm, setActivityForm] = useState(emptyActivity);
  const [editingStudent, setEditingStudent] = useState(null);
  const [message, setMessage] = useState('');

  const studentOptions = useMemo(
    () => students.map((student) => ({ value: student.id, label: `${student.name} (${student.team_name})` })),
    [students]
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sRes, tRes, aRes, lRes, suRes] = await Promise.all([
        axios.get(`${API_BASE}/students/`),
        axios.get(`${API_BASE}/teams/`),
        axios.get(`${API_BASE}/activities/`),
        axios.get(`${API_BASE}/leaderboard/`),
        axios.get(`${API_BASE}/summary/`),
      ]);
      setStudents(sRes.data);
      setTeams(tRes.data);
      setActivities(aRes.data);
      setLeaderboard(lRes.data);
      setSummary(suRes.data);
    } catch (error) {
      setMessage('Unable to connect to backend. Is the Django server running on port 8000?');
    }
  };

  const createStudent = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_BASE}/students/`, studentForm);
      setStudentForm(emptyStudent);
      fetchData();
      setMessage('Student added successfully.');
    } catch (error) {
      setMessage('Error creating student. Check the fields and try again.');
    }
  };

  const updateStudent = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`${API_BASE}/students/${editingStudent.id}/`, studentForm);
      setStudentForm(emptyStudent);
      setEditingStudent(null);
      fetchData();
      setMessage('Student updated successfully.');
    } catch (error) {
      setMessage('Error updating student. Check the fields and try again.');
    }
  };

  const deleteStudent = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(`${API_BASE}/students/${id}/`);
      fetchData();
      setMessage('Student deleted successfully.');
    } catch (error) {
      setMessage('Error deleting student.');
    }
  };

  const createActivity = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_BASE}/activities/`, activityForm);
      setActivityForm(emptyActivity);
      fetchData();
      setMessage('Activity recorded successfully.');
    } catch (error) {
      setMessage('Error recording activity. Check the fields and try again.');
    }
  };

  const startEditStudent = (student) => {
    setStudentForm({ name: student.name, grade: student.grade, team: student.team });
    setEditingStudent(student);
  };

  const cancelEdit = () => {
    setStudentForm(emptyStudent);
    setEditingStudent(null);
  };

  return (
    <div className="app-shell">
      <header>
        <h1>OctoFit Tracker</h1>
        <p>Student fitness tracking, teams, and leaderboard for P.E. classes.</p>
      </header>

      {message && <div className="banner">{message}</div>}

      <section className="grid-two">
        <div className="card">
          <h2>Teams</h2>
          <div className="team-list">
            {teams.map((team) => (
              <div key={team.id} className="team-card" style={{ borderColor: team.color }}>
                <h3>{team.name}</h3>
                <p>Students: {team.student_count || 0}</p>
                <p>Minutes: {team.total_minutes || 0}</p>
                <p>Calories: {team.total_calories || 0}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2>Summary</h2>
          <p>Total teams: {summary.teams.length}</p>
          <p>Activity categories:</p>
          <ul>
            {summary.activity_counts.map((item) => (
              <li key={item.category}>{item.category}: {item.count}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid-two">
        <div className="card">
          <h2>Leaderboard</h2>
          <div className="leaderboard-block">
            <div>
              <h3>Top Students</h3>
              <ol>
                {leaderboard.students.map((item) => (
                  <li key={item.id}>{item.name} ({item.team__name}) — {item.total_minutes || 0} min, {item.total_calories || 0} cal</li>
                ))}
              </ol>
            </div>
            <div>
              <h3>Top Teams</h3>
              <ol>
                {leaderboard.teams.map((item) => (
                  <li key={item.id}>{item.name} — {item.total_minutes || 0} min, {item.total_calories || 0} cal</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Students</h2>
          <div className="student-list">
            {students.map((student) => (
              <div key={student.id} className="student-row">
                <strong>{student.name}</strong>
                <span>Grade {student.grade}</span>
                <span>{student.team_name}</span>
                <span>{student.total_minutes || 0} min</span>
                <button onClick={() => startEditStudent(student)}>Edit</button>
                <button onClick={() => deleteStudent(student.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid-two">
        <div className="card">
          <h2>{editingStudent ? 'Edit Student' : 'Add Student'}</h2>
          <form onSubmit={editingStudent ? updateStudent : createStudent} className="form-stack">
            <label>Name<input value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} required /></label>
            <label>Grade<input type="number" min="9" max="12" value={studentForm.grade} onChange={(e) => setStudentForm({ ...studentForm, grade: Number(e.target.value) })} required /></label>
            <label>Team<select value={studentForm.team} onChange={(e) => setStudentForm({ ...studentForm, team: e.target.value })} required>
              <option value="">Select a team</option>
              {teams.map((team) => (<option key={team.id} value={team.id}>{team.name}</option>))}
            </select></label>
            <button type="submit">{editingStudent ? 'Update Student' : 'Add Student'}</button>
            {editingStudent && <button type="button" onClick={cancelEdit}>Cancel</button>}
          </form>
        </div>

        <div className="card">
          <h2>Record Activity</h2>
          <form onSubmit={createActivity} className="form-stack">
            <label>Student<select value={activityForm.student} onChange={(e) => setActivityForm({ ...activityForm, student: e.target.value })} required>
              <option value="">Choose student</option>
              {studentOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
            </select></label>
            <label>Activity<input value={activityForm.name} onChange={(e) => setActivityForm({ ...activityForm, name: e.target.value })} required /></label>
            <label>Category<select value={activityForm.category} onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value })}>
              <option>Cardio</option>
              <option>Strength</option>
              <option>Flexibility</option>
              <option>Balance</option>
            </select></label>
            <label>Minutes<input type="number" min="1" value={activityForm.minutes} onChange={(e) => setActivityForm({ ...activityForm, minutes: Number(e.target.value) })} required /></label>
            <label>Calories<input type="number" min="0" value={activityForm.calories} onChange={(e) => setActivityForm({ ...activityForm, calories: Number(e.target.value) })} required /></label>
            <button type="submit">Save Activity</button>
          </form>
        </div>
      </section>

      <section className="card">
        <h2>Recent Activities</h2>
        <div className="activity-list">
          {activities.slice(0, 10).map((activity) => (
            <div key={activity.id} className="activity-row">
              <span>{activity.name}</span>
              <span>{activity.student_name}</span>
              <span>{activity.category}</span>
              <span>{activity.minutes} min</span>
              <span>{activity.calories} cal</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;

