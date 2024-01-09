import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { categories } from "../utils/data";
import Loader from "./Loader";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../firebase.config";
import { getAllFoodItems, saveItem } from "../utils/firebaseFunctions";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";

const CreateContainer = () => {
  const [title, setTitle] = useState("");
  const [calories, setCalories] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [fields, setFields] = useState(false);
  const [alertStatus, setAlertStatus] = useState("danger");
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, dispatch] = useStateValue();

  const fetchData = useCallback(async () => {
    await getAllFoodItems().then((data) => {
      dispatch({
        type: actionType.SET_FOOD_ITEMS,
        foodItems: data,
      });
    });
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const uploadImage = (e) => {
    setIsLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(storage, `Images/${Date.now()}-${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
        handleUploadError();
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageAsset(downloadURL);
          handleUploadSuccess();
        });
      }
    );
  };

  const handleUploadSuccess = () => {
    setIsLoading(false);
    setFields(true);
    setMsg("Image uploaded successfully 😊");
    setAlertStatus("success");
    setTimeout(() => {
      setFields(false);
    }, 4000);
  };

  const handleUploadError = () => {
    setIsLoading(false);
    setFields(true);
    setMsg("Error while uploading: Try Again 🙇");
    setAlertStatus("danger");
    setTimeout(() => {
      setFields(false);
    }, 4000);
  };

  const deleteImage = () => {
    setIsLoading(true);
    const deleteRef = ref(storage, imageAsset);
    deleteObject(deleteRef).then(() => {
      setImageAsset(null);
      handleDeleteSuccess();
    });
  };

  const handleDeleteSuccess = () => {
    setIsLoading(false);
    setFields(true);
    setMsg("Image deleted successfully 😊");
    setAlertStatus("success");
    setTimeout(() => {
      setFields(false);
    }, 4000);
  };

  const saveDetails = () => {
    setIsLoading(true);
    try {
      if (!title || !calories || !imageAsset || !price || !category) {
        handleValidationError();
      } else {
        const data = {
          id: `${Date.now()}`,
          title: title,
          imageURL: imageAsset,
          category: category,
          calories: calories,
          qty: 1,
          price: price,
        };
        saveItem(data);
        handleSaveSuccess();
        clearData();
      }
    } catch (error) {
      console.log(error);
      handleSaveError();
    }

    fetchData();
  };

  const handleValidationError = () => {
    setFields(true);
    setMsg("Required fields can't be empty");
    setAlertStatus("danger");
    setTimeout(() => {
      setFields(false);
      setIsLoading(false);
    }, 4000);
  };

  const handleSaveSuccess = () => {
    setIsLoading(false);
    setFields(true);
    setMsg("Data Uploaded successfully 😊");
    setAlertStatus("success");
    setTimeout(() => {
      setFields(false);
    }, 4000);
  };

  const handleSaveError = () => {
    setFields(true);
    setMsg("Error while uploading: Try Again 🙇");
    setAlertStatus("danger");
    setTimeout(() => {
      setFields(false);
      setIsLoading(false);
    }, 4000);
  };

  const clearData = () => {
    setTitle("");
    setImageAsset(null);
    setCalories("");
    setPrice("");
    setCategory("Select Category");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-[90%] md:w-[50%] border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
        {fields && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`w-full p-2 rounded-lg text-center text-lg font-semibold ${
              alertStatus === "danger"
                ? "bg-red-400 text-red-800"
                : "bg-emerald-400 text-emerald-800"
            }`}
          >
            {msg}
          </motion.p>
        )}

        <div className="flex flex-col items-center gap-4">
          {/* Title Input */}
          <input
            type="text"
            placeholder="Enter Title"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Calories Input */}
          <input
            type="number"
            placeholder="Enter Calories"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />

          {/* Price Input */}
          <input
            type="number"
            placeholder="Enter Price"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          {/* Category Dropdown */}
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={category || ""}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Image Upload */}
          <div className="flex flex-col items-center gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="image-upload"
              onChange={uploadImage}
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer text-blue-500"
            >
              {isLoading ? (
                <Loader size={20} />
              ) : (
                <>
                  <MdCloudUpload className="text-xl" />
                  Upload Image
                </>
              )}
            </label>
          </div>

          {/* Display Image */}
          {imageAsset && (
            <div className="relative w-20 h-20">
              <img
                src={imageAsset}
                alt="uploaded"
                className="w-full h-full object-cover rounded-md"
              />
              <motion.div
                className="absolute top-0 right-0 p-1 cursor-pointer bg-red-500 rounded-full"
                onClick={deleteImage}
                whileHover={{ scale: 1.2 }}
              >
                <MdDelete className="text-white" />
              </motion.div>
            </div>
          )}

          {/* Save Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full p-2 rounded-full bg-green-500 text-white"
            onClick={saveDetails}
          >
            Save
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CreateContainer;
