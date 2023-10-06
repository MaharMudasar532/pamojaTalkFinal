import {
  Box, Tooltip, Typography, IconButton
  , Grid, Modal, Button, Stack, Card, CardContent, MenuItem, Menu, Divider, Avatar
} from "@mui/material";
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import COLORS from "../../utils/COLORS"

import Swal from 'sweetalert2'
import ImageListItem from '@mui/material/ImageListItem';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import url from "../../utils/BaseURL"
import { Add, List, Apps, MoreVert } from '@mui/icons-material';
import React, { useState, useEffect } from "react";
import { Checkbox } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Cancel, Close, Delete, Edit, Visibility } from "@mui/icons-material";
import './index.css'

const btncancel = {
  width: '90%',
  letterSpacing: "2px",
  marginBottom: '40px',
  color: COLORS.color1,
  backgroundColor: '#ffffff',
  border: '1px solid #F72E8E',
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
  borderColor: '#B5030B',
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
  const [viewData, setViewData] = useState([]);

  const [viewImage, setViewImage] = useState([]);
  const [idData, setIdData] = useState([]);
  const [ActionData, setActionData] = React.useState({});
  const [ImgsWidth, setImgsWidth] = useState(900);

  const [openmodal, setOpenmodal] = useState(false);
  const handleOpenmodal = () => setOpenmodal(true);
  const handleClosemodal = () => setOpenmodal(false);
  const [DeleteID, setDeleteID] = React.useState('');

  const [opendelmodal, setOpendelmodal] = useState(false);
  const handleOpendelmodal = () => {
    setOpendelmodal(true);
    setAnchorEl(null);
  };
  const handleClosedelmodal = () => setOpendelmodal(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [showtable, setShowtable] = useState(true);


  const handleDelete = async () => {
    var InsertAPIURL = `${url}item/delete`
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    var Data = {
      "item_id": DeleteID,
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
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            confirmButtonColor: "#B5030B",
            text: 'Item Deleted Successfully!',
          })
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



  const columns = [
    {
      field: 'email',
      headerName: <span style={{ color: "black", fontWeight: 600 }}>Post By</span>,
      minWidth: 200,
      renderCell: (row) => {
        return (
          <>

            {row.row.user_email ?
              < Button sx={{ border: 'none', cursor: 'pointer' }}
                color="success"
                onClick={() => {
                  navigate('/Orders', {
                    state: {
                      id: row.row.user_email,
                    }
                  })
                }
                }
                variant="outlined">
                {row.row.user_email}
              </Button>
              :
              < Button sx={{ border: 'none', cursor: 'pointer' }}
                color="success"
                onClick={() => {
                  navigate('/Orders', {
                    state: {
                      id: row.row.admin_id,
                    }
                  })
                }
                }
                variant="outlined">
                {row.row.admin_email}
              </Button>
            }
          </>
        );
      },

    },
    {
      field: 'image', headerName: <span style={{ color: "black", fontWeight: 600 }}>User Image</span>,
      minWidth: 100,
      renderCell: (row) => {
        return (
          <>
            {row.row.user_image ?
              <Avatar src={`${url}${row.row.user_image}`} style={{ bgcolor: "#B5030B", width: '45px', height: '45px' }}>
              </Avatar>

              :
              row.row.admin_image ?
                <Avatar src={`${url}${row.row.admin_image}`} style={{ bgcolor: "#B5030B", width: '45px', height: '45px' }}>
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
      field: 'price',
      headerName: <span style={{ color: "black", fontWeight: 600 }}>Price</span>,
      minWidth: 150,
    },
    {
      field: 'images', headerName: <span style={{ color: "black", fontWeight: 600 }}>Post  Image</span>,
      minWidth: 100,
      renderCell: (row) => {
        return (
          <>
            {row.row.images.length > 0 ?
              <Avatar src={`${url}${row.row.images[0]}`} style={{ bgcolor: "#B5030B", width: '45px', height: '45px' }}>
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
      field: 'item_name',
      headerName: <span style={{ color: "black", fontWeight: 600 }}>item name</span>,
      minWidth: 150,
    },

    {
      field: 'description',
      headerName: <span style={{ color: "black", fontWeight: 600 }}>Description</span>,
      minWidth: 250, flex: 1,
    },

    {
      field: '_id',
      headerName: <span style={{ color: "black", fontWeight: 600 }}>Actions</span>,
      minWidth: 150,
      renderCell: (row) => {
        return (
          <>
            <div>
              <IconButton onClick={() => {
                setViewData(row.row);
                if (row.row.images.length == 5) {
                  setImgsWidth(900);
                } else if (row.row.images.length == 4) {
                  setImgsWidth(800);
                } else {
                  setImgsWidth(600);
                }
                setViewImage(row.row.images)
                  ; console.log(row.row);
                handleOpenmodal()
              }} >
                <Tooltip title="view" >
                  <Visibility sx={{ color: "#3FC0FF" }} onClick={() => {
                    setViewData(row.row); if (row.row.images.length == 5) {
                      setImgsWidth(900);
                    } else if (row.row.images.length == 4) {
                      setImgsWidth(800);
                    } else {
                      setImgsWidth(600);
                    }
                    setViewImage(row.row.images); console.log(row.row);
                    handleOpenmodal()
                  }} />
                </Tooltip>
              </IconButton>
              {admin_id === row.row.user_id &&
                <>
                  <IconButton onClick={() => {
                    console.log(row.row);
                    navigate('/EditItem', {
                      state: {
                        _id: row.row._id,
                        images: row.row.images,
                        admin_id: row.row.admin_id,
                        row: row.row,
                        description: row.row.description,
                        location: row.row.location,
                        item_name: row.row.item_name,
                        condition: row.row.condition,
                        price: row.row.price,
                        category_id: row.row.category_id,
                        category_name: row.row.category_name
                      },
                    })
                  }
                  }>
                    <Tooltip title="edit" >
                      <Edit sx={{ color: "#40E0D0" }} onClick={() => {
                        console.log(row.row);
                        navigate('/EditItem', {
                          state: {
                            _id: row.row._id,
                            images: row.row.images,
                            admin_id: row.row.admin_id,
                            row: row.row,
                            description: row.row.description,
                            location: row.row.location,
                            item_name: row.row.item_name,
                            condition: row.row.condition,
                            price: row.row.price,
                            category_id: row.row.category_id,
                            category_name: row.row.category_name

                          },
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
                </>
              }
            </div>
          </>
        );
      },
    },
  ];
  const [Logos, setLogos] = useState([]);
  const [admin_id, setadmin_id] = useState('');

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('admin_data'))
    setadmin_id(admin.admin_id)
    getAllLogos();
  }, [])

  const getAllLogos = async () => {
    setIsloading(true)
    var InsertAPIURL = `${url}item/view_all`
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
          setLogos(response.result);
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
          text: "Server Down!"
        })
      });
  }

  return (
    <>
      <Box sx={{ height: "100%", width: "100%", overflowX: "scroll" }}>
        <Grid container pt={{ lg: 2, xl: 1 }} >
          <Grid item md={6} xs={12} align="left" pt={1}>
            <Typography variant="h5" fontWeight={750} fontSize="20px" sx={{ ml: '2%', letterSpacing: "2px" }} color="#404040">
              Manage Products
            </Typography>
          </Grid>

          <Grid item md={6} xs={12} align="right">
            <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'right', gap: '10px', width: '100%' }}>
              <div style={{ width: '100px', borderRadius: "5px", border: "1px solid #D8D8D8", padding: "5px", paddingBottom: "0px", display: "flex", justifyContent: "center", alignContent: "center", gap: "3px" }}>
                {
                  showtable ?
                    <>
                      <Box onClick={() => { setShowtable(true) }}>
                        <List fontSize="large" sx={{ cursor: 'pointer', color: "white", background: COLORS.buttonColor, borderRadius: "5px" }} />
                      </Box>
                      <Box onClick={() => setShowtable(false)}>
                        <Apps fontSize="large" sx={{ cursor: 'pointer', color: "#9B9B9B", backgroundColor: "transparent", borderRadius: "5px" }} />
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

              <button onClick={() => navigate("/AddItem")} style={{ marginRight: '3%', padding: "10px", border: "none", borderRadius: "50px", background: COLORS.buttonColor, color: "white" }}>
                <Stack direction="row" sx={{ display: "flex", justifyContent: "center", alignContent: "center", gap: "3px" }}>
                  <div>
                    <Stack sx={{ paddingLeft: "20px" }}>
                      <Add sx={{ cursor: 'pointer', fontWeight: 600, width: "24dpi" }} />
                    </Stack>
                  </div>

                  <div>
                    <Stack sx={{ cursor: 'pointer', marginLeft: "2vh", paddingTop: "0.5vh", paddingRight: "25px", fontWeight: "bold" }}>Add</Stack>
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
                          <Checkbox style={{ color: 'red' }} checked={Logos._id} />
                        ),
                      }}
                    />
                  </div>
                </Grid>
                :
                <>
                  {Logos.map((item, index) => (
                    <Grid item xs={12} md={4} lg={4} align="center" p={1} key={index}>
                      <Card
                        sx={{
                          borderRadius: '10px',
                          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.22)',
                          border: '1px solid #D8D8D8',
                        }}
                      >
                        <CardContent>
                          <Grid container spacing={1}>


                            <Grid item xs={12} align="center" onClick={() => { setViewData(item); handleOpenmodal(); }}>
                              <Avatar
                                src={`${url}${item.images[0]}`}
                                variant="rounded"
                                sx={{
                                  borderRadius: '100px',
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
                              >
                              </Avatar>
                            </Grid>

                            <Grid item xs={12} align="center">
                              <Divider sx={{ width: '80%' }} />
                            </Grid>
                            <Grid item xs={12} align="center" onClick={() => { setViewData(item); handleOpenmodal(); }}>
                              <Typography variant="h5" fontWeight={600} fontSize="16px" color={COLORS.color1}>
                                {item.item_name}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ pb: 1 }} align="left" onClick={() => { setViewData(item); handleOpenmodal(); }}>
                              <Typography variant="h5" fontWeight={600} fontSize="16px" color="#1F1F1F">
                                user:
                              </Typography>
                            </Grid>
                            <Grid item xs={6} align="right">
                              <PerfectScrollbar >
                                <Typography maxHeight='45px' variant="h5" fontWeight={600} fontSize="16px" color="#1F1F1F">
                                  {item.user_name}
                                </Typography>
                              </PerfectScrollbar >
                            </Grid>
                            <Grid item xs={6} sx={{ pb: 1 }} align="left" onClick={() => { setViewData(item); handleOpenmodal(); }}>
                              <Typography variant="h5" fontWeight={600} fontSize="16px" color="#1F1F1F">
                                Condition:
                              </Typography>
                            </Grid>
                            <Grid item xs={6} align="right">
                              <PerfectScrollbar >
                                <Typography maxHeight='45px' variant="h5" fontWeight={600} fontSize="16px" color="#1F1F1F">
                                  {item.condition}
                                </Typography>
                              </PerfectScrollbar >
                            </Grid>
                            <Grid item xs={6} sx={{ pb: 1 }} align="left" onClick={() => { setViewData(item); handleOpenmodal(); }}>
                              <Typography variant="h5" fontWeight={600} fontSize="16px" color="#1F1F1F">
                                Description:
                              </Typography>
                            </Grid>
                            <Grid item xs={6} align="right">
                              <PerfectScrollbar >
                                <Typography maxHeight='45px' variant="h5" fontWeight={600} fontSize="16px" color="#1F1F1F">
                                  {item.description}
                                </Typography>
                              </PerfectScrollbar>

                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}

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
            <Box sx={{
              borderTopLeftRadius: "20px", borderTopRightRadius: "20px",
              background: COLORS.buttonColor, width: "100%", height: "80px"
            }}>
              <div xs={12} align="right" pt={0.6} pr={3}>
                <Cancel sx={{ marginRight: '10px', marginTop: "5px", color: "white" }} onClick={() => setOpenmodal(false)} />
              </div>
              <Box xs={12} sx={{ mb: '20px' }} align="center">
                <Typography align="center" sx={{ mb: '20px', fontWeight: 600, fontSize: "24px" }} color="white">
                  {viewData.item_name}
                </Typography>
              </Box>
            </Box>

            {
              viewImage.length > 0 ?
                <PerfectScrollbar position="flex" >
                  <Grid container sx={{ width: `${ImgsWidth}px`, mt: '10px', ml: '10px', mr: '10px', maxHeight: '200px' }}>
                    {viewImage.length > 0 &&
                      <ImageListItem key={viewImage.name}>
                        <img alt="" src={`${url}${viewImage[0]}`} style={{ bgcolor: "#B5030B", width: '175px', height: 'auto' }}>
                        </img>
                      </ImageListItem>
                    }
                    {viewImage.length > 1 &&
                      <ImageListItem sx={{ ml: '2px' }} key={viewImage.name}>
                        <img alt="" src={`${url}${viewImage[1]}`} style={{ bgcolor: "#B5030B", width: '175px', height: 'auto' }}>
                        </img>
                      </ImageListItem>
                    }
                    {viewImage.length > 2 &&
                      <ImageListItem sx={{ ml: '2px' }} key={viewImage.name}>
                        <img alt="" src={`${url}${viewImage[2]}`} style={{ bgcolor: "#B5030B", width: '175px', height: 'auto' }}>
                        </img>
                      </ImageListItem>

                    }
                    {viewImage.length > 3 &&
                      <ImageListItem sx={{ ml: '2px' }} key={viewImage.name}>
                        <img alt="" src={`${url}${viewImage[3]}`} style={{ bgcolor: "#B5030B", width: '175px', height: 'auto' }}>
                        </img>
                      </ImageListItem>
                    }
                    {viewImage.length > 4 &&
                      <ImageListItem sx={{ ml: '2px' }} key={viewImage.name}>
                        <img alt="" src={`${url}${viewImage[4]}`} style={{ bgcolor: "#B5030B", width: '200px', height: 'auto' }}>
                        </img>
                      </ImageListItem>
                    }
                  </Grid>
                </PerfectScrollbar>
                :
                <Grid xs={12} align="center" pt={3}>
                  <Avatar sx={{ bgcolor: "#B5030B", width: 75, height: 75 }}>
                    <Typography variant="paragraph" sx={{ textTransform: "uppercase", fontSize: "18px", fontWeight: 600 }} p={1} color="white">
                    </Typography>
                  </Avatar>
                </Grid>
            }


            <Grid container spacing={0} p={2}>
              <Grid xs={6} align="" p={0.5}>
                <Typography variant="h5" fontWeight={700} fontSize="16px" sx={{ letterSpacing: "2px" }} color="#1F1F1F">
                  location :
                </Typography>
              </Grid>

              <Grid xs={6} align="right" p={0.5}>
                <Typography variant="h5" fontWeight={600} fontSize="16px" sx={{ letterSpacing: "2px" }} color="#808080">
                  {viewData.location}
                </Typography>
              </Grid>

              <Grid xs={6} align="" p={0.5}>
                <Typography variant="h5" fontWeight={700} fontSize="16px" sx={{ letterSpacing: "2px" }} color="#1F1F1F">
                  condition :
                </Typography>
              </Grid>

              <Grid xs={6} align="right" p={0.5}>
                <Typography variant="h5" fontWeight={600} fontSize="16px" sx={{ letterSpacing: "2px" }} color="#808080">
                  {viewData.condition}
                </Typography>
              </Grid>


              <Grid xs={6} align="" p={0.5}>
                <Typography variant="h5" fontWeight={700} fontSize="16px" sx={{ letterSpacing: "2px" }} color="#1F1F1F">
                  price :
                </Typography>
              </Grid>

              <Grid xs={6} align="right" p={0.5}>
                <Typography variant="h5" fontWeight={600} fontSize="16px" sx={{ letterSpacing: "2px" }} color="#808080">
                  {viewData.price}
                </Typography>
              </Grid>

              <Grid xs={6} align="" p={0.5}>
                <Typography variant="h5" fontWeight={700} fontSize="16px" sx={{ letterSpacing: "2px" }} color="#1F1F1F">
                  user :
                </Typography>
              </Grid>

              <Grid xs={6} align="right" p={0.5}>
                <Typography variant="h5" fontWeight={600} fontSize="16px" sx={{ letterSpacing: "2px" }} color="#808080">
                  {viewData.user_name}
                </Typography>
              </Grid>

              <Grid xs={6} align="" p={0.5}>
                <Typography variant="h5" fontWeight={700} fontSize="16px" sx={{ letterSpacing: "2px" }} color="#1F1F1F">
                  Description :
                </Typography>
              </Grid>


              <Grid xs={6} align="right" p={0.5}>
                <Typography variant="h5"
                  fontWeight={600} fontSize="14px" sx={{ height: '100px' }}
                  color="#808080">
                  <PerfectScrollbar>
                    {viewData.description}
                  </PerfectScrollbar>

                </Typography>
              </Grid>


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
                <Typography variant="h4" sx={{ letterSpacing: "3px" }} fontWeight={600} fontSize="x-large" color="#B5030B">Confirmation</Typography>

                <Typography variant="h5" sx={{ letterSpacing: "3px" }} pt={7} pb={0} fontWeight={600} color="#1F1F1F">Do you want to delete this Product?</Typography>  </Grid>
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
