import React, { useState, useContext } from 'react';
//import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Spinner, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useInitiatives } from '../hooks/useInitiatives';
import { useUserApplications } from '../hooks/useUserApplications';
import { useApplyForInitiative } from '../hooks/useApplyForInitiative';

const InitiativeList = () => {
  const { auth } = useContext(AuthContext);
  const [applyingInitiativeId, setApplyingInitiativeId] = useState(null);
  const [message, setMessage] = useState(null);

  const userRole = auth.user?.role;



  const {
    data: initiatives = [],
      isLoading,
      isError,
  } = useInitiatives();

  const {
    data: userApplications = [],
  } = useUserApplications(auth.accessToken, userRole === 'volunteer');

  const applyMutation = useApplyForInitiative(auth.accessToken, {
    onSuccess: (_, initiativeId) => {
      setMessage({
        type: 'success',
        text: 'Кандидатурата ви е подадена успешно!',
      });
    },
    onError: (err) => {
      setMessage({
        type: 'danger',
        text:
          err?.response?.data?.msg || 'Грешка при подаване на кандидатурата',
      });
    },
    onSettled: () => {
      setApplyingInitiativeId(null);
    },
  });

  const handleApply = (initiativeId) => {
    setApplyingInitiativeId(initiativeId);
    setMessage(null);
    applyMutation.mutate(initiativeId);
  };

  const isApplied = (initiativeId) => {
    return userApplications.some((app) => app.initiativeId === initiativeId);
  };

  if (isLoading)
    return (
      <div className="container mt-5 text-center">
        <Spinner animation="border" />
      </div>
    );
  if (isError)
    return (
      <div className="container mt-5">
        <Alert variant="danger">Грешка при зареждане на инициативите.</Alert>
      </div>
    );

  return (
    <div className="container mt-5">
      <h2>Доброволчески Инициативи</h2>

      {userRole === 'volunteer' && message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}

      {initiatives.length === 0 ? (
        <Alert variant="info" className="mt-4">
          Няма активни инициативи
        </Alert>
      ) : (
        <div className="row">
          {initiatives.map((initiative) => (
            <div className="col-md-4 d-flex" key={initiative.id}>
              <div className="card mb-4 h-100">
                <img
                  src={initiative.imageUrl}
                  className="card-img-top"
                  alt={initiative.title}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{initiative.title}</h5>
                  <p className="card-text">
                    {initiative.description.substring(0, 100)}...
                  </p>
                  <Link to={`/initiatives/${initiative.id}`} className="btn btn-primary mt-auto mb-2">
                    Виж повече
                  </Link>
                  {userRole === 'volunteer' && (
                    <Button
                      variant="success"
                      onClick={() => handleApply(initiative.id)}
                      disabled={isApplied(initiative.id) || applyingInitiativeId === initiative.id}
                    >
                      {applyingInitiativeId === initiative.id
                        ? 'Подаване...'
                        : isApplied(initiative.id)
                        ? 'Вече сте кандидатствали'
                        : 'Кандидатстване'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InitiativeList;
