// /src/pages/AdminDashboard.js
import React, { useContext, useState } from 'react';
//import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Alert, Spinner, Dropdown, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HoverDropdown from '../components/HoverDropdown'; // Ensure this component exists
import './AdminDashboard.css'; // Import custom CSS
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAdminInitiatives } from '../hooks/useAdminInitiatives';
import { useAdminMetrics } from '../hooks/useAdminMetrics';
import { useApproveInitiative } from '../hooks/useApproveInitiative';
import { useDeleteInitiative } from '../hooks/useDeleteInitiative';

// Register necessary chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
  },
  plugins: {
    legend: {
      labels: {
        font: {
          size: 10,
        },
      },
    },
    tooltip: {
      bodyFont: {
        size: 10,
      },
    },
  },
};



const AdminDashboard = () => {
  const { auth } = useContext(AuthContext);
  /*
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  */
  const [message, setMessage] = useState(null);

  /*
  // Metrics state
  const [metrics, setMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [errorMetrics, setErrorMetrics] = useState('');
  */

  /*
  useEffect(() => {
    const fetchAllInitiatives = async () => {
      try {
        const res = await axios.get('/initiatives', {
          headers: { Authorization: `Bearer ${auth.accessToken}` }
        });
        setInitiatives(res.data);
      } catch (err) {
        console.error(err);
        setError('Грешка при зареждане на инициативите');
      } finally {
        setLoading(false);
      }
    };
    fetchAllInitiatives();
  }, [auth]);

  const fetchMetrics = async () => {
    try {
      const res = await axios.get('/admin/metrics', {
        headers: { Authorization: `Bearer ${auth.accessToken}` }
      });
      setMetrics(res.data);
    } catch (err) {
      console.error(err);
      setErrorMetrics('Грешка при зареждане на метриките');
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get('/admin/metrics', {
          headers: { Authorization: `Bearer ${auth.accessToken}` }
        });
        setMetrics(res.data);
      } catch (err) {
        console.error(err);
        setErrorMetrics('Грешка при зареждане на метриките');
      } finally {
        setLoadingMetrics(false);
      }
    };
    fetchMetrics();
  }, [auth]);
  */

  const {
    data: initiatives = [],
      isLoading,
      isError,
      error,
  } = useAdminInitiatives(auth.accessToken);

  const {
    data: metrics,
      isLoading: loadingMetrics,
      isError: isMetricsError,
      error: metricsError,
      refetch: refetchMetrics,
  } = useAdminMetrics(auth.accessToken)

  const approveMutation = useApproveInitiative(auth.accessToken, {
    onSuccess: () => {
      setMessage('Инициативата е одобрена!');
      refetchMetrics();
    },
  });

  const deleteMutation = useDeleteInitiative(auth.accessToken, {
    onSuccess: () => {
      setMessage('Инициативата е изтрита успешно');
      refetchMetrics();
    }
  });

  /*
  const approveInitiative = async (id) => {
    try {
      await axios.put(`/initiatives/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${auth.accessToken}` }
      });
      setMessage('Инициативата е одобрена!');
      setInitiatives(initiatives.map(i => i.id === id ? { ...i, approved: true } : i));
      fetchMetrics(); // Refresh metrics
    } catch (err) {
      console.error(err);
      setError('Грешка при одобряване на инициативата');
    }
  };

  const deleteInitiative = async (id) => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете тази инициатива?')) return;
    try {
      await axios.delete(`/initiatives/${id}`, {
        headers: { Authorization: `Bearer ${auth.accessToken}` }
      });
      setInitiatives(initiatives.filter(i => i.id !== id));
      setMessage('Инициативата е изтрита успешно');
      fetchMetrics(); // Refresh metrics
    } catch (err) {
      console.error(err);
      setError('Грешка при изтриване на инициативата');
    }
  };
  */

  const approveInitiative = (id) => {
    approveMutation.mutate(id);
  };

  const deleteInitiative = (id) => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете тази инициатива?')) return;
    deleteMutation.mutate(id);
  }

  if (isLoading && loadingMetrics) return <div className="container mt-5 text-center"><Spinner animation="border"/></div>;
  if (isError || isMetricsError)
    return <div className="container mt-5"><Alert variant="danger">{error?.message || metricsError?.message || 'Грешка при зареждане'}</Alert></div>;

  // Prepare data for charts
  const usersByRoleData = metrics ? {
    labels: metrics.usersByRole.map(item => item.role.charAt(0).toUpperCase() + item.role.slice(1)),
    datasets: [
      {
        label: '# на потребители по роля',
        data: metrics.usersByRole.map(item => item.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
        ],
      },
    ],
  } : null;

  const initiativesByStatusData = metrics ? {
    labels: metrics.initiativesByStatus.map(item => item.approved ? 'Одобрени' : 'Неодобрени'),
    datasets: [
      {
        label: '# на инициативи по статус',
        data: metrics.initiativesByStatus.map(item => item.count),
        backgroundColor: [
          '#4CAF50', // Green for approved
          '#F44336', // Red for pending
        ],
        hoverBackgroundColor: [
          '#4CAF50',
          '#F44336',
        ],
      },
    ],
  } : null;

  const applicationsByStatusData = metrics ? {
    labels: metrics.applicationsByStatus.map(item => item.status),
    datasets: [
      {
        label: '# на кандидатури по статус',
        data: metrics.applicationsByStatus.map(item => item.count),
        backgroundColor: [
          '#2196F3', // Blue for Approved
          '#FF9800', // Orange for Pending
          '#9C27B0', // Purple for Denied
        ],
        hoverBackgroundColor: [
          '#2196F3',
          '#FF9800',
          '#9C27B0',
        ],
      },
    ],
  } : null;

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      {message && <Alert variant="success" dismissible onClose={() => setMessage(null)}>{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Metrics Section */}
      <h3 className="mt-4">Метрики</h3>
      {loadingMetrics ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : isMetricsError ? (
        <Alert variant="danger">
          {metricsError?.response?.data?.message ||
          metricsError?.message ||
          'Грешка при зареждане на метриките'}
        </Alert>
      ) : metrics ? (
        <Row className="mt-3">
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Общо потребители</Card.Title>
                <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>{metrics.totalUsers}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Общо инициативи</Card.Title>
                <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>{metrics.totalInitiatives}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Общо кандидатури</Card.Title>
                <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>{metrics.totalApplications}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : null}

      {/* Charts Section */}
      {metrics && (
        <Row className="mt-4">
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Потребители по Роля</Card.Title>
                <div style={{ position: 'relative', width: '100%', height: '250px' }}>
                <Pie data={usersByRoleData} options={chartOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Инициативи по Статус</Card.Title>
                <div style={{ position: 'relative', width: '100%', height: '250px' }}>
                <Pie data={initiativesByStatusData} options={chartOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Кандидатури по Статус</Card.Title>
                <div style={{ position: 'relative', width: '100%', height: '250px' }}>
                <Pie data={applicationsByStatusData} options={chartOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Manage Users Section */}
      <h3 className="mt-5">Управление на Потребители</h3>
      <Link to="/admin/users" className="btn btn-secondary mb-3">Управление на Потребители</Link>

      {/* Initiatives Section */}
      <h3 className="mt-5">Инициативи</h3>
      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : initiatives.length === 0 ? (
        <Alert variant="info">Няма инициативи.</Alert>
      ) : (
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Заглавие</th>
              <th>Организатор</th>
              <th>Одобрена</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {initiatives.map(init => (
              <tr key={init.id}>
                <td>{init.title}</td>
                <td>
                  {init.organizer ? (
                    <>
                      {init.organizer.name} ({init.organizer.email}){' '}
                      <Link to={`/profile/user/${init.organizer.id}`} className="btn btn-info btn-sm text-white ms-2">
                        Преглед Организатор
                      </Link>
                    </>
                  ) : 'N/A'}
                </td>
                <td>{init.approved ? 'Да' : 'Не'}</td>
                <td>
                  <HoverDropdown>
                    <Dropdown.Toggle variant="secondary" id={`dropdown-${init.id}`}>
                      Действия
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to={`/initiatives/${init.id}`}>
                        Преглед
                      </Dropdown.Item>
                      {!init.approved && (
                        <Dropdown.Item onClick={() => approveInitiative(init.id)}>
                          Одобряване
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item onClick={() => deleteInitiative(init.id)}>
                        Изтриване
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </HoverDropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
