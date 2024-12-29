import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const LoadingContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Logo = styled(motion.div)`
  color: #00B4D8;
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(0, 180, 216, 0.5);
`;

const ProgressBar = styled(motion.div)`
  width: 300px;
  height: 2px;
  background: rgba(0, 180, 216, 0.2);
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
`;

const Progress = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #00B4D8;
  box-shadow: 0 0 10px rgba(0, 180, 216, 0.5);
`;

const LoadingText = styled(motion.div)`
  color: #00B4D8;
  font-size: 1rem;
  opacity: 0.8;
`;

function LoadingScreen({ progress = 0 }) {
  return (
    <LoadingContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Logo
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        EDC MAIT
      </Logo>
      <ProgressBar>
        <Progress
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </ProgressBar>
      <LoadingText
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.3 }}
      >
        Loading The EDC Experience...
      </LoadingText>
    </LoadingContainer>
  );
}

export default LoadingScreen;