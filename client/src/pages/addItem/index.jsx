import {
    Box, Typography, Grid, Button, Stack, Divider, Container,
    OutlinedInput, FormControl, Select, MenuItem, Breadcrumbs
} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import React, { useState, useEffect } from "react";
import { Close, Upload } from '@mui/icons-material';
import url from "../../utils/BaseURL"
import 'react-slideshow-image/dist/styles.css';
import Chip from '@mui/material/Chip';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
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
    const onChangeImage = e => {
        const filesArray = Array.from(e.target.files);
        setFiles(filesArray);
        setHidecrossicon(true);
        setHidelabel(true);
    };

    const onChange = e => {
        setaudio_files(e.target.files)
    };
    const onChange1 = e => {
        setSelectedFile(e.target.files[0]);
    };

    const [Files, setFiles] = useState([]);
    const [hidelabel, setHidelabel] = useState(false);
    const [hidecrossicon, setHidecrossicon] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [audio_files, setaudio_files] = useState([]);
    const [Animations, setAnimations] = useState([]);
    const [isloading, setIsloading] = useState(false);
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
                    title: 'Oops...',
                    confirmButtonColor: "#B5030B",
                    text: error.message
                })
            });
    }

    const handleChangeScreen = (event, newValue) => {
        console.log(newValue)
        setCategory(newValue);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setIsloading(true)
        console.log(Category)
        const numberPattern = /^\d+(\.\d+)?$/;
        if (Description === '' ||
            Files.length === 0 || Files === undefined || Location === '' ||
            Category === '' || Condition === '' || Name === '' || Price === ''

        ) {
            setIsloading(false);
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                confirmButtonColor: COLORS.color1,
                text: 'All Fields are required'
            })
        } else if (!numberPattern.test(Price)) {
            setIsloading(false);
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                confirmButtonColor: COLORS.color1,
                text: 'Price Must be number'
            })
        } else {
            const AnimationData = new FormData();
            Object.values(Files).forEach(file => {
                AnimationData.append("images", file);
            });
            const admin = JSON.parse(localStorage.getItem('admin_data'))
            const admin_id = admin._id
            var Data = {
                "user_id": admin_id,
                "description": Description,
                "location": Location,
                "images": Files,
                "condition": Condition,
                "price": Price,
                "item_name": Name,
                "category_id": Category
            };
            console.log(Data);
            AnimationData.append("user_id", admin_id);
            AnimationData.append("description", Description);
            AnimationData.append("location", Location);
            AnimationData.append("condition", Condition);
            AnimationData.append("price", Price);
            AnimationData.append("item_name", Name);
            console.log(Category)
            AnimationData.append("category_id", Category._id);
            console.log(AnimationData)
            await axios.post(url + "item/add", AnimationData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).then((response) => {
                setIsloading(false);
                console.log(response);
                if (response.data.status === true) {
                    Swal.fire({
                        icon: 'success',
                        title: 'success',
                        confirmButtonColor: "#FF8B94",
                        text: 'Product Added Successfully'
                    })
                    navigate("/ManageItems")
                    setIsloading(false);

                } else {
                    setIsloading(false);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops2...',
                        confirmButtonColor: "#FF8B94",
                        text: 'Server I/O Error'
                    })
                }
            }
            )
                .catch(error => {
                    setIsloading(false);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        confirmButtonColor: "#FF8B94",
                        text: error.message
                    })
                });

        }
    }


    const clearpreviewimage = () => {
        setHidecrossicon(false);
        setHidelabel(false);
        setFiles([]);
        // selectedFile = []
    }
    const [Location, setLocation] = React.useState('');
    const [Name, setName] = React.useState('');
    const [Condition, setCondition] = React.useState('');
    const [Price, setPrice] = React.useState('');
    const [Category, setCategory] = React.useState('');

    const [Description, setDescription] = React.useState('');

    return (
        <>
            <Box sx={{ height: "85vh", width: "100%", overflowX: "scroll" }}>
                <Grid container spacing={0} pt={{ lg: 2, xl: 1 }} p={2} >
                    <Grid item xs={6} align="" pt={3} >
                        <Breadcrumbs separator=">" >
                            <Typography variant="h5" fontWeight={550} pl={3} fontSize="15px"
                                sx={{ letterSpacing: "2px", cursor: "pointer" }} color="#808080"
                                onClick={() => navigate("/ManageItems")} >
                                Products
                            </Typography>

                            <Typography variant="h5" fontWeight={600} fontSize="15px"
                                sx={{ letterSpacing: "2px" }} color="#404040">
                                Add Product
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
                                alignItems="center" container spacing={0}>
                                <Grid xs={12} p={1}>
                                    <Box align='center' pt={2} pb={2}>
                                        {
                                            hidecrossicon ?
                                                <Box sx={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                                                    <Close sx={{ backgroundColor: "#FF8B94", borderRadius: "50px", color: "white" }} onClick={() => clearpreviewimage()} />
                                                </Box>
                                                :
                                                null
                                        }

                                        {hidelabel ?
                                            Files &&
                                            <PerfectScrollbar>
                                                <Grid
                                                    container
                                                    justifyContent="center"
                                                    alignItems="center"
                                                    sx={{ maxHeight: { md: '55vh', xs: '25vh' } }}
                                                    spacing={0}
                                                >
                                                    <Grid item sx={{ width: { md: '90%', xs: '100%' } }}>
                                                        <ImageList
                                                            cols={4}
                                                            gap={6}
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                flexWrap: 'wrap',
                                                            }}
                                                        >
                                                            {Files.length > 0 &&
                                                                Files.map((file, index) => (
                                                                    <ImageListItem key={index}>
                                                                        <img
                                                                            style={{
                                                                                padding: '0.5%',
                                                                                border: '1px solid #FF8B94',
                                                                                borderRadius: '10px',
                                                                                width: '230px',
                                                                                height: '200px',
                                                                                objectFit: 'cover',
                                                                            }}
                                                                            src={URL.createObjectURL(file)}
                                                                            alt={file.name}
                                                                            loading="lazy"
                                                                        />
                                                                    </ImageListItem>
                                                                ))}
                                                        </ImageList>
                                                    </Grid>
                                                </Grid>
                                            </PerfectScrollbar>

                                            :
                                            <Box align='center' sx={{ pt: 2, width: "300px", height: "200px", p: "0.5px", border: "dotted 1px lightgray", float: "center", borderRadius: "5px" }} className="image_preview">
                                                <Grid display="flex"
                                                    justifyContent="center"
                                                    alignItems="center" container spacing={0} pt={5}>
                                                    <Grid xs={12} align="">
                                                        <Stack align="">
                                                            <Stack align="">
                                                                <label htmlFor="fileInput" style={{ display: "flex", justifyContent: "center", alignContent: "center", color: "#808080" }}>
                                                                    <Stack direction="column" spacing={1} >
                                                                        <Upload sx={{ fontSize: "50px", color: "#808080", ml: 3, pb: 1 }} />
                                                                        <span style={{ paddingBottom: "2vh", font: "normal normal normal 16px/26px Arial" }}>Upload Product</span>
                                                                        <span style={{ paddingBottom: "2vh", font: "normal normal normal 16px/26px Arial" }}>Images</span>

                                                                    </Stack>
                                                                </label>
                                                                <input
                                                                    multiple
                                                                    style={{ display: "none" }}
                                                                    id="fileInput"
                                                                    type="file"
                                                                    onChange={onChangeImage}
                                                                    accept="image/*"
                                                                />
                                                            </Stack>

                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        }

                                    </Box>
                                </Grid>
                            </Grid>

                            <Grid container spacing={0}>

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
                                                id="input-with-icon-adornment"
                                                sx={{
                                                    borderRadius: "50px",
                                                    backgroundColor: "darkgray",
                                                    "& fieldset": { border: 'none' },
                                                }}
                                            />
                                            <br />
                                            <Typography variant="paragraph" pl={1} pb={1} sx={{ font: "normal normal normal 17px/26px Roboto", fontSize: "12px", fontWeight: "medium" }} color="#1F1F1F">
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
                                                options={categories}
                                                getOptionLabel={(option) => option.category_name}
                                                onChange={handleChangeScreen}
                                                renderInput={(params) => (
                                                    <TextField {...params} placeholder='Select Category'
                                                    />
                                                )}
                                            />

                                        </Stack>

                                    </FormControl>

                                </Grid>

                                <Grid xs={12} md={6} lg={6} xl={6} p={1} align="" >

                                    <FormControl sx={{ width: "90%" }} align="left">
                                        <Stack direction="column" spacing={0} pt={2}>
                                            <Typography variant="paragraph" pl={1} pb={1} sx={{ mt: '10px', font: "normal normal normal 17px/26px Roboto", fontSize: "12px", fontWeight: "medium" }} color="#1F1F1F">
                                                Price
                                            </Typography>
                                            <OutlinedInput
                                                multiline
                                                maxRows={6}
                                                onChange={(event) => {
                                                    setPrice(event.target.value);
                                                }}
                                                id="input-with-icon-adornment"
                                                sx={{
                                                    borderRadius: "50px",
                                                    backgroundColor: "darkgray",
                                                    "& fieldset": { border: 'none' },
                                                }}
                                            />
                                            <br />
                                            <Typography variant="paragraph" pl={1} pb={1} sx={{ mt: '10px', font: "normal normal normal 17px/26px Roboto", fontSize: "12px", fontWeight: "medium" }} color="#1F1F1F">
                                                Location
                                            </Typography>
                                            <OutlinedInput
                                                multiline
                                                maxRows={6}
                                                onChange={(event) => {
                                                    setLocation(event.target.value);
                                                }}
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
                                                Condition
                                            </Typography>
                                            <OutlinedInput
                                                onChange={(event) => {
                                                    setCondition(event.target.value);
                                                }}
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
                                            <Typography variant="paragraph" pl={1} pb={1} sx={{ mt: '10px', font: "normal normal normal 17px/26px Roboto", fontSize: "12px", fontWeight: "medium" }} color="#1F1F1F">
                                                Description
                                            </Typography>
                                            <OutlinedInput
                                                multiline
                                                maxRows={6}
                                                onChange={(event) => {
                                                    setDescription(event.target.value);
                                                }}
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
                                        <Button type='submit' value='Upload'
                                            variant="contained" style={btn} onClick={() => { handleAdd() }} >Add</Button>
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