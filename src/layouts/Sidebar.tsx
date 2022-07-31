import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import Box from "@mui/material/Box";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setVisible, setPageName } from "store/handleSidebar";

const Sidebar: React.FC = () => {
  let screenwidth = 0;
  const [selected, setSelected] = useState("");
  const history = useHistory();
  const location = useLocation();
  const visibleSidebar = useSelector((state: any) => state.handleSidebar.value);
  const dispatch = useDispatch();

  window.addEventListener("resize", () => {
    screenwidth = window.screen.width;
    if (window.screen.width > 768) {
      dispatch(setVisible(true));
    } else {
      dispatch(setVisible(false));
    }
  });

  const logout = useCallback(async () => {
    localStorage.removeItem("auth");
    history.push("/login");
  }, []);

  useEffect(() => {
    const pathName = location.pathname;
    switch (pathName) {
      case "/admin/home":
        setSelected("home");
        break;
      case "/admin/rewards":
        setSelected("rewards");
        break;
      case "/admin/validators":
        setSelected("validators");
        break;
      case "/admin/myaddresses":
        setSelected("addresses");
        break;
      case "/admin/myprofile":
        setSelected("profile");
        break;
    }
  }, [location]);

  return (
    <>
      <StyledContainer show={visibleSidebar}>
        <MenuContainer>
          <OneItem
            selected={false}
            style={{ paddingBottom: "25px" }}
            onClick={() => {
              history.push("/admin/home");
              dispatch(setPageName("Home"));
            }}
          >
            <img
              src="/images/Logo-white.png"
              alt="logo"
              style={{ height: "34px" }}
            />
          </OneItem>
          <OneItem
            selected={selected === "home"}
            style={{ border: "none" }}
            onClick={() => {
              history.push("/admin/home");
              setSelected("home");

              dispatch(setVisible(false));
              dispatch(setPageName("Home"));
            }}
          >
            <img src="/images/home_icon.png" alt="home" />
            <Box style={{ marginLeft: "20px" }}>Home</Box>
          </OneItem>
          <OneItem
            selected={selected === "rewards"}
            style={{ border: "none" }}
            onClick={() => {
              history.push("/admin/rewards");
              dispatch(setVisible(false));
              dispatch(setPageName("Rewards"));
            }}
          >
            <img src="/images/gift.png" alt="Rewards" />
            <Box style={{ marginLeft: "20px" }}>Rewards</Box>
          </OneItem>
          <OneItem
            selected={selected === "validators"}
            style={{ border: "none" }}
            onClick={() => {
              history.push("/admin/validators");

              dispatch(setVisible(false));
              dispatch(setPageName("Validators Performance"));
            }}
          >
            <img src="/images/Validators.png" alt="Validators Performance" />
            <Box style={{ marginLeft: "20px" }}>Validators Performance</Box>
          </OneItem>
          <OneItem
            selected={selected === "addresses"}
            style={{ border: "none" }}
            onClick={() => {
              history.push("/admin/myaddresses");

              dispatch(setVisible(false));
              dispatch(setPageName("My Addresses"));
            }}
          >
            <img src="/images/wallet.png" alt="My Addresses" />
            <Box style={{ marginLeft: "20px" }}>My Addresses</Box>
          </OneItem>
          <OneItem
            selected={selected === "profile"}
            onClick={() => {
              history.push("/admin/myprofile");

              dispatch(setVisible(false));
              dispatch(setPageName("My Profile"));
            }}
          >
            <img src="/images/people.png" alt="My Profile" />
            <Box style={{ marginLeft: "20px" }}>My Profile</Box>
          </OneItem>
          <OneItem
            selected={false}
            onClick={() => {
              history.push("/getintouch");

              dispatch(setVisible(false));
            }}
          >
            <img src="/images/support.png" alt="support" />
            <Box style={{ marginLeft: "20px" }}>Support</Box>
          </OneItem>
          <OneItem selected={false} style={{ border: "none" }} onClick={logout}>
            <img src="/images/logout.png" alt="logout" />
            <Box style={{ marginLeft: "20px" }}>Log Out</Box>
          </OneItem>
        </MenuContainer>
        <ContactContainer>
          <img src="/images/github.png" alt="github" />
          <img
            src="/images/twitter.png"
            alt="twitter"
            style={{ marginLeft: "15px" }}
          />
          <img
            src="/images/email.png"
            alt="email"
            style={{ marginLeft: "15px" }}
          />
        </ContactContainer>
      </StyledContainer>
    </>
  );
};

const ContactContainer = styled(Box)`
  display: flex;
  align-items: center;
  padding: 38px 0 38px 28px;
`;
const OneItem = styled.div<{ selected: boolean }>`
  width: 100%;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: ${({ selected }) => (selected ? "#1C39BB" : "transparent")};
  color: white;
  padding: 18px 0px 18px 28px;
  cursor: pointer;
  shadow: none;
  border-bottom: 1px solid rgba(107, 114, 128, 0.5);
  border-top-left-radius: ${({ selected }) => (selected ? "24px" : "0px")};
  border-bottom-left-radius: ${({ selected }) => (selected ? "24px" : "0px")};
  > div {
    width: 100%;
    // height: 100%;
  }
`;
const MenuContainer = styled(Box)`
  padding: 15px 0 38px 0px;
`;
const StyledContainer = styled(Box)<any>`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: space-between;
  padding: 0 0 0 18px;
  background: #182233;
  width: 292px;
  height: 100%;
  font-size: 13px;
  @media (max-width: 768px) {
    // display: none;
    height: 100%;
    /* position: absolute; */
    z-index: 10;
    display: ${({ show }) => (show ? "" : "none")};
  }
`;

export default Sidebar;
