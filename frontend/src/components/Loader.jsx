// frontend/src/components/Loader.jsx
const Loader = () => {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.loader}></div>
        <p>Loading...</p>
      </div>
    );
  };
  
  const styles = {
    loaderContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    },
    loader: {
      width: "50px",
      height: "50px",
      border: "5px solid #f3f3f3",
      borderTop: "5px solid #007bff",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
  };
  
  export default Loader;
  