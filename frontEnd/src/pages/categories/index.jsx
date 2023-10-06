import { Box, Tooltip, Typography, useTheme, IconButton, Grid, Modal, Button, Stack, Card, CardContent, MenuItem, Menu, Paper, Divider, Avatar } from "@mui/material";
import Chip from '@mui/material/Chip';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Swal from 'sweetalert2'
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import url from "../../utils/BaseURL"
import COLORS from "../../utils/COLORS"

import { tokens } from "../../theme";
import { Insertcategory_name, Autorenew, Add, List, Apps, MoreVert } from '@mui/icons-material';
import React, { useState, useEffect } from "react";
import { Checkbox } from '@mui/material';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import { Close, Cancel, Delete, Edit, Visibility } from "@mui/icons-material";
import "./index.css";


const btncancel = {
    width: '90%',
    letterSpacing: "2px",
    marginBottom: '40px',
    color: COLORS.color1,
    backgroundColor: '#ffffff',
    border: '1px solid #AC1AF0  ',
    height: '50px',
    padding: '0px',
    fontFamily: '',
    fontWeight: 510,
    boxShadow: "none",
    fontSize: "large",
    textTransform: "capitalize"
}

const btn = {
    width: '90%',
    letterSpacing: "2px",
    marginBottom: '40px',
    color: 'white',
    background: COLORS.buttonColor,
    borderColor: '#AC1AF0',
    height: '50px',
    padding: '0px',
    fontFamily: '',
    fontWeight: 510,
    boxShadow: "none",
    fontSize: "large",
    textTransform: "capitalize"
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#FFFFFF',
    outline: "none",
    boxShadow: 0,
    p: 4,
    borderRadius: 5
};

const styleview = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#FFFFFF',
    outline: "none",
    boxShadow: 0,
    borderRadius: 5
};


function TabPanel(props) {


    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const Team = () => {

    const navigate = useNavigate();

    const [isloading, setIsloading] = useState(false);
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#ffffff");
    const [viewData, setViewData] = useState([]);

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    function CustomToolbar() {
        return (
            <GridToolbarContainer sx={{ marginBottom: "5px" }} >
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />

            </GridToolbarContainer>
        );
    }

    const [openmodal, setOpenmodal] = useState(false);
    const handleOpenmodal = () => setOpenmodal(true);
    const handleClosemodal = () => setOpenmodal(false);
    const [DeleteData, setDeleteData] = useState([]);

    const [idData, setIdData] = useState([]);
    const [Data, setData] = React.useState([]);
    const [AnchorElStatus, setAnchorElStatus] = React.useState(null);

    const [opendelmodalStatus, setOpendelmodalStatus] = useState(false);
    const handleOpendelmodalStatus = (row) => {
        setData(row);
        setOpendelmodalStatus(true);
        setAnchorElStatus(null);
    };
    const handleClosedelmodalStatus = () => setOpendelmodalStatus(false);

    const [opendelmodal, setOpendelmodal] = useState(false);
    const handleOpendelmodal = () => {
        setOpendelmodal(true);
        setAnchorEl(null);
    };
    const handleClosedelmodal = () => setOpendelmodal(false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [ActionData, setActionData] = React.useState({});


    const changeStatus = async (data) => {

        var InsertAPIURL = `${url}ads/update_status`
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        let status;
        if (data.active_status === 'active') {
            status = 'inactive';
        } else {
            status = 'active';
        }
        var Data = {
            "adID": data.id,
            "active_status": status
        };
        await fetch(InsertAPIURL, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(Data),
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.message == `ad status Updated Successfully!`) {
                    handleClosedelmodalStatus();
                    getAllLogos();

                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        confirmButtonColor: "#B5030B",
                        text: 'Status Change Successfully!'
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        confirmButtonColor: "#B5030B",
                        text: 'Server Down!'
                    })
                }
            }
            )
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    confirmButtonColor: "#B5030B",
                    text: "Server Down!"
                })
            });
    }


    const [showtable, setShowtable] = useState(true);

    const [DeleteID, setDeleteID] = React.useState('');

    const handleDelete = async () => {
        var InsertAPIURL = `${url}category/delete`
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        var Data = {
            "category_id": DeleteID,
        };
        console.log(Data)
        await fetch(InsertAPIURL, {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify(Data),
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.status === true) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        confirmButtonColor: "#B5030B",
                        text: 'Category Deleted Successfully!',
                    })
                    // setLogos(response.count);
                    getAllLogos();
                    setOpendelmodal(false);
                    //   console.log(response.result);
                    //   setCatagory(response.result);
                } else {
                    setOpendelmodal(false);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        confirmButtonColor: "#B5030B",
                        text: ''
                    })
                }
            }
            )
            .catch(error => {
                setOpendelmodal(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    confirmButtonColor: "#B5030B",
                    text: error.message
                })
            });
    }

    const [Screens, setScreens] = useState([]);


    const columns = [
        {
            field: 'category_image', headerName: <span style={{ color: "black", fontWeight: 600 }}>Image</span>,
            minWidth: 150,
            renderCell: (row) => {
                return (
                    <>
                        {row.row.category_image !== null ?
                            <Avatar src={`${url}${row.row.category_image}`} style={{ bgcolor: "#B5030B", width: '45px', height: '45px' }}>
                            </Avatar>
                            :
                            <Avatar sx={{ width: '45px', height: '45px' }}>
                            </Avatar>

                        }
                    </>

                );
            },

        },
        {
            field: 'category_name', headerName: <span style={{ color: "black", fontWeight: 600 }}>Category Name</span>,
            minWidth: 300, flex: '1'
        },

        {
            field: '_id',
            headerName: <span style={{ color: "black", fontWeight: 600 }}>Actions</span>,
            minWidth: 250,
            renderCell: (row) => {
                return (
                    <>
                        <div>
                            <IconButton onClick={() => {
                                setViewData(row.row); console.log(row.row);
                                handleOpenmodal()
                            }} >
                                <Tooltip title="view" >
                                    <Visibility sx={{ color: "#3FC0FF" }} onClick={() => {
                                        setViewData(row.row); console.log(row.row);
                                        handleOpenmodal()
                                    }} />
                                </Tooltip>
                            </IconButton>

                            <IconButton onClick={() => {
                                console.log(row.row);
                                navigate('/updateCategory', {
                                    state: {
                                        _id: row.row._id,
                                        category_image: row.row.category_image,
                                        category_name: row.row.category_name,
                                    }
                                })
                            }
                            } >
                                <Tooltip title="edit" >
                                    <Edit sx={{ color: "#40E0D0" }} onClick={() => {
                                        console.log(row.row);
                                        navigate('/updateCategory', {
                                            state: {
                                                _id: row.row._id,
                                                category_image: row.row.category_image,
                                                category_name: row.row.category_name,

                                            }
                                        })
                                    }
                                    }
                                    />
                                </Tooltip>
                            </IconButton>

                            <IconButton onClick={() => {
                                setDeleteID(row.row._id);
                                handleOpendelmodal();
                            }}>
                                <Tooltip title="Delete">
                                    <Delete sx={{ color: "#E10006" }} onClick={() => {
                                        setDeleteID(row.row._id);
                                        handleOpendelmodal();
                                    }} />
                                </Tooltip>
                            </IconButton>
                        </div>
                    </>
                );
            },
        },
    ];
    const [Logos, setLogos] = useState([]);
    useEffect(() => {
        // getAllScreens();
        getAllLogos();
    }, [])


    const getAllLogos = async () => {
        setIsloading(true);
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
                if (response.status === true) {
                    // setLogos(response.count);
                    console.log(response.result);
                    setIsloading(false);
                    setLogos(response.result);
                } else {
                    setIsloading(false);
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
                setIsloading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    confirmButtonColor: "#B5030B",
                    text: error.message
                })
            });
    }


    return (
        <>
            <Box sx={{ height: "100%", width: "100%", overflowX: "scroll" }}>

                <Grid container pt={{ lg: 2, xl: 1 }} >
                    <Grid item md={5.3} xs={12} align="left" pt={1}>
                        <Typography variant="h5" fontWeight={750} fontSize="20px" sx={{ ml: '2%', letterSpacing: "2px" }} color="#404040">
                            Manage Categories
                        </Typography>
                    </Grid>
                    <Grid item md={4} xs={12} align="right" pt={0} sx={{ mr: { xs: '3%', md: '0%' }, mb: { xs: '3%', md: '0%' } }}>
                        {/* <Autocomplete
              sx={{ height: '18px' }} // Adjust the height as needed
              id="demo-simple-select"
              options={Screens}
              getOptionLabel={(option) => option.name}
              value={Screen}
              onChange={(event, newValue) => handleChangeScreen(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={Screen ? Screen.name : ''}
                />
              )}
            /> */}
                    </Grid>

                    <Grid item md={2.7} xs={12} align="right">
                        <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'right', gap: '10px', width: '100%' }}>
                            <div style={{ width: '100px', borderRadius: "5px", border: "1px solid #D8D8D8", padding: "5px", paddingBottom: "0px", display: "flex", justifyContent: "center", alignContent: "center", gap: "3px" }}>
                                {
                                    showtable ?
                                        <>
                                            <Box onClick={() => { setShowtable(true) }}>
                                                <List fontSize="large" sx={{ cursor: 'pointer', color: "white", background: COLORS.buttonColor, borderRadius: "5px" }} />
                                            </Box>
                                            <Box onClick={() => setShowtable(false)}>
                                                <Apps fontSize="large" sx={{ cursor: 'pointer', color: COLORS.buttonColor, backgroundColor: "transparent", borderRadius: "5px" }} />
                                            </Box>
                                        </>
                                        :
                                        <>
                                            <Box onClick={() => setShowtable(true)}>
                                                <List fontSize="large" sx={{ cursor: 'pointer', color: "#9B9B9B", backgroundColor: "transparent", borderRadius: "5px" }} />
                                            </Box>
                                            <Box onClick={() => setShowtable(false)}>
                                                <Apps fontSize="large" sx={{ cursor: 'pointer', color: "white", background: COLORS.buttonColor, borderRadius: "5px" }} />
                                            </Box>
                                        </>
                                }
                            </div>

                            <button onClick={() => navigate("/AddCategory")} style={{
                                cursor: 'pointer', marginRight: '3%', padding: "10px", border: "none", borderRadius: "50px",
                                background: COLORS.buttonColor, color: "white"
                            }}>
                                <Stack direction="row" sx={{ display: "flex", justifyContent: "center", alignContent: "center", gap: "3px" }}>
                                    <div>
                                        <Stack sx={{ paddingLeft: "20px" }}>
                                            <Add sx={{ fontWeight: 600, width: "24dpi" }} />
                                        </Stack>
                                    </div>

                                    <div>
                                        <Stack sx={{ marginLeft: "2vh", paddingTop: "0.5vh", paddingRight: "25px", fontWeight: "bold" }}>Add</Stack>
                                    </div>
                                </Stack>
                            </button>
                        </div>
                    </Grid>

                </Grid>

                <Divider sx={{ pb: 2 }} />
                {isloading ?
                    <Grid sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: "center",
                        alignItems: 'center',
                        height: "100%", width: "100%"
                        // backgroundColor:'red'

                    }} >
                        <div className="loader">
                        </div>
                    </Grid>

                    :


                    <Grid mb='6%' container spacing={0} pt={2}  >
                        {
                            showtable ?
                                <Grid xs={12} p={1} align="center">
                                    <div style={{ height: '76vh', width: '100%', overflowX: 'auto', maxWidth: '100%' }}>
                                        <DataGrid
                                            rows={Logos}
                                            getRowId={(Logos) => Logos._id}
                                            id={Logos._id}
                                            getRowClassName={(params) => {
                                                return 'unblock-row'
                                            }}

                                            columns={columns}
                                            initialState={{
                                                pagination: {
                                                    paginationModel: { page: 0, pageSize: 5 },
                                                },
                                            }}
                                            pageSizeOptions={[5, 10]}
                                            // checkboxSelection
                                            components={{
                                                Checkbox: ({ value }) => (
                                                    <Checkbox style={{ color: 'red' }} checked={Logos.id} />
                                                ),
                                            }}
                                        />
                                    </div>
                                </Grid>
                                :
                                <>
                                    {Logos.map((item, index) => (
                                        <Grid item xs={12} md={3} lg={3} align="center" p={1} key={index}>
                                            <Card
                                                sx={{
                                                    borderRadius: '10px',
                                                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.22)',
                                                    border: '1px solid #D8D8D8',
                                                }}
                                            >
                                                <CardContent>
                                                    <Grid container spacing={1}>
                                                        {/* <Grid item xs={12} align="right">
                              <MoreVert
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={(event) => {
                                  setIdData(item);
                                  setAnchorEl(event.currentTarget);
                                }}
                                sx={{ cursor: 'pointer', color: '#1F1F1F' }}
                              />
                            </Grid> */}

                                                        <Grid item xs={12} align="center" onClick={() => { setViewData(item); handleOpenmodal(); }}>
                                                            <Avatar
                                                                src={`${url}${item.category_image}`}
                                                                variant="rounded"
                                                                sx={{
                                                                    borderRadius: "100px",
                                                                    width: '180px',
                                                                    height: '180px',
                                                                    bgcolor: COLORS.color1,
                                                                    margin: '0 auto',
                                                                    cursor: 'pointer',
                                                                    transition: 'transform 0.2s',
                                                                    '&:hover': {
                                                                        transform: 'scale(1.1)',
                                                                    },

                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} align="center">
                                                            <Divider sx={{ width: '80%' }} />
                                                        </Grid>


                                                        <Grid item xs={12} sx={{ pb: 1 }} align="center" onClick={() => { setViewData(item); handleOpenmodal(); }}>
                                                            <Typography variant="h5" fontWeight={600} fontSize="16px" sx={{ letterSpacing: "2px" }} color="#1F1F1F">
                                                                {item.category_name}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>

                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}

                                    {/* {Logos.map((item, index) => (
                                        <Grid xs={12} md={3} lg={3} align="center" p={1}>
                                            <Card width="95%" sx={{ padding: 0, boxShadow: "none", borderRadius: "10px", border: "1px solid #D8D8D8" }}>
                                                <CardContent>
                                                    <Grid container spacing={0} >
                                                        <Grid xs={6} align="left" onClick={() => { setViewData(item); handleOpenmodal(); }}>
                                                            <Typography variant="h5" pb={1} fontWeight={750} fontSize="16px" sx={{ letterSpacing: "2px" }} color="#B5030B">
                                                                {item.category_name}
                                                            </Typography>
                                                        </Grid>

                                                        <Grid xs={6} align="right">
                                                            <div>
                                                                <MoreVert
                                                                    id="basic-button"
                                                                    aria-controls={open ? 'basic-menu' : undefined}
                                                                    aria-haspopup="true"
                                                                    aria-expanded={open ? 'true' : undefined}
                                                                    // onClick={handleClick} 
                                                                    onClick={(event) => {
                                                                        setIdData(item)
                                                                        setAnchorEl(event.currentTarget)
                                                                    }}
                                                                    sx={{ cursor: 'pointer', color: "#1F1F1F" }} />
                                                            </div>
                                                            <Menu
                                                                id="basic-menu"
                                                                anchorEl={anchorEl}
                                                                open={open}
                                                                onClose={handleClose}
                                                                MenuListProps={{
                                                                    'aria-labelledby': 'basic-button',
                                                                }}
                                                                PaperProps={{

                                                                    sx: {
                                                                        position: 'fixed',
                                                                        top: '-9999px',
                                                                        left: '-9999px',
                                                                        elevation: 0,
                                                                        // overflow: 'visible',
                                                                        // filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.22))',
                                                                        mt: 1.5,
                                                                        '& .MuiAvatar-root': {
                                                                            width: 32,
                                                                            height: 32,
                                                                            ml: -0.5,
                                                                            mr: 1,
                                                                        },
                                                                        '&:before': {
                                                                            content: '""',
                                                                            display: 'block',
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            right: 5,
                                                                            width: 10,
                                                                            height: 10,
                                                                            bgcolor: 'background.paper',
                                                                            transform: 'translateY(-50%) rotate(45deg)',
                                                                            zIndex: 0,
                                                                        },
                                                                    },
                                                                }}
                                                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                                            >

                                                                <MenuItem
                                                                    onClick={() => {
                                                                        console.log(idData);
                                                                        setActionData(idData);
                                                                        // if (idData.image !== null) {
                                                                        //   setHidelabelUpload(true);
                                                                        // }
                                                                        navigate('/updateCategory', {
                                                                            state: {
                                                                                _id: idData._id,
                                                                                category_image: idData.category_image,
                                                                                category_name: idData.category_name,
                                                                            }
                                                                        })

                                                                    }
                                                                    }
                                                                >
                                                                    <Edit sx={{ color: "#40E0D0" }} /><span style={{ marginLeft: 10 }}>Update</span>



                                                                </MenuItem>
                                                                <Grid container spacing={0}>
                                                                    <Grid xs={12} align="center">
                                                                        <Divider sx={{ width: "80%" }} />
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid container spacing={0}>
                                                                    <Grid xs={12} align="center">
                                                                        <Divider sx={{ width: "80%" }} />
                                                                    </Grid>
                                                                </Grid>

                                                                <MenuItem onClick={() => {
                                                                    setDeleteID(idData._id);
                                                                    handleOpendelmodal();
                                                                }}>
                                                                    <Delete sx={{ color: "#E10006" }} /><span style={{ marginLeft: 10 }}>Delete</span>
                                                                </MenuItem>
                                                            </Menu>

                                                        </Grid>



                                                        <Grid xs={6} sx={{ pb: 1 }} align="left" onClick={() => { setViewData(item); handleOpenmodal(); }}>
                                                            <Typography variant="h5" fontWeight={600} fontSize="16px" sx={{ letterSpacing: "2px" }} color="#1F1F1F">
                                                                category name :
                                                            </Typography>
                                                        </Grid>

                                                        <Grid sx={{ pb: 1, width: '100px', height: '50px' }} xs={6} align="left">
                                                            <Typography variant="h5" fontWeight={600} fontSize="16px" sx={{ letterSpacing: "2px" }} color="#1F1F1F">
                                                                {item.category_name}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))} */}

                                </>
                        }
                    </Grid>
                }


                {/* view */}
                <Modal
                    open={openmodal}
                    // onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box width={{ xs: 400, md: 500, lg: 600, xl: 650 }} height="auto" sx={styleview}>
                        <Box sx={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px", background: COLORS.buttonColor, width: "100%", height: "80px" }}>
                            <div xs={12} align="right" pt={0.6} pr={3}>
                                <Cancel sx={{ marginRight: '10px', marginTop: "5px", color: "white" }} onClick={() => setOpenmodal(false)} />
                            </div>
                            <Box xs={12} sx={{ mb: '20px' }} align="center">
                                <Typography align="center" sx={{ mb: '20px', fontWeight: 600, fontSize: "24px" }} color="white">
                                    {viewData.category_name}
                                </Typography>
                            </Box>
                        </Box>
                        <Grid xs={12} align="center" pt={3}>
                            {viewData.image !== null ?
                                <img alt="" src={`${url}${viewData.category_image}`} style={{ bgcolor: "#B5030B", width: '175px', height: '175px' }}>
                                </img>
                                :
                                <Avatar sx={{ bgcolor: "#B5030B", width: 75, height: 75 }}>
                                </Avatar>
                            }
                        </Grid>

                    </Box>
                </Modal>


                {/* del */}
                <Modal
                    open={opendelmodal}
                    // onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box width={{ xs: 400, md: 500, lg: 500, xl: 600 }} height="auto" sx={style}>
                        <Grid container spacing={0}>
                            <Grid xs={12} align="right">
                                <Close onClick={() => setOpendelmodal(false)} />
                            </Grid>

                            <Grid xs={12} align="center" p={{ xs: 2, md: 5, lg: 1, xl: 1 }}>
                                <Typography variant="h4" sx={{ letterSpacing: "3px" }} fontWeight={600} fontSize="x-large" color={COLORS.buttonColor}>Confirmation</Typography>

                                <Typography variant="h5" sx={{ letterSpacing: "3px" }} pt={7} pb={0} fontWeight={600} color="#1F1F1F">Do you want to delete this Category?</Typography>  </Grid>
                        </Grid>

                        <Grid container spacing={0} pt={7}>
                            <Grid xs={6} align="">
                                <Button variant="contained" style={btncancel} onClick={() => { setOpendelmodal(false) }}>Cancel</Button>
                            </Grid>

                            <Grid xs={6} align="right">
                                <Button variant="contained" style={btn} onClick={() => { handleDelete() }}>Delete</Button>
                            </Grid>
                        </Grid>

                    </Box>
                </Modal>

            </Box>
        </>
    );
};

export default Team;