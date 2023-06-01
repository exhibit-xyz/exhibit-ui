import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Input,
} from '@chakra-ui/react';
import ModalDetailNew from './ModalDetailNew';

export default function CustomModal({
  modalInfo,
  toggleModal,
  cardInfo,
  isOpen,
}: any) {
  const [showTimer, setShowTimer] = useState(false);
  const [remainingTime, setRemainingTime] = useState(15 * 60);
  const [svgFile, setSvgFile] = useState(null);
  const [bidAmount, setBidAmount] = useState('');

  useEffect(() => {
    let timerId;
    if (showTimer) {
      timerId = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [showTimer]);

  const handlePurchase = () => {
    setShowTimer(true);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleSvgFileChange = (event) => {
    const file = event.target.files[0];
    setSvgFile(file);
  };

  const handleBidAmountChange = (event) => {
    const amount = event.target.value;
    setBidAmount(amount);
  };

  return (
    <div>
      <Modal size='4xl' isOpen={isOpen} onClose={toggleModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" justifyContent="space-between" alignItems="center">
            {modalInfo.Title}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <ModalDetailNew modalInfo={modalInfo} cardInfo={cardInfo} />
          </ModalBody>

          <ModalFooter>
            {!showTimer ? (
              <Flex alignItems="center">
                <Button as="label" htmlFor="svg-file-input" colorScheme='blue' cursor="pointer">
                  SVG Upload
                  <input
                    id="svg-file-input"
                    type="file"
                    accept="image/svg+xml"
                    style={{ display: 'none' }}
                    onChange={handleSvgFileChange}
                  />
                </Button>
                <Input
                  type="text"
                  placeholder="Enter bid amount"
                  value={bidAmount}
                  onChange={handleBidAmountChange}
                  mx={2}
                />
                <Button colorScheme='blue' onClick={handlePurchase}>
                  Bid
                </Button>
              </Flex>
            ) : (
              <span>{formatTime(remainingTime)}</span>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
