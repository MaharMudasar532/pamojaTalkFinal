import React, { useState , useEffect} from 'react'
import { Box, FormControl, Grid, Stack, Typography } from '@mui/material'
import { useNavigate, NavLink } from 'react-router-dom'
import BaseURL from "../../utils/BaseURL";
import mainBackground from '../../Assets/images/mainImage.jpeg'
import PAMOJA from '../../Assets/images/PAMOJA.png'
import ImageComponent from '../../components/mainComponents/ImageComponent'
import PasswordFields from '../../components/mainComponents/PasswordField'
import TextField from '../../components/mainComponents/TextField'
import CustomButton from '../../components/mainComponents/CustomButton'
import 'react-toastify/dist/ReactToastify.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { toast, ToastContainer } from 'react-toastify';
import { useFormik } from 'formik';
import * as yup from 'yup';
import COLORS from '../../utils/COLORS';

import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectIsAuthenticated, selectUser } from '../../Reducers/authenticationReducer';

function Login() {
    const [fadeIn, setFadeIn] = useState(false);
    const dispatch = useDispatch();
    // const isAuthenticated = useSelector(selectIsAuthenticated);
    // const user = useSelector(selectUser);
    //   const { authenticated, login, logout } = useAuth();
    const navigate = useNavigate();
    const [isloading, setIsloading] = useState(false);
    // const handleLogout = () => {
    //     dispatch(logout());
    //   };
    useEffect(() => {
        // Trigger the fade-in effect after the component has mounted
        setFadeIn(true);
      }, []);
    const validationSchema = yup.object({
        email: yup
            .string('Enter Email ')
            .required('Email is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            console.log(values)
            setIsloading(true)
            setTimeout(async () => {
                var Data = {
                    email: values.email,
                };
                var InsertAPIURL = `${BaseURL}admin/verifyEmail`
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
                        if (response.success) {
                            resetForm('')

                            toast.success("OTP sent successfully");
                            sessionStorage.setItem("email", JSON.stringify(response.data.email));
                            navigate(`/check_otp`, {
                                state: {
                                    email: response.email
                                }
                            });
                        } else {
                            setIsloading(false);
                            resetForm('')
                            toast.warning(response.message)
                        }
                    }
                    )
                    .catch(error => {
                        setIsloading(false);
                        toast.warning("Server Error")
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
                        backgroundImage: `url(${mainBackground})`,
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
                    <Grid item xs={1} md={1} lg={1} xl={1}>
                        <Typography  color='white'
                            onClick={() => { navigate('/login') }}
                            sx={{ cursor: 'pointer' }}
                        >
                            <ArrowBackIosIcon sx={{ width: '20px', height: '20px' }} width="20px" height="20px" />
                        </Typography>
                    </Grid>

                    <Grid item xs={10} md={10} lg={10} xl={10}>
                        <ImageComponent
                            sx={{ mr:{ md: '8%', xs: '0' }, mt: { md: '2.5%', xs: '0' }, mb: { md: '2.5%', xs: '0' } }}
                            src={PAMOJA}
                            alt="Qleever Text"
                        />
                    </Grid>

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
                            justifyContent='top'
                            alignItems='top'
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
                                                Forget Password
                                            </Typography>

                                            <Typography sx={{ mt: { md: '2%', xs: "5%" }, mb: { md: '2%', xs: "5%" } }} variant="body1" fontSize="13px" fontWeight="normal" color="#808080">
                                                Enter your email to reset your password
                                            </Typography>

                                            <form onSubmit={formik.handleSubmit} >

                                                <FormControl className='form' sx={{ width: { lg: "100%", xl: "100%" } }}>
                                                    <Stack direction="column" spacing={0} pt={10} pb={8}>
                                                        <TextField
                                                            label="Email Address"
                                                            formikProps={formik}
                                                        />
                                                        <br />
                                                        <CustomButton
                                                            sx={{ mt: { md: '15%', xs: '5%' } }}
                                                            isLoading={isloading}
                                                            onClick={formik.handleSubmit}
                                                            buttonText="Send Code"
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
