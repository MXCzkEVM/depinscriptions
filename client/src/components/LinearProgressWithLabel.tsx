import { Box, LinearProgress, LinearProgressProps, Typography } from "@mui/material";

function LinearProgressWithLabel(props: LinearProgressProps & { value: number, height?: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress className="rounded" style={{ height: props.height }} variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default LinearProgressWithLabel