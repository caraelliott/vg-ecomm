import React, { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Table from "react-bootstrap/Table";
import {
  AiOutlinePlusSquare,
  AiOutlineMinusSquare,
  AiFillDelete,
} from "react-icons/ai";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
// import Tooltip from 'react-bootstrap/Tooltip';
import Modal from "react-bootstrap/Modal";

const Basket = ({
  user,
  handleAdd,
  basket,
  setBasket,
  show,
  onHide,
  purchHistory,
  setPurchHistory,
}) => {
  const [newOrder, setNewOrder] = useState([]);
  const [showBuy, setShowBuy] = useState(false);
  const handleClose = () => setShowBuy(false);
  const handleShow = () => setShowBuy(true);
  const totalPrice = basket.reduce(
    (previous, current) =>
      Number((previous + current.price * current.qty).toFixed(2)),
    0
  );
  const taxPrice = Number((totalPrice * 0.1).toFixed(2));
  const shippingCost = totalPrice > 50 || totalPrice === 0 ? 0 : 10;
  const TotalCost = Number((totalPrice + taxPrice + shippingCost).toFixed(2));
  const basketId = basket.map((item) => {
    return { productId: item.id, quantity: item.qty };
  });

  const handleDecrease = (item) => {
    const exist = basket.find((element) => element.id === item.id);
    if (exist.qty === 1) {
      setBasket(
        [...basket].filter(
          (element) => element.productName !== item.productName
        )
      );
    } else {
      setBasket(
        basket.map((element) =>
          item.id === element.id ? { ...exist, qty: exist.qty - 1 } : element
        )
      );
    }
  };
  const handleDel = (item) =>
    setBasket(
      [...basket].filter((element) => element.productName !== item.productName)
    );

  const handleSave = async () => {
    try {
      const obj = JSON.stringify({
        customer: { email: user.email },
        order: basketId,
      });

      await fetch(`${process.env.REACT_APP_BASE_URL}/basket`, {
        mode: "cors",
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: obj,
      });
    } catch (error) {
      console.log("error is ", error);
    }
  };

  const handleBuy = async () => {
    const obj = JSON.stringify({
      customer: { email: user.email },
      order: basketId,
    });

    await fetch(`${process.env.REACT_APP_BASE_URL}/purchase`, {
      mode: "cors",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: obj,
    });
    setNewOrder(basket);
    setBasket([]);
    handleShow();
  };
  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Basket Saved</Popover.Header>
      <Popover.Body>
        Your <strong>Basket</strong> has been saved.
      </Popover.Body>
    </Popover>
  );

  return (
    <div>
      <Offcanvas
        show={show}
        onHide={onHide}
        placement="end"
        style={{ width: "40vw", backgroundColor: "rgb(255,255,255,0.9)" }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Basket </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Table responsive="sm">
            <thead style={{ textAlign: "center" }}>
              <tr>
                <th>Game</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {basket.map((item) => (
                <tr key={item.id}>
                  <td>
                    <AiFillDelete onClick={() => handleDel(item)} />
                    &nbsp;
                    {item.productName}
                  </td>
                  <td>{item.price}</td>
                  <td>
                    <AiOutlineMinusSquare
                      onClick={() => handleDecrease(item)}
                    />
                    &nbsp;
                    {item.qty}&nbsp;
                    <AiOutlinePlusSquare onClick={() => handleAdd(item)} />
                  </td>
                  <td style={{ textAlign: "end" }}>
                    £{Number((item.qty * item.price).toFixed(2))}
                  </td>
                </tr>
              ))}
            </tbody>

            <tbody>
              <tr>
                <td colSpan="3">Total: </td>

                <td style={{ textAlign: "end" }}>£{totalPrice}</td>
              </tr>

              <tr>
                <td colSpan="3">Tax @ 10%</td>

                <td style={{ textAlign: "end" }}>£{taxPrice}</td>
              </tr>
              <tr>
                <td colSpan="3">
                  Shipping Cost
                  <br />
                  (free shipping if you spend 50 and above)
                </td>
                <td style={{ textAlign: "end" }}>£{shippingCost}</td>
              </tr>
              <tr>
                <td colSpan="3">Total to pay:</td>
                <td style={{ textAlign: "end" }}>£{TotalCost}</td>
              </tr>
            </tbody>

            <tfoot>
              <tr>
                <td colSpan="3">
                  <OverlayTrigger
                    trigger="focus"
                    placement="right"
                    overlay={popover}
                  >
                    <Button variant="outline-dark" onClick={handleSave}>
                      Save Basket
                    </Button>
                  </OverlayTrigger>
                </td>
                <td style={{ textAlign: "end" }}>
                  <Button variant="outline-dark" onClick={handleBuy}>
                    Purchase
                  </Button>
                </td>
              </tr>
            </tfoot>
          </Table>
          <Modal show={showBuy} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Order Placed</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Thank you for shopping at <strong>TheGamePortal</strong>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Purchase History</Accordion.Header>
              <Accordion.Body>
                {purchHistory.length > 0 ? (
                  <Table size="sm">
                    <tbody>
                      {purchHistory.map((item, i) => (
                        <tr key={i}>
                          <td>{item.productName}</td>
                          <td>{item.price}</td>
                          <td>{item.qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : null}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>New Order</Accordion.Header>
              <Accordion.Body>
                {newOrder.length > 0 ? (
                  <Table size="sm">
                    <tbody>
                      {newOrder.map((item, i) => (
                        <tr key={i}>
                          <td>{item.productName}</td>
                          <td>{item.price}</td>
                          <td>{item.qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : null}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Basket;
