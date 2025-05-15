// start on 13 March 2025 by medha

// use to get the token from cookie
const tokenHandler = () => {
    let token = "";
    document.cookie.split("; ").forEach((v) => {
      if (v.split("=")[0] === "skillpilotquizStudentLogin") {
        token = v.split("=")[1];
      }
    });
    return token;
  };
  
  export default tokenHandler;