const PageWrapper = ({ children }) => {
  /* useEffect(() => {
    // Check if window is defined (to ensure it's running on the client side)
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Clean up when component is unmounted
    return () => {
      lenis.destroy();
    };
  }, []); */
  return <div>{children}</div>;
};

export default PageWrapper;
