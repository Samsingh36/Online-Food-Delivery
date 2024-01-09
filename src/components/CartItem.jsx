import React, { useEffect, useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import { motion } from "framer-motion";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";

const CartItem = ({ item, setFlag, flag }) => {
  const [{ cartItems }, dispatch] = useStateValue();
  const [qty, setQty] = useState(item.qty);

  const cartDispatch = (updatedItems) => {
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    dispatch({
      type: actionType.SET_CARTITEMS,
      cartItems: updatedItems,
    });
  };

  const updateQty = (action, id) => {
    let updatedItems = [...cartItems];
    
    if (action === "add") {
      setQty(qty + 1);
      updatedItems = updatedItems.map((cartItem) =>
        cartItem.id === id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem
      );
    } else {
      if (qty === 1) {
        updatedItems = updatedItems.filter((cartItem) => cartItem.id !== id);
        setFlag(flag + 1);
      } else {
        setQty(qty - 1);
        updatedItems = updatedItems.map((cartItem) =>
          cartItem.id === id ? { ...cartItem, qty: cartItem.qty - 1 } : cartItem
        );
      }
    }

    cartDispatch(updatedItems);
  };

  useEffect(() => {
    setQty(item.qty);
  }, [item.qty]);

  return (
    <div className="w-full p-1 px-2 rounded-lg bg-cartItem flex items-center gap-2">
      <img
        src={item?.imageURL}
        className="w-20 h-20 max-w-[60px] rounded-full object-contain"
        alt=""
      />

      {/* name section */}
      <div className="flex flex-col gap-2">
        <p className="text-base text-gray-50">{item?.title}</p>
        <p className="text-sm block text-gray-300 font-semibold">
          Rs. {parseFloat(item?.price) * qty}
        </p>
      </div>

      {/* button section */}
      <div className="group flex items-center gap-2 ml-auto cursor-pointer">
        <motion.div
          whileTap={{ scale: 0.75 }}
          onClick={() => updateQty("remove", item?.id)}
        >
          <BiMinus className="text-gray-50 " />
        </motion.div>

        <p className="w-5 h-5 rounded-sm bg-cartBg text-gray-50 flex items-center justify-center">
          {qty}
        </p>

        <motion.div
          whileTap={{ scale: 0.75 }}
          onClick={() => updateQty("add", item?.id)}
        >
          <BiPlus className="text-gray-50 " />
        </motion.div>
      </div>
    </div>
  );
};

export default CartItem;
