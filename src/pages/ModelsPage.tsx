import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ModelsPage() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/llms", { replace: true }); }, [navigate]);
  return null;
}
