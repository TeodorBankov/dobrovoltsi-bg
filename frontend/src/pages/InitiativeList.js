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
  /*
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [userApplications, setUserApplications] = useState([]);
  */
  const [applyingInitiativeId, setApplyingInitiativeId] = useState(null);
  const [message, setMessage] = useState(null);

  const userRole = auth.user?.role;

  /*
  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        const res = await axios.get('/initiatives');
        setInitiatives(res.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInitiatives();
  }, []);

  useEffect(() => {
    if (userRole === 'volunteer') {
      const fetchUserApplications = async () => {
        try {
          const res = await axios.get('/applications/user', {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          });
          setUserApplications(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchUserApplications();
    }
  }, [auth.accessToken, userRole]);
  */

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

  /*
  const handleApply = async (initiativeId) => {
    setApplyingInitiativeId(initiativeId);
    setMessage(null);

    try {
      await axios.post(
        '/applications',
        { initiativeId },
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      setUserApplications([...userApplications, { initiativeId, status: 'Pending' }]);
      setMessage({ type: 'success', text: 'Кандидатурата ви е подадена успешно!' });
    } catch (err) {
      console.error(err.response?.data || err);
      setMessage({
        type: 'danger',
        text: err.response?.data?.msg || 'Грешка при подаване на кандидатурата',
      });
    } finally {
      setApplyingInitiativeId(null);
    }
  };
  */
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
