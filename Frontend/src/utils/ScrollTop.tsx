import { useEffect, useState } from 'react';
import { Fab, Box } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollTop = () => {
 const [isVisible, setIsVisible] = useState(false);

 // Show button when page is scrolled up to given distance
 const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
 };

 // Set the top cordinate to 0
 // make scrolling smooth
 const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
 };

 useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
 }, []);

 return (
    <Box
      sx={{ position: 'fixed', bottom: 30, right: 30 }}
      role="button"
      onClick={scrollToTop}
      style={{ display: isVisible ? 'flex' : 'none' }}
    >
      <Fab color="success" size="small" aria-label="scroll back to top">
        <KeyboardArrowUpIcon />
      </Fab>
    </Box>
 );
}

export default ScrollTop;

