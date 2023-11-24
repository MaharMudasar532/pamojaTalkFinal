import React, { useState ,useEffect} from 'react'
import { Box, FormControl, Grid, Stack, Typography } from '@mui/material'
import { useNavigate, NavLink, useLocation } from 'react-router-dom'
import BaseURL from "../../utils/BaseURL";
import mainBackground from '../../Assets/images/mainImage.jpeg'
import PAMOJA from '../../Assets/images/PAMOJA.png'
import ImageComponent from '../../components/mainComponents/ImageComponent'
import PasswordFields from '../../components/mainComponents/PasswordField'
import TextField from '../../components/mainComponents/TextField'
import CustomButton from '../../components/mainComponents/CustomButton'
import 'react-toastify/dist/ReactToastify.css';
import ModalMd from "../../components/mainComponents/Modal";
import tick from '../../Assets/images/tick.png'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { toast, ToastContainer } from 'react-toastify';
import { useFormik } from 'formik';
import * as yup from 'yup';
import COLORS from '../../utils/COLORS';

import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectIsAuthenticated, selectUser } from '../../Reducers/authenticationReducer';
const style1 = {
    position: 'absolute',
    top: '50%',
    left: '55%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#FFFFFF',
    outline: "none",
    boxShadow: 0,
    p: 4,
    borderRadius: 5
};

function Login() {
    const [fadeIn, setFadeIn] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();
    useEffect(() => {
        // Trigger the fade-in effect after the component has mounted
        setFadeIn(true);
      }, []);
    const [openaddmodal, setOpenaddmodal] = useState(false);
    const handleOpenadd = () => setOpenaddmodal(true);
    const handleCloseadd = () => {
        setOpenaddmodal(false);
    };

    // const isAuthenticated = useSelector(selectIsAuthenticated);
    // const user = useSelector(selectUser);
    //   const { authenticated, login, logout } = useAuth();
    const navigate = useNavigate();
    const [isloading, setIsloading] = useState(false);
    // const handleLogout = () => {
    //     dispatch(logout());
    //   };
    const validationSchema = yup.object({
        password: yup
            .string('Enter  Password ')
            .required(' Password is required'),
        ConfirmPassword: yup
            .string('Enter Confirm Password')
            .required('Confirm Password is required'),
    });

    const HandleSignIN = () => {
        // toast.success("Password Change Successfuly!");
        navigate("/");
    }

    const formik = useFormik({
        initialValues: {
            ConfirmPassword: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            console.log(values)
            const email = sessionStorage.getItem('email')
            setIsloading(true)
            setTimeout(async () => {
                console.log(values)
                var Data = {
                    email: JSON.parse(email),
                    password: values.password,
                };
                console.log(Data);
                var InsertAPIURL = `${BaseURL}admin/newPassword`
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
                            handleOpenadd();
                            setIsloading(false);

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
                        <Typography color='white'
                            onClick={() => { navigate('/check_otp') }}
                            sx={{ cursor: 'pointer' }}
                        >
                            <ArrowBackIosIcon sx={{ width: '20px', height: '20px' }} width="20px" height="20px" />
                        </Typography>
                    </Grid>

                    <Grid item xs={10} md={10} lg={10} xl={10}>
                        <ImageComponent
                            sx={{ mr: { md: '8%', xs: '0' }, mt: { md: '2.5%', xs: '0' }, mb: { md: '2.5%', xs: '0' } }}
                            src={PAMOJA}
                            alt="PAMOJA"
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
                                                Reset Password
                                            </Typography>

                                            <Typography sx={{ mt: { md: '2%', xs: "5%" }, mb: { md: '2%', xs: "5%" } }} variant="body1" fontSize="13px" fontWeight="normal" color="#808080">
                                                Create a strong password
                                            </Typography>

                                            <form onSubmit={formik.handleSubmit} >

                                                <FormControl className='form' sx={{ width: { lg: "100%", xl: "100%" } }}>
                                                    <Stack direction="column" spacing={0} pt={3}>

                                                        {/* Another PasswordField for a different field */}
                                                        <PasswordFields label="New Password" fieldName="password" formikProps={formik} />
                                                        <PasswordFields label="Confirm Password" fieldName="ConfirmPassword" formikProps={formik} />
                                                        <br />
                                                        <CustomButton sx={{ mt: "10px" }}
                                                            isLoading={isloading}
                                                            onClick={formik.handleSubmit}
                                                            buttonText="Reset"
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


            {/* del */}
            <ModalMd size="md" open={openaddmodal} handleClose={() => setOpenaddmodal(false)}
                modal_content={

                    <>
                        <Grid container spacing={0}>

                            <Grid

                                display='flex'
                                justifyContent='center'
                                alignItems='center'
                                item
                                xs={24} md={12} lg={12} xl={12}
                                align="center"
                                p={2}
                            >
                                <img
                                    alt={''}
                                    style={{
                                        width: 240,
                                        height: 'auto',
                                        display: 'flex',
                                        alignContent: "center",
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    src={tick}
                                />
                            </Grid>
                            <Grid xs={12} align="center" p={{ xs: 2, md: 5, lg: 1, xl: 1 }}>
                                <Typography variant="h5" sx={{ letterSpacing: "3px" }} fontWeight={600}
                                    fontSize="large" color={'#B5030B'}>Reset Password Successfully</Typography>

                                <Typography variant="h6" sx={{ letterSpacing: "3px" }} pt={2} pb={0} fontWeight={600}
                                    color="#1F1F1F">Your Password has been Successfully Changed</Typography>
                            </Grid>

                        </Grid>

                        <Grid sx={{ mt: "10px" }} xs={12} align="center" p={{ xs: 2, md: 5, lg: 1, xl: 1 }}>
                            <CustomButton sx={{ fontWeight: '600', mt: "10px" }}
                                isLoading={isloading}
                                onClick={HandleSignIN}
                                buttonText="Go to Sign In"
                            />

                        </Grid>

                    </>
                }
            />





        </>
    )
}

export default Login