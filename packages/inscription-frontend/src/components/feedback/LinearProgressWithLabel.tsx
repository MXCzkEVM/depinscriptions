import type { LinearProgressProps } from '@mui/material'
import { Box, LinearProgress, Typography } from '@mui/material'

export interface LinearProgressWithLabelProps extends LinearProgressProps {
  value: number
  height?: string
}

export function LinearProgressWithLabel(props: LinearProgressWithLabelProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress className="rounded" style={{ height: props.height }} variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${props.value}%`}</Typography>
      </Box>
    </Box>
  )
}
