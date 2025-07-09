import React, { useEffect, useState } from "react";
import {Box,Card,CardContent,Typography,List,ListItem,ListItemText,useTheme,CircularProgress,Avatar,Chip,LinearProgress,alpha,Paper,} from "@mui/material";
import {ShoppingCart,MonetizationOn,Inventory,HighlightOff,Star,Person,TrendingUp, Warning} from "@mui/icons-material";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchDashboardData } from "../../api/axios";

const StatCard = ({ icon, label, value, color, subtitle }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number; 
  color: string;
  trend?: number;
  subtitle?: string;
}) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        p: 3,
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          border: `1px solid ${alpha(color, 0.3)}`,
        }
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar 
            sx={{ 
              bgcolor: color, 
              width: 56, 
              height: 56,
              boxShadow: `0 8px 16px ${alpha(color, 0.3)}`,
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {label}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
     
      </Box>
    </Card>
  );
};

const DataListCard = ({ 
  title, 
  items, 
  renderItem, 
  icon,
  color = "#1976d2"
}: { 
  title: string; 
  items: any[]; 
  renderItem: (item: any, index: number) => React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
}) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[6],
        }
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box 
          sx={{ 
            p: 3, 
            background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
            borderBottom: `1px solid ${alpha(color, 0.2)}`,
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              {icon && (
                <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>
                  {icon}
                </Avatar>
              )}
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
            </Box>
            <Chip 
              label={items.length} 
              size="small" 
              sx={{ 
                bgcolor: alpha(color, 0.1),
                color: color,
                fontWeight: 600 
              }} 
            />
          </Box>
        </Box>
        
        <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
          {items.length > 0 ? items.map(renderItem) : (
            <ListItem sx={{ py: 2 }}>
              <ListItemText 
                primary="No data available" 
                sx={{ 
                  textAlign: 'center',
                  color: 'text.secondary',
                  fontStyle: 'italic'
                }} 
              />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchDashboardData();
      setData(res.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <Box 
        p={4} 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center"
        minHeight="60vh"
        gap={3}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6" color="error">
          Failed to load dashboard data
        </Typography>
      </Box>
    );
  }

  const chartData = data.monthly_revenue?.map((item: any) => ({
    month: item.month,
    revenue: item.revenue,
  })) || [];

  return (
    <Box p={4} sx={{ background: alpha(theme.palette.primary.main, 0.02), minHeight: '100vh' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            Welcome 
          </Typography>
        </Box>
      </Box>

      {/* Stat Cards */}
      <Box 
        display="grid" 
        gridTemplateColumns={{
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(2, 1fr)"
        }}
        gap={3}
        mb={4}
      >
        <StatCard
          icon={<ShoppingCart />}
          label="Total Orders"
          value={data.total_orders || 0}
          color={theme.palette.primary.main}
          subtitle="This month"
        />
        <StatCard
          icon={<MonetizationOn />}
          label="Total Revenue"
          value={`$${data.total_revenue || 0}`}
          color={theme.palette.primary.main}
          subtitle="This month"
        />
        </Box>
        <Box display="grid" 
        gridTemplateColumns={{
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(2, 1fr)"
        }}
        gap={3}
        mb={4}>
        <StatCard
          icon={<Inventory />}
          label="Total Products"
          value={data.total_products || 0}
          color={theme.palette.info.main}
          subtitle="Active products"
        />
        <StatCard
          icon={<Person />}
          label="Total Customers"
          value={data.total_customers || 0}
          color={theme.palette.info.main}
          subtitle="Active customers"
        />
      </Box>

      <Box mb={4}>
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            overflow: 'hidden'
          }}
        >
          <Box 
            sx={{ 
              p: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <TrendingUp />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Monthly Revenue Trend
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track your business growth over time
                </Typography>
              </Box>
            </Box>
          </Box>
          <CardContent sx={{ p: 3 }}>
            {chartData.length > 0 ? (
              <BarChart
                height={350}
                xAxis={[{ dataKey: "month", label: "Month" }]}
                series={[{ 
                  dataKey: "revenue", 
                  label: "Revenue (₹)",
                  color: theme.palette.primary.main
                }]}
                dataset={chartData}
              />
            ) : (
              <Box py={8} textAlign="center">
                <Typography variant="h6" color="text.secondary">
                  No revenue data available
                </Typography>
              </Box>
            )}
          </CardContent>
        </Paper>
      </Box>

      <Box 
        display="grid" 
        gridTemplateColumns={{
          xs: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)"
        }}
        gap={3}
      >
        <DataListCard
          title="Low Stock Alert"
          icon={<Warning />}
          color={theme.palette.error.main}
          items={data.low_stock || []}
          renderItem={(p, idx) => (
            <ListItem key={idx} sx={{ py: 2 }}>
              <Box display="flex" alignItems="center" gap={2} width="100%">
                <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), width: 32, height: 32 }}>
                  <Warning sx={{ color: theme.palette.error.main, fontSize: 16 }} />
                </Avatar>
                <Box flex={1}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {p.name}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      Stock: {p.stock_quantity}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min((p.stock_quantity / 100) * 100)} 
                      sx={{ 
                        flex: 1, 
                        height: 4, 
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: theme.palette.error.main
                        }
                      }} 
                    />
                  </Box>
                </Box>
              </Box>
            </ListItem>
          )}
        />
        
        <DataListCard
          title="Inactive Products"
          icon={<HighlightOff />}
          color={theme.palette.grey[600]}
          items={data.inactive_products || []}
          renderItem={(p, idx) => (
            <ListItem key={idx} sx={{ py: 2 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.grey[600], 0.1), width: 32, height: 32 }}>
                  <HighlightOff sx={{ color: theme.palette.grey[600], fontSize: 16 }} />
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {p.name}
                </Typography>
              </Box>
            </ListItem>
          )}
        />
        
        <DataListCard
          title="Top Selling Products"
          icon={<Star />}
          color={theme.palette.warning.main}
          items={data.top_products || []}
          renderItem={(p, idx) => (
            <ListItem key={idx} sx={{ py: 2 }}>
              <Box display="flex" alignItems="center" gap={2} width="100%">
                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), width: 32, height: 32 }}>
                  <Star sx={{ color: theme.palette.warning.main, fontSize: 16 }} />
                </Avatar>
                <Box flex={1}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {p.product__name}
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      Sold: {p.quantity}
                    </Typography>
                    <Chip 
                      label={`#${idx + 1}`} 
                      size="small" 
                      sx={{ 
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        color: theme.palette.warning.main,
                        fontSize: '0.7rem',
                        height: 20
                      }} 
                    />
                  </Box>
                </Box>
              </Box>
            </ListItem>
          )}
        />
        
        <DataListCard
          title="Top Customers"
          icon={<Person />}
          color={theme.palette.info.main}
          items={data.top_customers || []}
          renderItem={(c, idx) => (
            <ListItem key={idx} sx={{ py: 2 }}>
              <Box display="flex" alignItems="center" gap={2} width="100%">
                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), width: 32, height: 32 }}>
                  <Person sx={{ color: theme.palette.info.main, fontSize: 16 }} />
                </Avatar>
                <Box flex={1}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {c.customer__name}
                  </Typography> 
                  <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      Total: ₹{c.total_spent}
                    </Typography>
                    <Chip 
                      label="VIP" 
                      size="small" 
                      sx={{ 
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        fontSize: '0.7rem',
                        height: 20
                      }} 
                    />
                  </Box>
                </Box>
              </Box>
            </ListItem>
          )}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
