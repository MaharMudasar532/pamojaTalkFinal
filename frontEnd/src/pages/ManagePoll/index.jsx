import {
  Box, Tooltip, Typography, useTheme, IconButton
  , Grid, Modal, Button, Stack, Card, CardContent, MenuItem, Menu, Divider, Avatar
} from "@mui/material";
import Chip from '@mui/material/Chip';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'

import Swal from 'sweetalert2'
import PropTypes from 'prop-types';
import url from "../../utils/BaseURL"
import { useNavigate } from 'react-router-dom';
import { tokens } from "../../theme";
import { InsertLink, Autorenew, Add, List, Apps, MoreVert } from '@mui/icons-material';
import React, { useState, useEffect } from "react";
import {
  DataGrid,
} from '@mui/x-data-grid';
import { Close, Cancel, Delete, Edit, Visibility } from "@mui/icons-material";
import "./index.css";
import COLORS from "../../utils/COLORS";


const btncancel = {
  width: '90%',
  letterSpacing: "2px",
  marginBottom: '40px',
  color: COLORS.color1,
  backgroundColor: '#ffffff',
  border: `1px solid ${COLORS.color1}`,
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
  const [AnchorElStatus, setAnchorElStatus] = React.useState(null);
  const [Data, setData] = React.useState([]);

  const [isloading, setIsloading] = useState(false);
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");
  const [viewData, setViewData] = useState([]);
  const [opendelmodalStatus, setOpendelmodalStatus] = useState(false);
  const handleOpendelmodalStatus = (row) => {
    setData(row);
    setOpendelmodalStatus(true);
    setAnchorElStatus(null);
  };
  const handleClosedelmodalStatus = () => setOpendelmodalStatus(false);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [DeleteData, setDeleteData] = useState([]);
  const [idData, setIdData] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


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
  const [Screens, setScreens] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };



  const [showtable, setShowtable] = useState(true);

  const changeStatus = async (data) => {

    var InsertAPIURL = `${url}logos/update_logo_status`
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
      "logo_id": data.id,
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
        if (response.message == `Logo Updated Successfully!`) {
          setOpendelmodalStatus(false);
          getAllLogos();
          Swal.fire({
            icon: 'success',
            title: 'Success...',
            confirmButtonColor: "#B5030B",
            text: 'Change Successfully'
          })
          // setOpendelmodal(false);
          //   console.log(response.result);
          //   setCatagory(response.result);
        } else {
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
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          confirmButtonColor: "#B5030B",
          text: "Server Down!"
        })
      });
  }

 



  const handleDelete = async () => {
    var InsertAPIURL = `${url}Pole/delete`
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    var Data = {
      "pole_id": DeleteID,
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
            confirmButtonColor: COLORS.color1,
            text: 'Poll Deleted Successfully!',
          })
          getAllLogos();
          setOpendelmodal(false);
          //   console.log(response.result);
          //   setCatagory(response.result);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            confirmButtonColor: COLORS.color1,
            text: ''
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



  const columns = [
    {
      field: 'question', headerName: <span style={{ color: "black", fontWeight: 600 }}>Question</span>,
      minWidth: 200,
    },

    {
      field: 'options.option_text',
      headerName: <span style={{ color: "black", fontWeight: 600 }}>Options</span>,
      minWidth: 150, flex: 1,
      renderCell: (row) => {
        return (
          <>
            {row.row.options !== undefined && row.row.options.length > 0 && (
              // eslint-disable-next-line array-callback-return
              <Typography color="success" variant="outlined">
                {row.row.options.map((option) => (
                  // You should directly render option.option_text here
                  `${option.option_text} , `
                ))}
              </Typography>
            )}
          </>

        );
      },
    },
    {
      field: 'options',
      headerName: <span style={{ color: "black", fontWeight: 600 }}>Votes</span>,
      minWidth: 200,
      renderCell: (row) => {
        return (
          <>
            {row.row.options.map((option) => (
              < Chip sx={{ ml: "2%" }} label={option.option_vote_count}
                color="success" variant="outlined" />
            ))}
          </>

        );
      },
    },

    {
      field: 'id',
      headerName: <span style={{ color: "black", fontWeight: 600 }}>Actions</span>,
      minWidth: 150,
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
                navigate('/UpdatePoll', {
                  state: {
                    pole_id: row.row.pole_id,
                    question: row.row.question,
                    options: row.row.options,
                    row: row.row,

                  }
                })
              }
              } >
                <Tooltip title="edit" >
                  <Edit sx={{ color: "#40E0D0" }} onClick={() => {
                    console.log(row.row);
                    navigate('/UpdatePoll', {
                      state: {
                        pole_id: row.row.pole_id,
                        question: row.row.question,
                        options: row.row.options,
                        row: row.row,
                      }
                    })
                  }
                  }
                  />
                </Tooltip>
              </IconButton>
              <IconButton onClick={() => {
                setDeleteID(row.row.pole_id);
                handleOpendelmodal();
              }} >
                <Tooltip title="Delete" >
                  <Delete sx={{ color: "#E10006" }} onClick={() => {
                    setDeleteID(row.row.pole_id);
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
  const [Screen, setScreen] = React.useState({
    createdat: "2023-08-31T13:39:06.520Z",
    id: 0,
    name: "ALL Screens",
    updatedat: "your_updated_value_here",
  });

  const getAllLogos_ByScreen = async (newValue) => {
    var InsertAPIURL = `${url}logos/get_logos_by_screen`
    var headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const Data = {
      "screen_id": newValue.id
    }
    console.log(newValue)
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
          setLogos(response.result);
        } else {
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
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          confirmButtonColor: "#B5030B",
          text: "Server Down!"
        })
      });
  }


  const [Logos, setLogos] = useState([]);
  useEffect(() => {
    getAllLogos();
  }, [])

  const getAllLogos = async () => {
    setIsloading(true)
    var InsertAPIURL = `${url}Pole/view_all`
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
  return (
    <>


      <Box sx={{ height: "100%", width: "100%", overflowX: "scroll" }}>
        <Grid container pt={{ lg: 2, xl: 1 }} >
          <Grid item md={5.3} xs={12} align="left" pt={1}>
            <Typography variant="h5" fontWeight={750} fontSize="20px" sx={{ ml: '2%', letterSpacing: "2px" }} color="#404040">
              Manage Polls
            </Typography>
          </Grid>

          <Grid item md={4} xs={12} align="right" pt={0} sx={{ mr: { xs: '3%', md: '0%' }, mb: { xs: '3%', md: '0%' }, height: '22px' }}>


          </Grid>

          <Grid sx={{ mt: { md: '0', xs: '10%' } }} item md={2.7} xs={12} align="right">
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

              <button onClick={() => navigate("/AddPoll")} style={{ cursor: 'pointer', marginRight: '3%', padding: "10px", border: "none", borderRadius: "50px", background: COLORS.buttonColor, color: "white" }}>
                <Stack direction="row" sx={{ display: "flex", justifyContent: "center", alignContent: "center", gap: "3px" }}>
                  <div>
                    <Stack sx={{ cursor: 'pointer', paddingLeft: "20px" }}>
                      <Add sx={{ cursor: 'pointer', fontWeight: 600, width: "24dpi" }} />
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
          <>
            <Grid mb='6%' sx={{ mb: '20px' }} container spacing={0} pt={2} >
              {
                showtable ?
                  <Grid xs={24} p={1} align="center">
                    <div style={{ height: '76vh', width: '100%', overflowX: 'auto', maxWidth: '100%' }}>
                      <DataGrid
                        rows={Logos}
                        getRowId={(Logos) => Logos.pole_id}
                        id={Logos.pole_id}
                        columns={columns}
                        getRowClassName={(params) => {
                          return 'unblock-row'
                        }}
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                          },
                        }}
                        pageSizeOptions={[5, 10]}
                        //  checkboxSelection

                        components={
                          <Chip label='active_status' color="success" variant="outlined" />
                        }
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
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%', // Set a fixed height for each card
                          }}
                        >
                          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Grid container spacing={1}>
                              <Grid item xs={12} align="center" onClick={() => { setViewData(item); handleOpenmodal(); }}>
                                <Typography variant="h5" fontWeight={600} fontSize="16px" color={COLORS.color1}>
                                  {item.question}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} align="center">
                                <Divider sx={{ width: '80%' }} />
                              </Grid>
                              {item.options !== undefined && item.options.length > 0 &&
                                item.options.map((options, index) => (
                                  <React.Fragment key={index}>
                                    <Grid xs={6} align="center" p={0.5}>
                                      <PerfectScrollbar>
                                        <Typography variant="h5" fontWeight={700} fontSize="16px" sx={{ letterSpacing: "2px", maxHeight: '45px' }} color="#1F1F1F">
                                          {options.option_text}
                                        </Typography>
                                      </PerfectScrollbar>
                                    </Grid>
                                    <Grid xs={6} align="center" p={0.5}>
                                      <PerfectScrollbar>
                                        <Typography variant="h5" fontWeight={600} fontSize="16px" sx={{ letterSpacing: "2px", maxHeight: '45px' }} color="#808080">
                                          {options.option_vote_count}
                                        </Typography>
                                      </PerfectScrollbar>
                                    </Grid>
                                  </React.Fragment>
                                ))
                              }
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </>
              }
            </Grid>


            <Grid sx={{ mb: '13px' }} container spacing={0} pt={2} pl={2} pr={2} >
            </Grid>
          </>
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
                <Cancel sx={{ marginRight: '10px', marginTop: "10px", color: "white" }} onClick={() => setOpenmodal(false)} />
              </div>
              <Typography align="center" sx={{ mb: '90px', fontWeight: 600, fontSize: "24px" }} color="white">
                {viewData.question}
              </Typography>
            </Box>
            <Grid container spacing={0} p={2}>
              {viewData.options !== undefined && viewData.options.length > 0 &&
                // eslint-disable-next-line array-callback-return
                viewData.options.map((options, index) => (
                  <React.Fragment key={index}>
                    <Grid xs={6} align="center" p={0.5}>
                      <Typography variant="h5" fontWeight={700} fontSize="16px" sx={{ letterSpacing: "2px" }} color="#1F1F1F">
                        {options.option_text}
                      </Typography>
                    </Grid>

                    <Grid xs={6} align="center" p={0.5}>
                      <Typography variant="h5" fontWeight={600} fontSize="16px" sx={{ letterSpacing: "2px" }} color="#808080">
                        {options.option_vote_count}
                      </Typography>
                    </Grid>
                  </React.Fragment>
                ))
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
                <Typography variant="h4" sx={{ letterSpacing: "3px" }} fontWeight={600} fontSize="x-large" color={COLORS.color1}>Confirmation</Typography>

                <Typography variant="h5" sx={{ letterSpacing: "3px" }} pt={7} pb={0} fontWeight={600} color="#1F1F1F">Do you want to delete this Poll ?</Typography>  </Grid>
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
        {/* Change */}
        <Modal
          open={opendelmodalStatus}
          // onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box width={{ xs: 400, md: 500, lg: 500, xl: 600 }} height="auto" sx={style}>
            <Grid container spacing={0}>
              <Grid xs={12} align="right">
                <Close onClick={() => setOpendelmodalStatus(false)} />
              </Grid>

              <Grid xs={12} align="center" p={{ xs: 2, md: 5, lg: 1, xl: 1 }}>
                <Typography variant="h4" sx={{ letterSpacing: "3px" }} fontWeight={600} fontSize="x-large" color="#B5030B">Confirmation</Typography>
                {DeleteData.active_status === 'active' ?
                  <Typography variant="h5" sx={{ letterSpacing: "3px" }} pt={7}
                    pb={0} fontWeight={600} color="#1F1F1F">{`Do you want to Inactive logo?`}
                  </Typography>
                  :
                  <Typography variant="h5" sx={{ letterSpacing: "3px" }} pt={7}
                    pb={0} fontWeight={600} color="#1F1F1F">{`Do you want to Active Logo?`}
                  </Typography>

                }
              </Grid>
            </Grid>

            <Grid container spacing={0} pt={7}>
              <Grid xs={6} align="">
                <Button variant="contained" style={btncancel} onClick={() => { setOpendelmodalStatus(false) }}>Cancel</Button>
              </Grid>

              <Grid xs={6} align="right">
                {DeleteData.active_status === 'active' ?
                  <Button variant="contained" style={btn} onClick={() => { changeStatus(DeleteData) }}>Inactive</Button>
                  :
                  <Button variant="contained" style={btn} onClick={() => { changeStatus(DeleteData) }}>Active</Button>
                }
              </Grid>
            </Grid>

          </Box>
        </Modal>


      </Box>

    </>
  );
};

export default Team;


