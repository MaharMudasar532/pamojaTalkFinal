import {
    Box, Typography, Grid, Autocomplete, Stack, Divider
    , Container, FormControl, Select, MenuItem, TextField, Breadcrumbs
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Close } from '@mui/icons-material';
import url from "../../utils/BaseURL.js"
import { useNavigate, useLocation } from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios';
import ConditionalButton from '../../components/ConditionalButton.js'
import CustomTextField from '../../components/CustomTextField.js'
import CustomImageUpload from '../../components/CustomImageUpload.js'

const Team = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [hidelabel, setHidelabel] = useState(false);
    const [hidecrossicon, setHidecrossicon] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isloading, setIsloading] = useState(false);


    const handleAdd = async () => {
        setIsloading(true)
        var Data = {
            "category_id": location.state._id,
            "category_name": Link,
            "category_image": selectedFile,
        };
        console.log(Data);
        await axios.put(url + "category/update", Data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((response) => {
            setIsloading(false)

            console.log(response.data);
            if (response.data.status === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success...',
                    confirmButtonColor: "#B5030B",
                    text: 'Category updated successfully',
                })
                navigate("/categories")
                setIsloading(false)
            } else {
                setIsloading(false)
            }
        }
        )
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    confirmButtonColor: "#B5030B",
                    text: error.message
                })
            });

    }

    useEffect(() => {
        getAllScreens();
    }, [])
    const getAllScreens = async () => {
        if (location.state.category_image !== undefined && location.state.category_image !== null && location.state.category_image !== '') {
            setHidelabel(true)
        }
    }

    const handleImageChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setHidecrossicon(true);
        setHidelabel(true);
    };

    const clearpreviewimage = () => {
        location.state.category_image = null
        setSelectedFile(null);
        setHidecrossicon(false);
        setHidelabel(false);
    }

    const [Status, setStatus] = React.useState('');
    const [Screen, setScreen] = React.useState('');
    const [Link, setLink] = React.useState('');


    return (
        <>
            <Box sx={{ height: "85vh", width: "100%", overflowX: "scroll" }}>
                <Grid container spacing={0} pt={{ lg: 2, xl: 1 }} p={2} >
                    <Grid item xs={6} align="" pt={3} >
                        <Breadcrumbs separator=">" >
                            <Typography variant="h5" fontWeight={550} pl={3} fontSize="15px" sx={{ letterSpacing: "2px", cursor: "pointer" }} color="#808080" onClick={() => navigate("/categories")} >
                                Category
                            </Typography>

                            <Typography variant="h5" fontWeight={600} fontSize="15px" sx={{ letterSpacing: "2px" }} color="#404040">
                                update Category
                            </Typography>
                        </Breadcrumbs>
                    </Grid>

                </Grid>

                <Divider sx={{ pb: 2 }} />

                <Container>
                    <Container>
                        <Grid container spacing={0}>
                            <Grid xs={12} align="center" p={1}>
                                <Box pt={2} pb={2}>
                                    <Box sx={{ pt: 2, width: "300px", height: "200px", p: "0.5px", border: "dotted 1px lightgray", float: "center", borderRadius: "5px" }} className="image_preview">
                                        {hidelabel ?
                                            null
                                            :
                                            <CustomImageUpload handleImageChange={handleImageChange} />

                                        }
                                        {selectedFile ? <img src={URL.createObjectURL(selectedFile)} alt="Preview" style={{ width: "300px", height: "200px" }} />
                                            :
                                            location.state.category_image && <img src={`${url}${location.state.category_image}`} alt="Preview" style={{ width: "300px", height: "200px" }} />
                                        }
                                    </Box>

                                    {
                                        hidecrossicon ?
                                            <Box sx={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                                                <Close sx={{
                                                    padding: 0.2, backgroundColor: "#B5030B", borderRadius: "50px",
                                                    color: "white", ml: 32, mt: -24
                                                }} onClick={() => clearpreviewimage()} />
                                            </Box>
                                            :
                                            location.state.category_image ?
                                                <Box sx={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                                                    <Close sx={{
                                                        padding: 0.2, backgroundColor: "#B5030B", borderRadius: "50px",
                                                        color: "white", ml: 32, mt: -24
                                                    }} onClick={() => clearpreviewimage()} />
                                                </Box>
                                                : null
                                    }
                                </Box>
                            </Grid>

                            <Grid xs={24} md={12} lg={12} xl={12} p={1} align="center" >

                                <FormControl sx={{ width: "50%" }} align="center">
                                    <Stack direction="column" spacing={0} pt={2}>
                                        <CustomTextField
                                            label="Category Name"
                                            defaultValue={location.state.category_name}
                                            onChange={(event) => {
                                                setLink(event.target.value);
                                            }}
                                        />
                                        <br />
                                    </Stack>
                                </FormControl>
                            </Grid>
                            <Grid sx={{ mt: '5%' }} xs={24} md={12} lg={12} xl={12} p={1} align="" >

                                <ConditionalButton Title="update Category" isloading={isloading} handleAdd={handleAdd} />
                            </Grid>

                        </Grid>
                    </Container>
                </Container>

            </Box>
        </>
    )
}

export default Team