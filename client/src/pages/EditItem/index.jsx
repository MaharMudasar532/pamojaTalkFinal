import { Box, Typography, Grid, Button, Stack, Divider, Container, OutlinedInput, FormControl, Select, MenuItem, Breadcrumbs } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Close, SettingsSystemDaydreamOutlined, Upload } from '@mui/icons-material';
import url from "../../utils/BaseURL"
import Chip from '@mui/material/Chip';
import { useNavigate, useLocation } from "react-router-dom"
import Swal from 'sweetalert2'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
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
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getAllCategories();
    }, [])

    const getAllCategories = async () => {
        setIsloading(true)
        var InsertAPIURL = `${url}category/view_all`
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        await fetch(InsertAPIURL, {
            method: 'POST',
            headers: headers,
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.status === true) {
                    // setLogos(response.count);
                    setIsloading(false)
                    console.log(response.result);
                    setCategories(response.result);
                } else {
                    setIsloading(false)
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        confirmButtonColor: "#B5030B",
                        text: response.message,
                    })
                }
            }
            )
            .catch(error => {
                setIsloading(false)
                Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    confirmButtonColor: "#B5030B",
                    text: error.message
                })
            });
    }


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
        var InsertAPIURL = `${url}item/view_specific`
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        var Data = {
            "item_id": location.state._id,
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
                    setData(response.result);
                } else {
                    setIsloading(false);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        confirmButtonColor: "#B5030B",
                        text: response.message
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
        formData.append('item_id', location.state._id);
        console.log(formData);
        try {
            const response = await axios.put(url + 'item/update', formData, {
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
                text: error.message,
            });
        }
    };

    const RemoveImage = async (image) => {
        setIsLoading(true);
        var InsertAPIURL = `${url}item/DeleteImage`
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        const Data = {
            "item_id": location.state._id,
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
        var InsertAPIURL = `${url}item/update`
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        console.log(Category)
        var Data = {
            "item_id": location.state._id,
            "description": Description,
            "location": Location,
            "condition": Condition,
            "price": Price,
            "item_name": Name,
            "category_id": Category._id
        };
        await fetch(InsertAPIURL, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(Data),
        })
            .then(response => response.json())
            .then(async response => {
                console.log(response)
                if (response.status === true) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        confirmButtonColor: "#FF8B94",
                        text: 'Product Updated Successfully'
                    })
                    navigate("/ManageItems")
                    setIsloading(false)
                } else {
                    setIsloading(false)
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        confirmButtonColor: "#FF8B94",
                        text: response.message
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
    const handleChangeScreen = (event, newValue) => {
        console.log(newValue)
        setCategory(newValue);
    };

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



    const [Name, setName] = React.useState('');
    const [Condition, setCondition] = React.useState('');
    const [Price, setPrice] = React.useState('');
    const [Category, setCategory] = React.useState('');


    return (
        <>
            <Box sx={{ height: "85vh", width: "100%", overflowX: "scroll" }}>
                <Grid container spacing={0} pt={{ lg: 2, xl: 1 }} p={2} >
                    <Grid item xs={6} align="" pt={3} >
                        <Breadcrumbs separator=">" >
                            <Typography variant="h5" fontWeight={550} pl={3} fontSize="15px" sx={{ letterSpacing: "2px", cursor: "pointer" }} color="#808080" onClick={() => navigate("/ManageItems")} >
                                Products
                            </Typography>

                            <Typography variant="h5" fontWeight={600} fontSize="15px" sx={{ letterSpacing: "2px" }} color="#404040">
                                update Products
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
                                                Name
                                            </Typography>
                                            <OutlinedInput
                                                onChange={(event) => {
                                                    setName(event.target.value);
                                                }}
                                                defaultValue={location.state.item_name}
                                                id="input-with-icon-adornment"
                                                sx={{
                                                    borderRadius: "50px",
                                                    backgroundColor: "darkgray",
                                                    "& fieldset": { border: 'none' },
                                                }}
                                            />
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
                                                Category
                                            </Typography>
                                            <Autocomplete
                                                sx={{
                                                    borderRadius: '50px',
                                                    backgroundColor: 'darkgray',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        border: 'none', // Remove the border
                                                    },
                                                }}
                                                id="demo-simple-select"
                                                options={categories}
                                                getOptionLabel={(option) => option.category_name}
                                                onChange={handleChangeScreen}
                                                displayEmpty
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        displayEmpty
                                                        defaultValue={location.state.category_name}
                                                        placeholder={location.state.category_name}
                                                    />
                                                )}
                                            />



                                            <Typography variant="paragraph" pl={1} pb={1} sx={{ mt: '10px', font: "normal normal normal 17px/26px Roboto", fontSize: "12px", fontWeight: "medium" }} color="#1F1F1F">
                                                Condition
                                            </Typography>
                                            <OutlinedInput
                                                multiline
                                                maxRows={6}
                                                onChange={(event) => {
                                                    setCondition(event.target.value);
                                                }}
                                                defaultValue={location.state.condition}

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
                                        <Stack direction="column" spacing={0} pt={2}>
                                            <Typography variant="paragraph" pl={1} pb={1} sx={{ font: "normal normal normal 17px/26px Roboto", fontSize: "12px", fontWeight: "medium" }} color="#1F1F1F">
                                                Price
                                            </Typography>
                                            <OutlinedInput
                                                onChange={(event) => {
                                                    setPrice(event.target.value);
                                                }}
                                                defaultValue={location.state.price}
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
                                                defaultValue={location.state.description}
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