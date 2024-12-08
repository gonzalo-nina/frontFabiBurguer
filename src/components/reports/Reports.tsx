// src/components/reports/Reports.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Alert } from 'react-bootstrap';
import { Bar, Doughnut } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import pedidoService from '../../service/pedidoService';
import productoService from '../../service/productoService';
import clienteService from '../../service/clienteService';
import auth from '../../service/auth';
import '../../styles/reports.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [productStats, setProductStats] = useState<{
    labels: string[];
    quantities: number[];
  }>({ labels: [], quantities: [] });
  const [customerStats, setCustomerStats] = useState<{
    labels: string[];
    totals: number[];
  }>({ labels: [], totals: [] });
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isAdmin] = useState(() => auth.isAdmin());

  if (!isAdmin) {
    return (
      <div className="container mt-4">
        <Alert variant="warning">
          No tienes permisos para acceder a esta sección. Esta vista está reservada para administradores.
        </Alert>
      </div>
    );
  }

  const loadData = async () => {
    try {
      setLoading(true);
      const [pedidos, productos, clientes] = await Promise.all([
        pedidoService.obtenerTodosPedidos(),
        productoService.getAllProductos(),
        clienteService.getAllClientes()
      ]);

      // Filter pedidos by date range
      const filteredPedidos = pedidos.filter(pedido => {
        const pedidoDate = pedido.fechaPedido ? new Date(pedido.fechaPedido) : new Date();
        return pedidoDate >= startDate && pedidoDate <= endDate;
      });

      // Calculate total revenue
      const total = filteredPedidos.reduce((sum, pedido) => sum + pedido.subtotal, 0);
      setTotalRevenue(total);

      // Get detalles for filtered pedidos
      const allDetalles = await Promise.all(
        filteredPedidos.map(pedido => 
          pedidoService.obtenerDetallesPedido(pedido.idPedido!)
        )
      );
      const detallesList = allDetalles.flat();

      // Calculate product stats
      const productQuantities = detallesList.reduce((acc, detalle) => {
        const productId = detalle.producto.idProducto;
        acc[productId] = (acc[productId] || 0) + detalle.cantidad;
        return acc;
      }, {} as Record<number, number>);

      const sortedProducts = Object.entries(productQuantities)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5); // Show top 5 instead of 10

      setProductStats({
        labels: sortedProducts.map(([productId]) => {
          const product = productos.find(p => p.idProducto === Number(productId));
          return product?.nombre || 'Unknown';
        }),
        quantities: sortedProducts.map(([, quantity]) => quantity)
      });

      // Calculate customer totals
      const customerTotals = filteredPedidos.reduce((acc, pedido) => {
        const clienteId = pedido.idCliente;
        acc[clienteId] = (acc[clienteId] || 0) + pedido.subtotal;
        return acc;
      }, {} as Record<number, number>);

      // Sort customers by total and get top 5
      const sortedCustomers = Object.entries(customerTotals)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

      setCustomerStats({
        labels: sortedCustomers.map(([clienteId]) => {
          const cliente = clientes.find(c => c.idCliente === Number(clienteId));
          return cliente?.nombre || 'Unknown';
        }),
        totals: sortedCustomers.map(([, total]) => total)
      });

    } catch (err) {
      setError('Error loading data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  const revenueChartData = {
    labels: ['Total de Ventas'],
    datasets: [
      {
        data: [totalRevenue],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const productChartData = {
    labels: productStats.labels,
    datasets: [{
      label: 'Cantidad Vendida',
      data: productStats.quantities,
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  const customerChartData = {
    labels: customerStats.labels,
    datasets: [{
      label: 'Total en Pedidos (S/.)',
      data: customerStats.totals,
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const customerDistributionData = {
    labels: customerStats.labels,
    datasets: [{
      data: customerStats.totals.map(total => 
        ((total / totalRevenue) * 100).toFixed(1)
      ),
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Resumen de Ventas',
      },
    },
  };

  const customerChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Top 5 Clientes por Valor de Pedidos',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: string | number) {
            return `S/. ${Number(value).toFixed(2)}`;
          }
        }
      },
    },
  };

  const productChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Top 5 Productos Más Vendidos',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: false,
      },
    },
  };

  const customerDistributionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw}%`;
          },
        },
      },
    },
  };

  if (loading) return <div className="text-center p-4">Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <Container className="mt-4">
      {/* Date filters at top */}
      <Row className="mb-4">
        <Col>
          <Card className={`filter-card ${isPickerOpen ? 'picker-open' : ''}`}>
            <Card.Body>
              <div className="date-filter-container">
                <h5 className="filter-title">Filtrar por Fecha</h5>
                <div className="date-picker-wrapper">
                  <Form.Group>
                    <Form.Label>Desde:</Form.Label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date: Date | null) => date && setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      className="form-control"
                      popperPlacement="bottom-start"
                      onCalendarOpen={() => setIsPickerOpen(true)}
                      onCalendarClose={() => setIsPickerOpen(false)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Hasta:</Form.Label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date: Date | null) => date && setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      className="form-control"
                      popperPlacement="bottom-start"
                      onCalendarOpen={() => setIsPickerOpen(true)}
                      onCalendarClose={() => setIsPickerOpen(false)}
                    />
                  </Form.Group>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bar charts */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="chart-card">
            <Card.Body>
              <Card.Title>Top 5 Productos Más Vendidos</Card.Title>
              <div className="chart-container">
                <Bar data={productChartData} options={productChartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="chart-card">
            <Card.Body>
              <Card.Title>Top 5 Clientes por Valor Total de Pedidos</Card.Title>
              <div className="chart-container">
                <Bar data={customerChartData} options={customerChartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Circular charts */}
      <Row>
        <Col md={6}>
          <Card className="chart-card">
            <Card.Body>
              <div className="total-sales-container">
                <div className="total-header">
                  <Card.Title>Total de Ventas</Card.Title>
                  <span className="total-amount">S/. {totalRevenue.toFixed(2)}</span>
                </div>
                <div className="chart-container">
                  <Doughnut data={revenueChartData} options={options} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="chart-card">
            <Card.Body>
              <Card.Title>Distribución de Ventas por Cliente</Card.Title>
              <div className="chart-container">
                <Doughnut data={customerDistributionData} options={customerDistributionOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;