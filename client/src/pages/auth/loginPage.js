import React, { useState, useEffect } from 'react'
import { Box, FormControl, Grid, Stack, Typography } from '@mui/material'
import { useNavigate, NavLink } from 'react-router-dom'
import BaseURL from "../../utils/BaseURL.js";
import mainImage from '../../Assets/images/mainImage.jpeg'
import PAMOJA from '../../Assets/images/PAMOJA.png'

// import mainBackground from './../../Assets/images/mainBackground.png'
import ImageComponent from '../../components/mainComponents/ImageComponent.js'
import PasswordFields from '../../components/mainComponents/PasswordField.js'
import TextField from '../../components/mainComponents/TextField.js'
import CustomButton from '../../components/mainComponents/CustomButton.js'
import 'react-toastify/dist/ReactToastify.css';

import { toast, ToastContainer } from 'react-toastify';
import { useFormik } from 'formik';
import * as yup from 'yup';
import COLORS from '../../utils/COLORS.js';

import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectIsAuthenticated, selectUser } from '../../Reducers/authenticationReducer.js';

function Login() {
    // const classes = useStyles(); // Initialize the custom styles

    const dispatch = useDispatch();
    // const isAuthenticated = useSelector(selectIsAuthenticated);
    // const user = useSelector(selectUser);
    //   const { authenticated, login, logout } = useAuth();
    const navigate = useNavigate();
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        // Trigger the fade-in effect after the component has mounted
        setFadeIn(true);
    }, []);
    const [isloading, setIsloading] = useState(false);
    // const handleLogout = () => {
    //     dispatch(logout());
    //   };
    const validationSchema = yup.object({
        email: yup
            .string('Enter Email ')
            .required('Email is required'),
        password: yup
            .string('Enter Password')
            .required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            console.log(values)
            setIsloading(true)
            setTimeout(async () => {
                console.log(values)
                var Data = {
                    email: values.email,
                    password: values.password,
                };
                var InsertAPIURL = `${BaseURL}admin/sign_in`
                var headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                };
                await fetch(InsertAPIURL, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(Data),
                })
                    .then(response => response.json())
                    .then(async response => {
                        console.log(response);
                        if (response.status) {
                            resetForm('')
                            toast.success("Sign in Successfully!");
                            localStorage.setItem("admin_data", JSON.stringify(response.result));
                            localStorage.setItem("email", JSON.stringify(response.result.email));
                            localStorage.setItem("jwtoken", JSON.stringify(response.token));
                            sessionStorage.setItem("jwtoken", JSON.stringify(response.token));
                            const user = {
                                id: response._id, user_name: response.user_name,
                                email: response.email, password: response.password,
                                image: response.image, token: response.token
                            };
                            dispatch(login(user));
                            navigate("/dashboard");


                        } else {
                            setIsloading(false);
                            resetForm('')
                            toast.warning(response.message)
                        }
                    }
                    )
                    .catch(error => {
                        setIsloading(false);
                        toast.warning(error.message)
                    });

            }, 3000)



        },
    });

    return (
        <>
            <ToastContainer />
            <Grid container spacing={0}>
                <Grid
                    container
                    sx={{
                        backgroundColor: '#F2FCFC',
                        backgroundImage: `url(${mainImage})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        height: "100vh", // Set height to 100vh to fill the entire screen
                    }}
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    item
                    xs={12} md={12} lg={12} xl={12}
                    align="center"
                >
                    <ImageComponent sx={{ mt: { md: '2.5%', xs: '0' }, mb: { md: '2.5%', xs: '0' } }} src={PAMOJA} alt="Qleever Text" />

                    <Grid
                        sx={{
                            mb: { md: '9.4%', xs: '0' },
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        item
                        xs={12} md={6} lg={6} xl={6}
                        align="center"
                    >
                        <Box
                            display='flex'
                            align='center'
                            justifyContent='center'
                            alignItems='center'
                            sx={{
                                opacity: fadeIn ? 1 : 0,
                                transition: 'opacity 0.5s ease-in-out',
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                width: "85%",
                                height: { md: '66vh', lg: "66.5vh", xl: "68vh" },
                            }}
                        >

                            <Grid container spacing={0}>
                                <Grid xs={12} >
                                    <Box p={{ lg: 8, xl: 13 }}>


                                        <Stack sx={{ mt: { md: '0%', xs: "10%" }, mb: { md: '0%', xs: "10%" } }}  >
                                            <Typography variant="paragraph" fontSize="20px"
                                                sx={{ letterSpacing: "1px", font: "normal normal bold 32px/32px Roboto" }} fontWeight="bold" color="#404040">
                                                Sign In
                                            </Typography>

                                            <Typography sx={{ mt: { md: '2%', xs: "5%" }, mb: { md: '2%', xs: "5%" } }} variant="body1" fontSize="13px" fontWeight="normal" color="#808080">
                                                Sign In to get started with Qleever
                                            </Typography>

                                            <form onSubmit={formik.handleSubmit} >

                                                <FormControl className='form' sx={{ width: { lg: "100%", xl: "100%" } }}>
                                                    <Stack direction="column" spacing={0} pt={3}>
                                                        <TextField
                                                            label="Email Address"
                                                            formikProps={formik}
                                                        />
                                                        <PasswordFields label="Password" fieldName="password" formikProps={formik} />

                                                        <br />
                                                        <div
                                                            style={{ marginTop: '2px', display: "flex", justifyContent: "right", alignContent: "right" }}>
                                                            <Box>
                                                                <NavLink to="/emailverification"
                                                                    style={{
                                                                        color: '#B5030B', textDecoration: "none",
                                                                        fontWeight: "bold", fontSize: "13px",
                                                                        font: "normal normal normal 17px/26px Roboto"
                                                                    }}>
                                                                    Forgot Password?</NavLink>
                                                            </Box>
                                                        </div>
                                                        <CustomButton
                                                            sx={{
                                                                '&:hover': {
                                                                    background: 'red',
                                                                },
                                                            }}
                                                            isLoading={isloading}
                                                            onClick={formik.handleSubmit}
                                                            buttonText="Sign In"
                                                        />
                                                    </Stack>

                                                </FormControl>
                                            </form>
                                        </Stack>

                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                </Grid>
            </Grid >
        </>
    )
}

export default Login
