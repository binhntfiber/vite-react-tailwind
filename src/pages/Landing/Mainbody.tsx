import styled from 'styled-components'
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from "@material-ui/core";
import Box from '@mui/material/Box'
import { useHistory } from 'react-router-dom'

import { useAppSelector } from 'hooks/useApp'
import { networkSelector } from 'store/networksReducer'

const Mainbody: React.FC = () => {
  const history = useHistory()
  const { supportedNetworks } = useAppSelector(networkSelector)
  const networks = supportedNetworks.map((el) => {
    return (
      <SupportedImage key={el.id}>
        <img src={el.image} alt={el.name} />
      </SupportedImage>
    )
  })
  return (
    <StyledContainer>
      <MapContainer>
        <Box>
          <Liquify>Liquify</Liquify>
          <Description>
            Liquify is an all in one staking and management platform customized
            for enterprise and institutional partners
          </Description>
        </Box>
        <ImgContent>
          <img src="/images/map.png" alt="logo" />
        </ImgContent>
      </MapContainer>
      <Box
        style={{
          background: 'url("/images/map-black.png")',
          margin: '85px 0px 126px 0px'
        }}
      >
        <SupportChain>Supported Chains</SupportChain>
        <div className="flex flex-wrap items-center justify-center">
          {networks}
        </div>
      </Box>
      <Contactbar>
        <ReachOutText>
          If you are looking for competitive node or blockchain infrastructure
          please reach out.
        </ReachOutText>
        <Aboutus onClick={() => history.push('/getintouch')}>
          Contact us
        </Aboutus>
      </Contactbar>
    </StyledContainer>
  )
}

const OneRow = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  > img {
    cursor: pointer;
    &:active {
      outline-style: inset;
    }
    &:hover {
      outline: 3px;
    }
    @media (max-width: 900px) {
      max-width: 300px;
    }
    @media (max-width: 500px) {
      max-width: 100px;
    }
  }
`
const SupportChain = styled(Box)`
  font-size: 80px;
  font-weight: 700;
  color: #182233;
  text-align: center;
  margin-bottom: 85px;
  @media (max-width: 900px) {
    font-size: 40px;
    margin-bottom: 40px;
  }
  @media (max-width: 700px) {
    font-size: 20px;
    margin-bottom: 32px;
  }
`
const SupportedImage = styled(Box)`
  background: linear-gradient(
    247.99deg,
    rgba(28, 57, 187, 0.49) 0%,
    rgba(28, 57, 187, 0.78) 48.89%,
    #1c39bb 98.46%
  );
  box-shadow: 20.7171px 36.9949px 66.5908px rgba(23, 18, 43, 0.45);
  backdrop-filter: blur(19.5311px);
  border-radius: 10px;
  max-width: 316px;
  height: 172px;
  padding: 40px;
  margin-left: 30px;
  margin-right: 30px;
  margin-bottom: 24px;

  @media (max-width: 700px) {
    max-width: 200px;
    height: 100px;
  }
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
  }
`
const ImgContent = styled(Box)`
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  > img {
    width: 100%;
    height: auto;
    @media (min-width: 1200px) {
      min-width: 600px;
    }
  }
`
const StyledContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`
const MapContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 120px 70px;
  background: linear-gradient(102.59deg, #ffffff -15.73%, #e8ebf8 126.48%);
  @media (max-width: 900px) {
    padding: 60px 35px;
  }
  @media (max-width: 700px) {
    padding: 30px 18px;
  }
  @media (min-width: 1200px) {
    flex-direction: row;
  }
`
const Liquify = styled(Box)`
  font-size: 150px;
  font-weight: 700;
  color: #030613;
  margin-bottom: 100px;
  @media (max-width: 900px) {
    font-size: 75px;
  }
  @media (max-width: 700px) {
    font-size: 30px;
    margin-bottom: 50px;
  }
  @media (max-width: 500px) {
    font-size: 20px;
    margin-bottom: 30px;
  }
`
const Description = styled(Box)`
  font-size: 36px;
  font-weight: 400;
  @media (max-width: 900px) {
    font-size: 18px;
  }
`
const Contactbar = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #1c39bb;
  color: white;
  padding: 82px 0px;
  text-align: center;
  @media (max-width: 900px) {
    font-size: 18px;
  }
`

const Aboutus = styled.button`
  background: #ffffff;
  border: 1px solid #1c39bb;
  border-radius: 6px;
  font-family: Montserrat;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  color: #1c39bb;
  padding: 17px 56px;
  margin-top: 38px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
    outline: 3px;
  }

  &:active {
    outline-style: inset;
  }
`

const ReachOutText = styled.div`
  max-width: 100%;
  padding: 0 20px;
  font-size: 16px;
  line-height: 24px;
  text-align: center;

  @media (min-width: 1200px) {
    max-width: 1050px;
    padding: 0 40px;
    font-weight: 400;
    font-size: 36px;
    line-height: 50px;
  }
`

export default Mainbody
