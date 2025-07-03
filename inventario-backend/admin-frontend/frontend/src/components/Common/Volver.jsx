import React from 'react';
import { useNavigate } from 'react-router-dom';

const Volver = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-3">
      <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>
        ← Volver al Dashboard
      </button>
    </div>
  );
};

export default Volver;
