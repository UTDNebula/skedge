import { Rating, styled } from '@mui/material';

// for star color for rating
const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: theme.palette.primary.main,
  },
}));

export default StyledRating;
