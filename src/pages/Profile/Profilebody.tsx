import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import Box from '@mui/material/Box'

import { makeStyles } from '@material-ui/core/styles'
import { urlToFile } from 'utils/urlToFile'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Dropzone from 'react-dropzone'
import classnames from 'classnames'
import Avatar from 'react-avatar-edit'
import Modal from 'react-modal'
import * as yup from 'yup'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import ErrorMessage from 'components/ErrorMessage'
import PasswordCheck from 'components/PasswordChecks'
import { useAppSelector } from 'hooks/useApp'
import { userSelector } from 'store/userReducer'

// const PrettoSlider = withStyles({
//   root: {
//     color: "#1C39BB",
//     height: 4,
//   },
//   thumb: {
//     height: 22,
//     width: 22,
//     backgroundColor: "#1C39BB",
//     // border: "2px solid currentColor",
//     marginTop: -8,
//     marginLeft: -12,
//     "&:focus, &:hover, &$active": {
//       boxShadow: "inherit",
//     },
//   },
//   active: {},
//   valueLabel: {
//     left: "calc(-50% + 4px)",
//   },
//   track: {
//     height: 4,
//     borderRadius: 4,
//   },
//   rail: {
//     height: 4,
//     borderRadius: 4,
//   },
// })(Slider);
interface FormInputs {
  firstName: string
  lastName: string
  email: string
  password: string
  oldPassword: string
}

const schema = yup
  .object({
    firstName: yup.string().required('First Name field is required'),
    lastName: yup.string().required('Last Name field is required'),
    email: yup.string().email('Email field must be a valid email'),
    password: yup
      .string()
      .required('Password field is required')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/,
        'Invalid password format'
      ),
    oldPassword: yup.string().required('Password field is required')
  })
  .required()

const Profilebody: React.FC = () => {
  const classes = useStyles()
  const [showModal, setShowModal] = useState(false)

  const [file, setFile] = useState<null | File>()
  const [fileUrl, setFileUrl] = useState('')

  const [modalIsOpen, setIsOpen] = useState(true)

  const [preview, setPreview] = useState('')
  const [saveCrop, setSaveCrop] = useState(false)
  const [isChangePassword, setChangePassword] = useState(false)
  const userData = useAppSelector(userSelector)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormInputs>({
    resolver: yupResolver(schema)
  })
  const firstNameWatch = watch('firstName', '')
  const lastNameWatch = watch('lastName', '')
  const passwordWatch = watch('password', '')

  useEffect(() => {
    if (userData.firstName !== firstNameWatch) {
      setValue('firstName', userData.firstName)
    }
    if (userData.lastName !== lastNameWatch) {
      setValue('lastName', userData.lastName)
    }
    if (userData.avatar && userData.avatar !== fileUrl) {
      setFileUrl(userData.avatar)
    }
    setValue('email', userData.email)
  }, [userData])

  const dropHandler = async (acceptedFiles: any[]) => {
    const [File] = acceptedFiles
    setFileUrl(URL.createObjectURL(File))
    setShowModal(true)
  }

  const openModal = () => {
    setIsOpen(true)
    setShowModal(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    if (!saveCrop) {
      setFileUrl('')
    }
  }

  const onClose = () => {
    setPreview('')
  }

  const saveImage = async () => {
    setSaveCrop(true)
    setIsOpen(false)
    const file = await urlToFile(preview, 'uploaded_avt.png')
    setFile(file)
  }

  const onCrop = (preview: any) => {
    setPreview(preview)
  }

  const onBeforeFileLoad = (elem: any) => {
    if (elem.target.files[0].size > 71680) {
      alert('File is too big!')
      elem.target.value = ''
    }
  }
  const handleChangePassword = () => {
    setChangePassword(!isChangePassword)
  }
  return (
    <Box
      position="relative"
      style={{ background: "url('images/map-black.png')" }}
    >
      <StyledContainer>
        <Box
          className={classes.oneRow}
          style={{
            justifyContent: 'space-between',
            paddingRight: 0,
            paddingLeft: 0
          }}
        >
          <Box>
            <Box className={classes.subtitle}>MY PROFILE</Box>
          </Box>
        </Box>
        <Box display={'flex'} justifyContent={'center'} mt={'19px'}>
          <Box className={classes.profileModal}>
            <Box display={'flex'} justifyContent={'center'} mb={'28px'}>
              <Preview>
                {fileUrl === '' ? (
                  <span>A</span>
                ) : (
                  <img
                    src={saveCrop ? preview : fileUrl}
                    width="100%"
                    height="100%"
                    alt="Avatar"
                    onClick={openModal}
                  />
                )}
              </Preview>
            </Box>
            <Dropzone
              maxFiles={1}
              accept={['image/png', 'image/jpeg', 'image/gif']}
              onDrop={(acceptedFiles) => dropHandler(acceptedFiles)}
            >
              {({ getRootProps, getInputProps }) => (
                <Box display={'flex'} justifyContent={'center'}>
                  <StyledDropZone
                    className={classes.dropZone}
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    <Box width={'227px'} className={classnames(classes.addBut)}>
                      Upload profile photo
                    </Box>
                  </StyledDropZone>
                </Box>
              )}
            </Dropzone>
            {fileUrl !== '' && showModal && (
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
              >
                <div className={classes.profileTitle}>
                  <div>Change profile picture</div>
                  <Box onClick={closeModal}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41L17.59 5Z"
                        fill="#182233"
                      />
                    </svg>
                  </Box>
                </div>
                <AvatarBox>
                  <Avatar
                    width={299}
                    imageWidth={299}
                    height={299}
                    cropRadius={50}
                    onCrop={(_preview: any) => onCrop(_preview)}
                    onClose={() => onClose()}
                    onBeforeFileLoad={(elem: any) => onBeforeFileLoad(elem)}
                    src={fileUrl}
                  />
                </AvatarBox>
                {/* <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <img src={"/images/slide_s.png"} alt="" />
                  <PrettoSlider
                    value={cropValue}
                    onChange={handleCropValuechange}
                    valueLabelDisplay="auto"
                    aria-label="pretto slider"
                  />
                  <img src={"/images/slide_b.png"} alt="" />
                </Box> */}
                <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                  marginTop={'40px'}
                >
                  <Box className={classes.cancelModal} onClick={closeModal}>
                    <span>Cancel</span>
                  </Box>
                  <Box className={classes.saveImage} onClick={saveImage}>
                    <span>Save Image</span>
                  </Box>
                </Box>
              </Modal>
            )}
            <form>
              <div style={{ marginTop: '31px' }}>
                <Box className={classes.inputTitle}>First Name</Box>
                <input
                  className={classes.inputBox}
                  {...register('firstName')}
                ></input>
                <ErrorMessage
                  fontSize={'12px'}
                  error={errors.firstName?.message}
                ></ErrorMessage>
              </div>
              <div>
                <Box className={classes.inputTitle} mt={'51px'}>
                  Last Name
                </Box>
                <input
                  className={classes.inputBox}
                  {...register('lastName')}
                ></input>
                <ErrorMessage
                  fontSize={'12px'}
                  error={errors.lastName?.message}
                ></ErrorMessage>
              </div>
              <div>
                <Box className={classes.inputTitle} mt={'51px'}>
                  Email
                </Box>
                <input
                  className={classes.inputBox}
                  {...register('email')}
                  disabled
                ></input>
              </div>
              <div>
                <FormControlLabel
                  style={{
                    marginTop: '51px'
                  }}
                  control={
                    <Checkbox
                      checked={isChangePassword}
                      onChange={handleChangePassword}
                    />
                  }
                  label="Change password"
                />
              </div>
              {isChangePassword && (
                <div>
                  <div>
                    <Box className={classes.inputTitle} mt={'20px'}>
                      Old Password
                    </Box>
                    <input
                      className={classes.inputBox}
                      {...register('oldPassword')}
                    ></input>
                    <ErrorMessage
                      fontSize={'12px'}
                      error={errors.oldPassword?.message}
                    ></ErrorMessage>
                  </div>
                  <div>
                    <Box className={classes.inputTitle} mt={'31px'}>
                      Password
                    </Box>
                    <input
                      className={classes.inputBox}
                      {...register('password')}
                    ></input>
                    <ErrorMessage
                      fontSize={'12px'}
                      error={errors.password?.message}
                    ></ErrorMessage>
                    <PasswordCheck password={passwordWatch} />
                  </div>
                </div>
              )}
              <Box display={'flex'} justifyContent={'center'} mt={'31px'}>
                <UpdateButton>Update</UpdateButton>
              </Box>
            </form>
          </Box>
        </Box>
      </StyledContainer>
    </Box>
  )
}

const StyledContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  position: 'absolute';
`

const Preview = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  /* background : rgba(255, 255, 255, .025); */
  box-shadow: 0px 0px 8px 0px rgb(0 0 0 / 30%);
  max-width: 158px;
  max-height: 158px;

  width: 158px;
  height: 158px;
  background: #dcdee9;
  > img {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }

  > span {
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 50px;
    line-height: 65px;
    display: flex;
    align-items: center;
    letter-spacing: -0.015em;

    color: #000000;
  }
`

const StyledDropZone = styled(Box)`
  cursor: pointer;
  background: #2d2e36;
  /* White */
  border: 1px dashed #ffffff;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  border-radius: 10px;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 200px;
  > img {
    width: 100%;
    height: 100%;
  }
`

const useStyles = makeStyles((theme) => ({
  oneRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 15px 0px 15px'
  },
  subtitle: {
    fontSize: '18px',
    fontWeight: 700,
    margin: '16px 0px'
  },

  profileModal: {
    background: '#FFFFFF',
    boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.15)',
    borderRadius: '10px',
    padding: '32px 42px',
    width: '576px'
  },

  inputTitle: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '12px',
    lineHeight: '15px',

    display: 'flex',
    alignItems: 'center',
    letterSpacing: '-0.015em',

    color: '#4B5563'
  },

  addNewTitle: {
    marginTop: '42px',
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '15px',
    display: 'flex',
    alignItems: 'center',
    letterSpacing: '-0.015em'
  },

  inputBox: {
    marginTop: '9px',
    background: '#FFFFFF',
    borderRadius: '6px',
    width: '100%',
    height: '46px',
    filter: 'drop-shadow(0px 1px 10px rgba(156, 163, 175, 0.15))',
    border: 'none',
    outline: 'none',
    padding: '8px'
  },

  addBut: {
    // width: "152px",
    height: '46px',
    background: '#1C39BB',
    borderRadius: '7px',

    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    fontFamily: 'Helvetica',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '14px',
    lineHeight: '16px',
    color: '#D9DDE7',

    cursor: 'pointer'
  },

  dropZone: {
    width: '227px',
    height: '46px'
  },

  profileTitle: {
    fontFamily: 'Dexa Pro',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '22px',
    marginBottom: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    letterSpacing: '-0.01em',
    color: '#1F2937'
  },

  cancelModal: {
    fontFamily: 'Ubuntu',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '20px',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: '-0.01em',
    width: '122px',
    height: '52px',

    color: '#FFFFFF',

    background: '#6B7280',
    borderRadius: '7px',
    cursor: 'pointer'
  },

  saveImage: {
    width: '134px',
    height: '52px',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: '-0.01em',

    /* Gray colors/White */

    color: '#FFFFFF',

    background: '#1C39BB',
    borderRadius: '7px',
    cursor: 'pointer'
  }
}))

const customStyles = {
  content: {
    top: '50%',
    left: '80%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '14px',
    maxWidth: '343px',
    padding: '22px'
  }
}

const AvatarBox = styled(Box)`
  svg {
    display: none;
  }
`

const UpdateButton = styled.button`
  background: #1c39bb;
  border-radius: 6px;
  color: white;
  padding: 16px 0;
  width: 192px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 17px;
  cursor: pointer;
  border: none;
  outline: none;
  &:disabled {
    background: #c4c4c4;
  }
`

export default Profilebody
