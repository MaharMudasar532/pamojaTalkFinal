import { Box, Typography, Grid, Button, Stack, Divider, Container, OutlinedInput, FormControl, Select, MenuItem, Breadcrumbs } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Close, Upload } from '@mui/icons-material';
import url from "../../utils/BaseURL"
import Chip from '@mui/material/Chip';
import { useNavigate, useLocation } from "react-router-dom"
import Swal from 'sweetalert2'
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import COLORS from "../../utils/COLORS";
const override = {
    display: ' block',
    margin: '0 auto',
    borderColor: 'red',
}
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const btn = {
    letterSpacing: "1px",
    width: '50%',
    marginTop: '40px',
    marginBottom: '40px',
    color: 'white',
    background: COLORS.buttonColor,
    borderColor: '#FF8B94',
    height: '50px',
    padding: '0px',
    font: 'normal normal normal 17px/26px Roboto',
    borderRadius: "50px",
    boxShadow: "none",
    fontWeight: "medium",
    fontSize: "15px",
    textTransform: "capitalize"
}

const Team = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isloading, setIsloading] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [Location, setLocation] = React.useState('');
    const [Description, setDescription] = React.useState(location.state.description);
    const [Data, setData] = useState([]);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [hideCrossIcons, setHideCrossIcons] = useState([]);
    const [hideLabels, setHideLabels] = useState([]);
    useEffect(() => {
        getAllScreens();
        getData();
    }, [])

    const getAllScreens = () => {
        const newHideLabels = [];
        location.state.images.forEach((image, index) => {
            newHideLabels[index] = !!image;
        });
        setHideLabels(newHideLabels);
    };

    const getData = async () => {
        var InsertAPIURL = `${url}posts/view_specific`
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        var Data = {
            "post_id": location.state._id,
        };
        console.log(Data)
        await fetch(InsertAPIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data),
        })
            .then(response => response.json())
            .then(async response => {
                console.log(response)
                if (response.status === true) {
                    console.log(response.result.images)
                    setData(response.result);
                } else {
                    setIsloading(false);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops',
                        confirmButtonColor: "#B5030B",
                        text: ''
                    })
                }
            }
            )
            .catch(error => {
                setIsloading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    confirmButtonColor: "#B5030B",
                    text: error.message
                })
            });
    }


    const handleImageUpload = async (e, num) => {
        const file = e.target.files[0];
        const updatedSelectedFiles = [...selectedFiles];
        updatedSelectedFiles[num] = file;
        setSelectedFiles(updatedSelectedFiles);

        const updatedHideCrossIcons = [...hideCrossIcons];
        updatedHideCrossIcons[num] = true;
        setHideCrossIcons(updatedHideCrossIcons);

        const updatedHideLabels = [...hideLabels];
        updatedHideLabels[num] = true;
        setHideLabels(updatedHideLabels);

        await uploadNewImage(file);
    };
    const uploadNewImage = async (file) => {
        if (!file) return;

        setIsLoading(true);
        console.log(file);
        const formData = new FormData();
        formData.append('images', file);
        formData.append('post_id', location.state._id);
        console.log(formData);
        try {
            const response = await axios.put(url + 'posts/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setIsLoading(false);
            console.log(response)
            if (response.data.status === true) {
                setIsLoading(false);
                getData();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops2...',
                    confirmButtonColor: '#B5030B',
                    text: '',
                });
            }
        } catch (error) {
            setIsLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                confirmButtonColor: '#B5030B',
                text: error,
            });
        }
    };

    const RemoveImage = async (image) => {
        setIsLoading(true);
        var InsertAPIURL = `${url}posts/DeleteImage`
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        const Data = {
            "post_id": location.state._id,
            "image_path": image
        }

        await fetch(InsertAPIURL, {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify(Data),
        })
            .then(response => response.json())
            .then(async response => {
                if (response.status === true) {
                    // navigate("/ManageMeditation")
                    setIsloading(false)
                    getData();
                } else {
                    setIsloading(false)
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        confirmButtonColor: "#FF8B94",
                        text: 'ERROR!!'
                    })
                }
            }
            )
            .catch(error => {
                setIsloading(false)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    confirmButtonColor: "#FF8B94",
                    text: "server  error"
                })
            });

    };






    const handleAdd = async (e) => {
        e.preventDefault();
        setIsloading(true)
        var InsertAPIURL = `${url}posts/update`
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        var Data = {
            "post_id": location.state._id,
            "description": Description,
            "post_location": Location,
        };
        await fetch(InsertAPIURL, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(Data),
        })
            .then(response => response.json())
            .then(async response => {
                if (response.status === true) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        confirmButtonColor: "#FF8B94",
                        text: 'Post Updated Successfully'
                    })
                    navigate("/ManagePosts")
                    setIsloading(false)
                } else {
                    setIsloading(false)
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        confirmButtonColor: "#FF8B94",
                        text: 'ERROR!!'
                    })
                }
            }
            )
            .catch(error => {
                setIsloading(false)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    confirmButtonColor: "#FF8B94",
                    text: "server  error"
                })
            });

    }


    const clearPreviewImage = async (num, image) => {
        const updatedImages = [...location.state.images];
        updatedImages[num] = null;
        RemoveImage(image);

        const updatedSelectedFiles = [...selectedFiles];
        updatedSelectedFiles[num] = null;
        setSelectedFiles(updatedSelectedFiles);

        // Update the hideCrossIcons and hideLabels states as well
        const updatedHideCrossIcons = [...hideCrossIcons];
        updatedHideCrossIcons[num] = false;
        setHideCrossIcons(updatedHideCrossIcons);

        const updatedHideLabels = [...hideLabels];
        updatedHideLabels[num] = false; // Set to false to show the label/upload button
        setHideLabels(updatedHideLabels);
    };





    return (
        <>
            <Box sx={{ height: "85vh", width: "100%", overflowX: "scroll" }}>
                <Grid container spacing={0} pt={{ lg: 2, xl: 1 }} p={2} >
                    <Grid item xs={6} align="" pt={3} >
                        <Breadcrumbs separator=">" >
                            <Typography variant="h5" fontWeight={550} pl={3} fontSize="15px" sx={{ letterSpacing: "2px", cursor: "pointer" }} color="#808080" onClick={() => navigate("/ManagePosts")} >
                                Posts
                            </Typography>

                            <Typography variant="h5" fontWeight={600} fontSize="15px" sx={{ letterSpacing: "2px" }} color="#404040">
                                update Posts
                            </Typography>
                        </Breadcrumbs>
                    </Grid>

                </Grid>

                <Divider sx={{ pb: 2 }} />

                <Container>
                    <Container>
                        <form onSubmit={(e) => { handleAdd(e) }}>

                            <Grid display="flex"
                                justifyContent="center"
                                alignItems="center" padding={5} container spacing={0}>
                                <PerfectScrollbar>
                                    <Grid sx={{ maxHeight: '55vh' }} container spacing={2}>
                                        <Grid item>
                                            <Box
                                                sx={{
                                                    width: '200px',
                                                    height: '200px',
                                                    border: '1px dotted lightgray',
                                                    borderRadius: '5px',
                                                    textAlign: 'center',
                                                    position: 'relative',
                                                }}
                                            >
                                                <label htmlFor={`fileInput-first`}>
                                                    <Upload sx={{ fontSize: '50px', color: '#808080', mt: '50px' }} />
                                                    <span style={{ display: 'block', fontSize: '16px' }}>
                                                        Upload New Image
                                                    </span>
                                                    <input
                                                        style={{ display: 'none' }}
                                                        id={`fileInput-first`}
                                                        type="file"
                                                        onChange={(e) => handleImageUpload(e)}
                                                        accept="image/*"
                                                    />
                                                </label>
                                            </Box>
                                        </Grid>
                                        {Data.images !== undefined && Data.images.length > 0 && Data.images.map((image, index) => (
                                            <Grid item key={index}>
                                                {image && image !== "" && (
                                                    <Box
                                                        sx={{
                                                            width: '200px',
                                                            height: '200px',
                                                            border: '1px dotted lightgray',
                                                            borderRadius: '5px',
                                                            textAlign: 'center',
                                                            position: 'relative', // Add this to make the positioning work
                                                        }}
                                                    >
                                                        <>
                                                            <img
                                                                src={`${url}${image}`}
                                                                alt="Preview"
                                                                style={{ width: '100%', height: '100%' }}
                                                            />
                                                            <Close
                                                                sx={{
                                                                    padding: 0.2,
                                                                    backgroundColor: '#B5030B',
                                                                    borderRadius: '50px',
                                                                    color: 'white',
                                                                    position: 'absolute',
                                                                    top: '5px',
                                                                    right: '5px',
                                                                }}
                                                                onClick={() => clearPreviewImage(index, image)}
                                                            />
                                                        </>
                                                    </Box>
                                                )}

                                            </Grid>
                                        ))}
                                    </Grid>
                                </PerfectScrollbar>
                            </Grid>

                            <Grid padding={0} container spacing={0}>

                                <Grid xs={12} md={6} lg={6} xl={6} p={1} align="" >

                                    <FormControl sx={{ width: "90%" }} align="left">
                                        <Stack direction="column" spacing={0} pt={2}>
                                            <Typography variant="paragraph" pl={1} pb={1} sx={{ font: "normal normal normal 17px/26px Roboto", fontSize: "12px", fontWeight: "medium" }} color="#1F1F1F">
                                                Location
                                            </Typography>
                                            <OutlinedInput
                                                onChange={(event) => {
                                                    setLocation(event.target.value);
                                                }}
                                                defaultValue={location.state.location}
                                                id="input-with-icon-adornment"
                                                sx={{
                                                    borderRadius: "50px",
                                                    backgroundColor: "darkgray",
                                                    "& fieldset": { border: 'none' },
                                                }}
                                            />
                                        </Stack>

                                    </FormControl>

                                </Grid>

                                <Grid xs={12} md={6} lg={6} xl={6} p={1} align="" >

                                    <FormControl sx={{ width: "90%" }} align="left">
                                        <Stack direction="column" spacing={0} pt={0}>
                                            <Typography variant="paragraph" pl={1} pb={1} sx={{ mt: '10px', font: "normal normal normal 17px/26px Roboto", fontSize: "12px", fontWeight: "medium" }} color="#1F1F1F">
                                                Description
                                            </Typography>
                                            <OutlinedInput
                                                multiline
                                                maxRows={6}
                                                onChange={(event) => {
                                                    setDescription(event.target.value);
                                                }}
                                                value={Description}

                                                id="input-with-icon-adornment"
                                                sx={{
                                                    borderRadius: "50px",
                                                    backgroundColor: "darkgray",
                                                    "& fieldset": { border: 'none' },
                                                }}
                                            />
                                        </Stack>

                                    </FormControl>

                                </Grid>


                                {isloading ?
                                    <Grid xs={12} align="center">
                                        <Button variant="contained" style={btn}>
                                            <ClipLoader loading={isloading}
                                                css={override}
                                                size={10}
                                            />
                                        </Button>
                                    </Grid>

                                    :

                                    <Grid xs={12} align="center">
                                        <Button variant="contained" style={btn} onClick={(e) => { handleAdd(e) }} >Update</Button>
                                    </Grid>
                                }
                            </Grid>
                        </form>
                    </Container>
                </Container>

            </Box>
        </>
    )
}

export default Team