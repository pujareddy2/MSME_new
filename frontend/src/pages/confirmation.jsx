import { useLocation } from "react-router-dom";
import "./confirmation.css";

function Confirmation() {

  const location = useLocation();

  const members = location.state?.members || [];
  const solution = location.state?.solution || "";

  return (
    <div className="confirmationPage">

      <h1 className="successTitle">Application Submitted Successfully</h1>

      <div className="section">

        <h2 className="sectionTitle">Team Members</h2>

        <table className="confirmTable">

          <thead>
            <tr>
              <th>Member No</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {members.map((m, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{m.name}</td>
                <td>{m.email}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

      <div className="section">

        <h2 className="sectionTitle">Abstract</h2>

        <div className="abstractBox">
          {solution}
        </div>

      </div>

    </div>
  );
}

export default Confirmation;