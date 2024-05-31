/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "../context/DataContext";

function LogOrRegisterAdmin() {
  const {
    state: { logOrRegisterAdminInputs, isToRegister, error },
    dispatch,
  } = useContext(DataContext);

  // initialize useNavigate hook
  const navigate = useNavigate();

  // function to handle inputs
  function handleChange(e) {
    dispatch({ type: "ADMIN_INPUTS_CHANGE", payload: { [e.target.name]: e.target.value } });
  }

  // function to run when the form is submitted
  async function handleSubmit(e) {
    e.preventDefault();

    let user;
    if (isToRegister) {
      user = {
        firstname: logOrRegisterAdminInputs.firstname,
        lastname: logOrRegisterAdminInputs.lastname,
        email: logOrRegisterAdminInputs.email,
        password: logOrRegisterAdminInputs.password,
      };
    } else {
      user = {
        email: logOrRegisterAdminInputs.email,
        password: logOrRegisterAdminInputs.password,
      };
    }

    const settings = {
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    };

    try {
      const response = await fetch(
        isToRegister ? "http://localhost:4001/admin/register" : "http://localhost:4001/admin/login",
        settings
      );

      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_ADMIN_LOGIN", payload: data });
        navigate("/");
      } else {
        const { error } = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.log(error.message);
      dispatch({ type: "SET_ERROR", payload: error.message });
    }

    // setLoginInputs({
    //   username: "",
    //   email: "",
    //   password: "",
    // });
  }

  return (
    <div className="login-page">
      <div>
        <h1>Welcome to Employee Management App</h1>
        <p>Here you can create and keep track of your employees</p>
      </div>
      {/* We create a dynamic form to handle both register and login scenarios */}
      <form onSubmit={handleSubmit}>
        {isToRegister ? <h3>Register</h3> : <h3>Login</h3>}
        {isToRegister && (
          <>
            <label>
              First Name
              <input
                type="text"
                name="firstname"
                value={logOrRegisterAdminInputs.firstname}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Last Name
              <input
                type="text"
                name="lastname"
                value={logOrRegisterAdminInputs.lastname}
                onChange={handleChange}
                required
              />
            </label>
          </>
        )}
        <label>
          Email
          <input type="email" name="email" value={logOrRegisterAdminInputs.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={logOrRegisterAdminInputs.password}
            onChange={handleChange}
            required
          />
        </label>
        <button>{isToRegister ? "Register" : "Login"}</button>
        {isToRegister ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => {
                dispatch({ type: "SET_IS_TO_REGISTER", payload: false });
                dispatch({ type: "SET_ERROR", payload: "" });
              }}
            >
              Login
            </span>
          </p>
        ) : (
          <p>
            Don't have an account?{" "}
            <span
              onClick={() => {
                dispatch({ type: "SET_IS_TO_REGISTER", payload: true });
                dispatch({ type: "SET_ERROR", payload: "" });
              }}
            >
              Register here
            </span>
          </p>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default LogOrRegisterAdmin;
