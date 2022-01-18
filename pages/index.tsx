/* eslint-disable jsx-a11y/alt-text */
import _default from "next/dist/client/router";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import ErrorMessage from "../components/messages/ErrorMessage";

export const Login = () => {
  const initialValues = {
    name: "",
    email: "",
    password: "",
  };
  const [currentForm, setCurrentForm] = useState("login");

  // Login validations
  const loginValidationSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
    password: Yup.string()
      .required()
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      )
      .label("Password"),
  });

  // Register validations
  const registerValidationSchema = Yup.object().shape({
    name: Yup.string().required().label("Full name"),
    email: Yup.string().required().email().label("Email"),
    password: Yup.string()
      .required()
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      )
      .label("Password"),
  });

  const handleSignIn = (values:object) => {
    console.log("LOGIN: ", values)
  };

  const handleSignUp = (values:object) => {
    console.log("Register: ", values);
  };

  return (
    <>
      <Head>
        <title>MatriX</title>
        <link rel="shortcut icon" href="/images/wisex-favicon.png" />
      </Head>
      <div className="flex justify-center items-center h-screen">
        <div className="flex w-3/5 rounded-xl justify-center bg-white drop-shadow-xl">
          <div
            style={{ borderRadius: "0.75rem 0rem 0rem 0.75rem" }}
            className="w-3/4 px-5 py-8 bg-white justify-center"
          >
            {currentForm == "login" ? (
              <Formik
                initialValues={{
                  email: "",
                  password: ""
                }}
                onSubmit={handleSignIn}
                validationSchema={loginValidationSchema}
              >
                {({
                  values,
                  handleChange,
                  handleSubmit,
                  touched,
                  handleBlur,
                  errors,
                }) => (
                  <form action="POST" onSubmit={handleSubmit}>
                    <h1 className="text-3xl font-black m-0 text-center text-slate-900">
                      Sign In
                    </h1>
                    <div className="m-4 justify-center text-center">
                      <input
                        type="email"
                        className="form-input w-full px-4 py-3 my-3 rounded focus:outline-transparent"
                        placeholder="Email.."
                        name="email"
                        value={values.email}
                        onChange={handleChange("email")}
                        onBlur={handleBlur("email")}
                      />
                       {touched.email && errors.email && (
                                        <ErrorMessage
                                            text={errors.email}
                                        />
                                    )}

                      <input
                        type="password"
                        className="form-input w-full px-4 py-3 my-3 rounded"
                        placeholder="Password.."
                        name="password"
                        value={values.password}
                        onChange={handleChange("password")}
                        onBlur={handleBlur("password")}

                      />
                         {touched.password && errors.password && (
                                        <ErrorMessage
                                            text={errors.password}
                                        />
                                    )}
                      <br />
                       <br />
                      <button className="bg-slate-900 my-4 mx-0 px-6 py-3 w-40 text-emerald-400 rounded-full hover:text-white">
                        Sign in
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
            ) : (
              <Formik
                initialValues={{
                  name: "",
                  email: "",
                  password: ""
                }}
                onSubmit={handleSignUp}
                validationSchema={registerValidationSchema}
              >
                {({
                  values,
                  handleChange,
                  handleSubmit,
                  touched,
                  handleBlur,
                  errors,
                }) => (
                  <form action="POST" onSubmit={handleSubmit}>
                <h1 className="text-3xl font-black m-0 text-center text-slate-900">
                  Sign Up
                </h1>
                <div className="m-4 justify-center text-center">
                  <input
                    type="text"
                    className="form-input w-full px-4 py-3 my-3 rounded focus:outline-transparent"
                    placeholder="Full name.."
                    name="name"
                    value={values.name}
                    onChange={handleChange("name")}
                    onBlur={handleBlur("name")}

                  />
                      {touched.name && errors.name && (
                                        <ErrorMessage
                                            text={errors.name}
                                        />
                                    )}

                  <input
                    type="email"
                    className="form-input w-full px-4 py-3 my-3 rounded focus:outline-transparent"
                    placeholder="Email.."
                    name="email"
                    value={values.email}
                    onChange={handleChange("email")}
                    onBlur={handleBlur("email")}

                  />
                     {touched.email && errors.email && (
                                        <ErrorMessage
                                            text={errors.email}
                                        />
                                    )}

                  <input
                    type="password"
                    className="form-input w-full px-4 py-3 my-3 rounded"
                    placeholder="Password.."
                    name="password"
                    value={values.password}
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}

                  />
                     {touched.password && errors.password && (
                                        <ErrorMessage
                                            text={errors.password}
                                        />
                                    )}
 <br />
  <br />
                  <button className="bg-slate-900 my-4 mx-0 px-6 py-3 w-40 text-emerald-400 rounded-full hover:text-white">
                    Sign up
                  </button>
                </div>
              </form>
                )}
              </Formik>
            )}
          </div>
          <div
            style={{ borderRadius: "0rem 0.75rem 0.75rem 0rem" }}
            className="w-3/4 px-5 py-8 bg-slate-900 justify-center text-center"
          >
            {currentForm == "login" ? (
              <div>
                <Image
                  priority
                  src="/images/matrix-half-white.png"
                  height={70}
                  width={124}
                />
                <h1 className="text-3xl my-3 font-black m-0 text-emerald-400">
                  Hello, Friend!
                </h1>
                <p className="w-64 my-6 ml-14 font-thin m-0 text-white tracking-wider">
                  Enter your personal details and start managing your
                  transactions with us
                </p>
                <button
                  onClick={() => {
                    setCurrentForm("register");
                  }}
                  className="border border-solid border-emerald-400 my-auto mx-0 px-6 py-3 w-40 text-white rounded-full hover:text-emerald-400"
                >
                  Sign up
                </button>
              </div>
            ) : (
              <div className="">
                <Image
                  priority
                  src="/images/matrix-half-white.png"
                  height={70}
                  width={124}
                />
                <h1 className="text-3xl my-3 font-black m-0 text-emerald-400">
                  Hello, Friend!
                </h1>
                <p className="w-64 my-6 ml-14 font-thin m-0 text-white tracking-wider">
                  To keep connected with us please login with personal info
                </p>
                <button
                  onClick={() => {
                    setCurrentForm("login");
                  }}
                  className="border border-solid border-emerald-400 my-auto mx-0 px-6 py-3 w-40 text-white rounded-full hover:text-emerald-400"
                >
                  Sign in
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
