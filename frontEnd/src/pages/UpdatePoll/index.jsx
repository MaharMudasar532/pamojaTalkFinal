import { Box, Typography, Grid, OutlinedInput, Stack, Divider, Container, FormControl, Breadcrumbs } from "@mui/material";
import React, { useState, useEffect } from "react";
import url from "../../utils/BaseURL"
import CustomTextField from '../../components/CustomTextField.js'
import ConditionalButton from '../../components/ConditionalButton.js'
import COLORS from "../../utils/COLORS";

import { useLocation, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios';
import { Cancel, ConstructionOutlined } from "@mui/icons-material";


const Team = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [question, setQuestion] = useState("");
    const [optionsText, setOptionsText] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isloading, setIsloading] = useState(false);
    const [options, setOptions] = useState(0);

    // Populate the question and options when the component mounts
    useEffect(() => {
        getAllLogos();
    }, []);
    const getAllLogos = async () => {
        setIsloading(true)
        var InsertAPIURL = `${url}Pole/view_specific`
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        console.log(location.state.pole_id)
        const Data = {
            "pole_id": location.state.pole_id
        }
        await fetch(InsertAPIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data),
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.status === true) {
                    // setLogos(response.count);
                    setIsloading(false)
                    console.log(response.result.options);
                    if (response.result && response.result.options) {
                        setOptionsText(response.result.options.map((option) => option));
                    }

                } else {
                    setIsloading(false)
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        confirmButtonColor: "#B5030B",
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
                    confirmButtonColor: "#B5030B",
                    text: error.message
                })
            });
    }


    const handleAdd = async () => {
        setIsloading(true)
        var InsertAPIURL = `${url}Pole/update`
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        if (!optionsText.length > 0) {
            setIsloading(false)
            Swal.fire({
                icon: 'warning',
                title: 'warning',
                confirmButtonColor: "#B5030B",
                text: 'All Fields Required',
            })
        } else {
            var Data = {
                "pole_id": location.state.pole_id,
                "question": question,
            };
            let OptionsValues = [];
            for (let i = 0; i < optionsText.length; i++) {
                if (optionsText[i].option_text) {
                    OptionsValues.push(optionsText[i].option_text)
                } else {
                    OptionsValues.push(optionsText[i]);
                }
            }
            setIsloading(false)
            await fetch(InsertAPIURL, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(Data),
            })
                .then(response => response.json())
                .then(async response => {
                    console.log(response)
                    if (response.status === true) {
                        const poll_id = response.result._id
                        console.log(poll_id)
                        await HandleRemoveAll(poll_id);

                        if (OptionsValues.length > 0) {
                            for (const option of OptionsValues) {

                                var Data = {
                                    "question_id": poll_id,
                                    "option_text": option,
                                };
                                await axios.post(url + "Pole_options/add", Data)
                                    .then((response) => {
                                        // console.log(response);
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
        setOptionsText([...optionsText, ""]);

    };

    const handleChangeOption = (event, index) => {
        // Update the option at the specified index
        const updatedOptions = [...optionsText];
        updatedOptions[index] = event.target.value;
        setOptionsText(updatedOptions);
    };

    const HandleRemoveAll = async (pole_id) => {
        optionsText.splice(0, optionsText.length);
        var InsertAPIURL = `${url}Pole_options/deleteALLOptions`
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        var Data = {
            "question_id": pole_id,
        };
        await fetch(InsertAPIURL, {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify(Data),
        })
            .then(response => response.json())
            .then(response => {
                // console.log(response);
                if (response.status === true) {

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        confirmButtonColor: COLORS.color1,
                        text: response.message
                    })
                }
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
    };


    const HandleRemove = async () => {
        const lastElement = optionsText[optionsText.length - 1];
        optionsText.pop();
        if (lastElement.options_id) {
            // console.log(lastElement.options_id)
            // eslint-disable-next-line array-callback-return
            var InsertAPIURL = `${url}Pole_options/delete`
            var headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };
            var Data = {
                "options_id": lastElement.options_id,
            };
            await fetch(InsertAPIURL, {
                method: 'DELETE',
                headers: headers,
                body: JSON.stringify(Data),
            })
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    if (response.status === true) {
                        getAllLogos();
                        // Swal.fire({
                        //     icon: 'success',
                        //     title: 'Success!',
                        //     confirmButtonColor: COLORS.color1,
                        //     text: 'Poll Deleted Successfully!',
                        // })
                        //   console.log(response.result);
                        //   setCatagory(response.result);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error...',
                            confirmButtonColor: COLORS.color1,
                            text: response.message
                        })
                    }
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
        getAllLogos();

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
                                Update Poll
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
                                                defaultValue={location.state.question}
                                                onChange={(event) => {
                                                    setQuestion(event.target.value);
                                                }}
                                            />
                                        </Stack>
                                    </FormControl>
                                </Box>
                            </Grid>

                            <ConditionalButton Title="Add New Option" isloading={isloading} handleAdd={NewOption} />
                            <ConditionalButton Title="Remove Option" isloading={isloading} handleAdd={HandleRemove} />

                            <Grid sx={{ mb: '5%' }} xs={24} md={12} lg={12} xl={12} p={1} align="center">
                                {optionsText.map((option, index) => (
                                    <FormControl key={index} sx={{ width: "50%" }} align="center">
                                        <Stack direction="column" spacing={0} pt={2}>
                                            <Typography
                                                variant="paragraph"
                                                pl={1}
                                                pb={1}
                                                sx={{
                                                    font: 'normal normal normal 17px/26px Roboto',
                                                    fontSize: '12px',
                                                    fontWeight: 'medium',
                                                }}
                                                color="#1F1F1F"
                                            >
                                                {`Option ${index + 1}`}

                                            </Typography>
                                            <OutlinedInput
                                                multiline
                                                maxRows={6}
                                                defaultValue={option.option_text}
                                                onChange={(e) => handleChangeOption(e, index)}
                                                id="input-with-icon-adornment"
                                                sx={{
                                                    borderRadius: '50px',
                                                    backgroundColor: 'darkgray',
                                                    "& fieldset": { border: 'none' },
                                                    resize: 'none',
                                                    overflow: 'hidden',
                                                    transition: 'height 0.2s',
                                                    height: 'auto',
                                                }}
                                            />
                                        </Stack>
                                    </FormControl>
                                ))}
                            </Grid>
                            <ConditionalButton Title="Update Poll!" isloading={isloading} handleAdd={handleAdd} />
                        </Grid>
                    </Container>
                </Container>
            </Box>
        </>
    )
}
export default Team