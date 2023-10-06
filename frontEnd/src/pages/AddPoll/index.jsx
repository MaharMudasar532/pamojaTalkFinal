import { Box, Typography, Grid, Stack, Divider, Container, FormControl, Breadcrumbs } from "@mui/material";
import React, { useState, useEffect } from "react";
import url from "../../utils/BaseURL"
import CustomTextField from '../../components/CustomTextField.js'
import ConditionalButton from '../../components/ConditionalButton.js'

import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios';


const Team = () => {
    const navigate = useNavigate();
    const [question, setQuestion] = useState("");
    const [optionsText, setOptionsText] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isloading, setIsloading] = useState(false);
    const [options, setOptions] = useState(0);


    const handleAdd = async () => {
        setIsloading(true)
        var InsertAPIURL = `${url}Pole/add`
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        if (question === '' || !optionsText.length > 0) {
            setIsloading(false)
            Swal.fire({
                icon: 'warning',
                title: 'warning',
                confirmButtonColor: "#B5030B",
                text: 'All Fields Required',
            })
        } else {
            var Data = {
                "question": question,
            };
            await fetch(InsertAPIURL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(Data),
            })
                .then(response => response.json())
                .then(async response => {
                    console.log(response.result._id);
                    const poll_id = response.result._id
                    if (response.status === true) {
                        if (optionsText.length > 0) {
                            for (const option of optionsText) {

                                var Data = {
                                    "question_id": poll_id,
                                    "option_text": option,
                                };
                                await axios.post(url + "Pole_options/add", Data)
                                    .then((response) => {
                                        console.log(response);
                                    }
                                    )
                                    .catch(error => {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Oops...',
                                            confirmButtonColor: "#B5030B",
                                            text: error.message
                                        })
                                    });
                            }
                        } else {
                            setIsloading(false)
                            Swal.fire({
                                icon: 'warning',
                                title: 'Warning...',
                                confirmButtonColor: "#B5030B",
                                text: 'At least One Option',
                            })
                        }
                    } else {
                        setIsloading(false)
                        Swal.fire({
                            icon: 'error',
                            title: 'Error...',
                            confirmButtonColor: "#B5030B",
                            text: response.messages
                        })
                    }
                    setIsloading(false)
                    navigate('/ManagePoll')
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        confirmButtonColor: "#B5030B",
                        text: 'New Poll Added Successfully!',
                    })

                }
                ).catch(error => {
                    setIsloading(false)
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        confirmButtonColor: "#B5030B",
                        text: error.message
                    })
                });
        }
    }

    const NewOption = async () => {
        handleAddOption();
        const opt = options + 1;
        setOptions(opt);
    }

    const handleAddOption = () => {
        // Add a new option to the options array
        setOptionsText([...optionsText, ""]);
    };

    const handleChangeOption = (event, index) => {
        // Update the option at the specified index
        const updatedOptions = [...optionsText];
        updatedOptions[index] = event.target.value;
        setOptionsText(updatedOptions);
    };
    return (
        <>
            <Box sx={{ height: "85vh", width: "100%", overflowX: "scroll" }}>
                <Grid container spacing={0} pt={{ lg: 2, xl: 1 }} p={2} >
                    <Grid item xs={6} align="" pt={3} >
                        <Breadcrumbs separator=">" >
                            <Typography variant="h5" fontWeight={550} pl={3} fontSize="15px" sx={{ letterSpacing: "2px", cursor: "pointer" }} color="#808080" onClick={() => navigate("/ManagePoll")} >
                                Polls
                            </Typography>
                            <Typography variant="h5" fontWeight={600} fontSize="15px" sx={{ letterSpacing: "2px" }} color="#404040">
                                Add Poll
                            </Typography>
                        </Breadcrumbs>
                    </Grid>

                </Grid>

                <Divider sx={{ pb: 2 }} />

                <Container>
                    <Container>
                        <Grid container spacing={0}>
                            <Grid sx={{ mb: "2%" }} xs={12} align="center" p={1}>
                                <Box pt={2} pb={2}>
                                    <FormControl sx={{ width: "50%" }} align="center">
                                        <Stack direction="column" spacing={0} pt={2}>
                                            <CustomTextField
                                                label="Question"
                                                value={question}
                                                onChange={(event) => {
                                                    setQuestion(event.target.value);
                                                }}
                                            />
                                        </Stack>
                                    </FormControl>
                                </Box>
                            </Grid>

                            <ConditionalButton Title="Add New Option" isloading={isloading} handleAdd={NewOption} />

                            <Grid sx={{ mb: '5%' }} xs={24} md={12} lg={12} xl={12} p={1} align="center">
                                {optionsText.map((option, index) => (
                                    <FormControl sx={{ width: "50%" }} align="center">
                                        <Stack direction="column" spacing={0} pt={2}>
                                            <CustomTextField
                                                placeholder={`Option ${index + 1}`}
                                                value={option}
                                                label={`Option ${index + 1}`}
                                                onChange={(e) => handleChangeOption(e, index)}
                                            />
                                        </Stack>
                                    </FormControl>
                                ))}
                            </Grid>


                            {/* <Grid sx={{ mb: '30px' }} xs={12} md={6} lg={6} xl={6} p={1} align="right" >

                                <FormControl sx={{ width: "90%" }} align="left">
                                    <Stack direction="column" spacing={0} pt={2}>
                                        <CustomAutocomplete
                                            label="Screen"
                                            options={Screens}
                                            value={Screen}
                                            onChange={(event, newValue) => handleChangeScreen(newValue)}
                                        />
                                    </Stack>
                                </FormControl>
                            </Grid> */}
                            <ConditionalButton isloading={isloading} handleAdd={handleAdd} />
                        </Grid>
                    </Container>
                </Container>
            </Box>
        </>
    )
}
export default Team