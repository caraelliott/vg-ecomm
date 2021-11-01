import React from 'react'
import {Component} from 'react'
import Badge from 'react-bootstrap/Badge'
import styled ,{ createGlobalStyle } from 'styled-components';
import BackImage from './assets/background.png'
import NavbarHead from './components/NavbarHead';
import NavbarVertical from './components/NavbarVertical';


const LoginPage=()=>{
  return(
    
        
    <>
    <GlobalStyle/>
      <NavbarHead/>
      <NavbarVertical/>
      

  </>
  );
            
   
}
const GlobalStyle = createGlobalStyle`
body {
  margin: 10px;

  background-image: url(${BackImage});
  background-size: cover;
 

}`

export default LoginPage


