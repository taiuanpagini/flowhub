import { Card as MuiCard, CardContent, Typography, Box } from '@mui/material';

export default function Card({ title, subtitle, value, icon, color = 'primary', className = '' }) {
  return (
    <MuiCard 
      elevation={2}
      sx={{ 
        height: '100%',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        borderLeft: 4,
        borderColor: `${color}.main`,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            {title && (
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
            )}
            {value !== undefined && (
              <Typography variant="h3" component="div" fontWeight={700} color={`${color}.main`}>
                {value}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box sx={{ fontSize: 48, color: `${color}.main`, opacity: 0.8 }}>
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </MuiCard>
  );
}
