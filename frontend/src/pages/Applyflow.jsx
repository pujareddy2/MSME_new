import { useNavigate, useParams } from "react-router-dom";

const navigate = useNavigate();
const { id } = useParams();

<button onClick={() => navigate(`/apply/${id}`)}>
  Apply
</button>